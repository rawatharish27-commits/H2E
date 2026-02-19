// Device Binding and Multi-Account Detection System
// Implements: One device ↔ one account (soft binding)
// Detects: Multiple accounts, temporary SIMs, suspicious activity

import { db } from '@/lib/db'
import { createHash } from 'crypto'

export interface DeviceInfo {
  fingerprint: string
  userAgent: string
  screen: string
  timezone: string
  language: string
  platform: string
  deviceMemory?: number
  cpuCores?: number
  touchSupport: boolean
  colorDepth: number
  pixelRatio: number
}

export interface DeviceBindingResult {
  allowed: boolean
  isNewDevice: boolean
  existingAccounts: string[]
  warning?: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

/**
 * Generate device fingerprint from device info
 */
export function generateDeviceFingerprint(info: Omit<DeviceInfo, 'fingerprint'>): string {
  const components = [
    info.userAgent,
    info.screen,
    info.timezone,
    info.language,
    info.platform,
    info.colorDepth?.toString() || '',
    info.pixelRatio?.toString() || '',
    info.touchSupport ? '1' : '0',
    info.deviceMemory?.toString() || '',
    info.cpuCores?.toString() || ''
  ]
  
  const combined = components.join('|')
  return createHash('sha256').update(combined).digest('hex').substring(0, 32)
}

/**
 * Check device binding status
 */
export async function checkDeviceBinding(
  userId: string,
  deviceFingerprint: string,
  deviceName?: string
): Promise<DeviceBindingResult> {
  // Check if this device is already bound to another user
  const existingBinding = await db.deviceBinding.findUnique({
    where: { deviceFingerprint },
    include: { user: true }
  })
  
  // Check for existing device bindings for this user
  const userDevices = await db.deviceBinding.findMany({
    where: { userId, isBlocked: false }
  })
  
  // Find all accounts using this device
  const existingAccounts: string[] = []
  if (existingBinding && existingBinding.userId !== userId) {
    existingAccounts.push(existingBinding.userId)
    
    // Check for shadow banned users on this device
    if (existingBinding.user.isShadowBanned || existingBinding.user.isBanned) {
      return {
        allowed: false,
        isNewDevice: false,
        existingAccounts,
        warning: 'Device previously used by banned account',
        riskLevel: 'CRITICAL'
      }
    }
  }
  
  // Determine risk level
  let riskLevel: DeviceBindingResult['riskLevel'] = 'LOW'
  let warning: string | undefined
  
  // New device for existing user
  if (!existingBinding || existingBinding.userId === userId) {
    // Check for multiple devices
    if (userDevices.length >= 3) {
      riskLevel = 'MEDIUM'
      warning = 'User has multiple devices registered'
    }
    
    return {
      allowed: true,
      isNewDevice: !existingBinding || existingBinding.userId !== userId,
      existingAccounts,
      warning,
      riskLevel
    }
  }
  
  // Device used by another account
  if (existingAccounts.length > 0) {
    riskLevel = 'HIGH'
    warning = 'Device is already linked to another account'
    
    // Log security event
    await logSecurityEvent({
      userId,
      eventType: 'MULTI_ACCOUNT_DETECTED',
      severity: 'HIGH',
      description: `Device ${deviceFingerprint.substring(0, 8)}... used by multiple accounts`,
      metadata: JSON.stringify({ existingAccounts }),
      deviceFingerprint
    })
  }
  
  return {
    allowed: riskLevel !== 'CRITICAL',
    isNewDevice: false,
    existingAccounts,
    warning,
    riskLevel
  }
}

/**
 * Register or update device binding
 */
export async function registerDevice(
  userId: string,
  deviceInfo: DeviceInfo,
  ipAddress?: string
): Promise<{ success: boolean; isPrimary: boolean }> {
  try {
    // Check existing devices
    const existingDevices = await db.deviceBinding.count({
      where: { userId, isBlocked: false }
    })
    
    const isPrimary = existingDevices === 0
    
    // Upsert device binding
    await db.deviceBinding.upsert({
      where: { deviceFingerprint: deviceInfo.fingerprint },
      create: {
        userId,
        deviceFingerprint: deviceInfo.fingerprint,
        deviceName: detectDeviceName(deviceInfo),
        deviceType: detectDeviceType(deviceInfo),
        osInfo: detectOS(deviceInfo),
        isPrimary
      },
      update: {
        lastUsedAt: new Date(),
        isPrimary: isPrimary || undefined
      }
    })
    
    return { success: true, isPrimary }
  } catch (error) {
    console.error('Device registration failed:', error)
    return { success: false, isPrimary: false }
  }
}

/**
 * Detect multiple accounts from same device/IP
 */
export async function detectMultipleAccounts(
  userId: string,
  deviceFingerprint: string,
  ipAddress?: string
): Promise<{ count: number; accounts: string[] }> {
  const accounts = new Set<string>()
  
  // Check by device
  const deviceAccounts = await db.deviceBinding.findMany({
    where: {
      deviceFingerprint,
      NOT: { userId }
    },
    select: { userId: true }
  })
  
  deviceAccounts.forEach(d => accounts.add(d.userId))
  
  // Check by IP (recent sessions)
  if (ipAddress) {
    const ipAccounts = await db.session.findMany({
      where: {
        ipAddress,
        NOT: { userId },
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 days
      },
      select: { userId: true }
    })
    
    ipAccounts.forEach(s => accounts.add(s.userId))
  }
  
  return {
    count: accounts.size,
    accounts: Array.from(accounts)
  }
}

/**
 * Shadow ban user silently
 */
export async function shadowBanUser(
  userId: string,
  reason: string,
  adminId: string = 'system'
): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: {
        isShadowBanned: true,
        isFlagged: true
      }
    }),
    db.adminLog.create({
      data: {
        adminId,
        action: 'SHADOW_BAN',
        targetType: 'USER',
        targetId: userId,
        reason
      }
    }),
    logSecurityEvent({
      userId,
      eventType: 'SHADOW_BAN_APPLIED',
      severity: 'CRITICAL',
      description: `User shadow banned: ${reason}`
    })
  ])
}

/**
 * Check if user should be invisible (shadow banned or restricted)
 */
export async function isUserInvisible(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { 
      isShadowBanned: true, 
      isBanned: true, 
      isBlocked: true,
      noShowStrikes: true,
      trustScore: true
    }
  })
  
  if (!user) return true
  
  // Shadow banned
  if (user.isShadowBanned) return true
  
  // Banned
  if (user.isBanned) return true
  
  // 3 strikes = invisible
  if (user.noShowStrikes >= 3) return true
  
  // Very low trust score
  if (user.trustScore < 20) return true
  
  return false
}

/**
 * Apply silent penalty without notifying user
 */
export async function applySilentPenalty(
  userId: string,
  penalty: 'visibility_reduction' | 'trust_penalty' | 'strike',
  reason: string
): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { trustScore: true, noShowStrikes: true }
  })
  
  if (!user) return
  
  switch (penalty) {
    case 'visibility_reduction':
      // Reduce visibility radius (stored in user metadata)
      await db.securityAudit.create({
        data: {
          userId,
          eventType: 'VISIBILITY_REDUCED',
          severity: 'WARNING',
          description: reason
        }
      })
      break
      
    case 'trust_penalty':
      await db.user.update({
        where: { id: userId },
        data: { trustScore: Math.max(0, user.trustScore - 10) }
      })
      break
      
    case 'strike':
      const newStrikes = user.noShowStrikes + 1
      await db.user.update({
        where: { id: userId },
        data: {
          noShowStrikes: newStrikes,
          trustScore: Math.max(0, user.trustScore - 10),
          ...(newStrikes >= 3 && { isShadowBanned: true })
        }
      })
      break
  }
}

/**
 * Log security event
 */
async function logSecurityEvent(data: {
  userId?: string
  eventType: string
  severity: string
  description: string
  metadata?: string
  deviceFingerprint?: string
  ipAddress?: string
}): Promise<void> {
  await db.securityAudit.create({
    data: {
      userId: data.userId,
      eventType: data.eventType,
      severity: data.severity,
      description: data.description,
      metadata: data.metadata,
      deviceFingerprint: data.deviceFingerprint
    }
  })
}

/**
 * Helper functions
 */
function detectDeviceName(info: DeviceInfo): string {
  const ua = info.userAgent.toLowerCase()
  
  if (ua.includes('iphone')) return 'iPhone'
  if (ua.includes('ipad')) return 'iPad'
  if (ua.includes('android')) {
    if (ua.includes('mobile')) return 'Android Phone'
    return 'Android Tablet'
  }
  if (ua.includes('windows')) return 'Windows PC'
  if (ua.includes('mac')) return 'Mac'
  if (ua.includes('linux')) return 'Linux PC'
  
  return 'Unknown Device'
}

function detectDeviceType(info: DeviceInfo): string {
  const ua = info.userAgent.toLowerCase()
  
  if (ua.includes('mobile') || ua.includes('iphone')) return 'mobile'
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet'
  
  return 'desktop'
}

function detectOS(info: DeviceInfo): string {
  const ua = info.userAgent.toLowerCase()
  
  if (ua.includes('android')) return 'Android'
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS'
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('mac')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  
  return 'Unknown'
}
