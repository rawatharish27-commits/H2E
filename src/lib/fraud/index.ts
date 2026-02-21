/**
 * Enhanced Fraud Detection Service
 * Multi-account detection, device binding, IP tracking
 */

import { db } from '@/lib/db'

// Configuration
const MAX_DEVICES_PER_ACCOUNT = 2
const MAX_ACCOUNTS_PER_DEVICE = 1
const MAX_ACCOUNTS_PER_IP = 3
const SUSPICIOUS_IP_THRESHOLD = 5

export interface FraudCheckResult {
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  indicators: string[]
  action: 'ALLOW' | 'FLAG' | 'BLOCK' | 'REVIEW'
  multiAccountDetected: boolean
}

/**
 * Check for multi-account fraud using device fingerprint
 */
export async function checkMultiAccountByDevice(
  deviceFingerprint: string,
  excludeUserId?: string
): Promise<{
  accountCount: number
  userIds: string[]
  isSuspicious: boolean
}> {
  const sessions = await db.session.findMany({
    where: {
      deviceFingerprint,
      ...(excludeUserId && { userId: { not: excludeUserId } })
    },
    select: { userId: true }
  })

  const userIds = [...new Set(sessions.map(s => s.userId))]
  const accountCount = userIds.length

  return {
    accountCount,
    userIds,
    isSuspicious: accountCount >= MAX_ACCOUNTS_PER_DEVICE
  }
}

/**
 * Check for multi-account fraud by IP address
 */
export async function checkMultiAccountByIP(
  ipAddress: string,
  excludeUserId?: string
): Promise<{
  accountCount: number
  userIds: string[]
  isSuspicious: boolean
}> {
  const sessions = await db.session.findMany({
    where: {
      ipAddress,
      ...(excludeUserId && { userId: { not: excludeUserId } })
    },
    select: { userId: true }
  })

  const users = await db.user.findMany({
    where: {
      registeredIP: ipAddress,
      ...(excludeUserId && { id: { not: excludeUserId } })
    },
    select: { id: true }
  })

  const userIds = [...new Set([...sessions.map(s => s.userId), ...users.map(u => u.id)])]
  const accountCount = userIds.length

  return {
    accountCount,
    userIds,
    isSuspicious: accountCount >= MAX_ACCOUNTS_PER_IP
  }
}

/**
 * Check for duplicate UPI IDs
 */
export async function checkDuplicateUPI(
  upiId: string,
  excludeUserId?: string
): Promise<{
  isDuplicate: boolean
  userIds: string[]
}> {
  const payments = await db.payment.findMany({
    where: {
      upiId,
      status: { in: ['APPROVED', 'PENDING'] },
      ...(excludeUserId && { userId: { not: excludeUserId } })
    },
    select: { userId: true }
  })

  const userIds = [...new Set(payments.map(p => p.userId))]

  return {
    isDuplicate: userIds.length > 0,
    userIds
  }
}

/**
 * Comprehensive fraud check for new session/registration
 */
export async function performFraudCheck(params: {
  userId?: string
  deviceFingerprint?: string
  ipAddress?: string
  upiId?: string
}): Promise<FraudCheckResult> {
  const indicators: string[] = []
  let riskScore = 0
  let multiAccountDetected = false

  // Check device fingerprint
  if (params.deviceFingerprint) {
    const deviceCheck = await checkMultiAccountByDevice(
      params.deviceFingerprint,
      params.userId
    )
    
    if (deviceCheck.isSuspicious) {
      indicators.push(`Multiple accounts (${deviceCheck.accountCount}) on same device`)
      riskScore += 40
      multiAccountDetected = true
    }
  }

  // Check IP address
  if (params.ipAddress) {
    const ipCheck = await checkMultiAccountByIP(params.ipAddress, params.userId)
    
    if (ipCheck.accountCount >= SUSPICIOUS_IP_THRESHOLD) {
      indicators.push(`High account count (${ipCheck.accountCount}) from same IP`)
      riskScore += 30
      multiAccountDetected = true
    } else if (ipCheck.accountCount >= MAX_ACCOUNTS_PER_IP) {
      indicators.push(`Multiple accounts (${ipCheck.accountCount}) from same IP`)
      riskScore += 20
    }
  }

  // Check UPI duplicate
  if (params.upiId) {
    const upiCheck = await checkDuplicateUPI(params.upiId, params.userId)
    
    if (upiCheck.isDuplicate) {
      indicators.push('UPI ID already used by another account')
      riskScore += 25
    }
  }

  // Check user history if provided
  if (params.userId) {
    const user = await db.user.findUnique({
      where: { id: params.userId },
      select: {
        trustScore: true,
        noShowCount: true,
        reportCount: true,
        createdAt: true
      }
    })

    if (user) {
      // Low trust score
      if (user.trustScore < 30) {
        indicators.push('Very low trust score')
        riskScore += 20
      }

      // Account age
      const accountAge = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      if (accountAge < 1) {
        indicators.push('Very new account (< 24 hours)')
        riskScore += 15
      }

      // No-show history
      if (user.noShowCount > 3) {
        indicators.push('Multiple no-shows')
        riskScore += 15
      }

      // Report history
      if (user.reportCount > 2) {
        indicators.push('Multiple reports received')
        riskScore += 15
      }
    }
  }

  // Determine risk level and action
  let risk: FraudCheckResult['risk'] = 'LOW'
  let action: FraudCheckResult['action'] = 'ALLOW'

  if (riskScore >= 70) {
    risk = 'CRITICAL'
    action = 'BLOCK'
  } else if (riskScore >= 50) {
    risk = 'HIGH'
    action = 'REVIEW'
  } else if (riskScore >= 25) {
    risk = 'MEDIUM'
    action = 'FLAG'
  }

  return {
    risk,
    indicators,
    action,
    multiAccountDetected
  }
}

/**
 * Log security event
 */
export async function logSecurityEvent(params: {
  userId?: string
  eventType: string
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL'
  description: string
  metadata?: Record<string, unknown>
  deviceFingerprint?: string
  ipAddress?: string
  userAgent?: string
  lat?: number
  lng?: number
}): Promise<void> {
  await db.securityAudit.create({
    data: {
      userId: params.userId,
      eventType: params.eventType,
      severity: params.severity,
      description: params.description,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      deviceFingerprint: params.deviceFingerprint,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      lat: params.lat,
      lng: params.lng,
      resolved: false
    }
  })

  console.log(`[Security] ${params.severity}: ${params.eventType} - ${params.description}`)
}

/**
 * Auto-flag suspicious accounts
 */
export async function autoFlagSuspiciousAccounts(): Promise<number> {
  let flagged = 0

  // Find accounts with multiple suspicious indicators
  const suspiciousUsers = await db.user.findMany({
    where: {
      OR: [
        { suspectedMultiAccount: true },
        { trustScore: { lt: 20 } },
        { noShowStrikes: { gte: 3 } }
      ],
      isBanned: false,
      isBlocked: false
    },
    select: {
      id: true,
      trustScore: true,
      noShowStrikes: true,
      suspectedMultiAccount: true
    }
  })

  for (const user of suspiciousUsers) {
    // Check for linked accounts via device fingerprint
    const sessions = await db.session.findMany({
      where: { userId: user.id },
      select: { deviceFingerprint: true }
    })

    const deviceFps = sessions.map(s => s.deviceFingerprint).filter(Boolean) as string[]

    if (deviceFps.length > 0) {
      for (const fp of deviceFps) {
        const otherSessions = await db.session.findMany({
          where: {
            deviceFingerprint: fp,
            userId: { not: user.id }
          },
          select: { userId: true }
        })

        if (otherSessions.length > 0) {
          const linkedIds = [...new Set(otherSessions.map(s => s.userId))]
          
          // Update user with linked accounts
          await db.user.update({
            where: { id: user.id },
            data: {
              suspectedMultiAccount: true,
              linkedAccounts: JSON.stringify(linkedIds),
              isFlagged: true
            }
          })

          // Log security event
          await logSecurityEvent({
            userId: user.id,
            eventType: 'MULTI_ACCOUNT',
            severity: 'HIGH',
            description: `Account linked to ${linkedIds.length} other account(s) via device fingerprint`,
            metadata: { linkedUserIds: linkedIds, deviceFingerprint: fp }
          })

          flagged++
        }
      }
    }
  }

  console.log(`[Security] Auto-flagged ${flagged} suspicious accounts`)
  return flagged
}

/**
 * Get fraud statistics for admin dashboard
 */
export async function getFraudStats() {
  const [
    totalFlagged,
    multiAccountSuspects,
    lowTrustUsers,
    recentSecurityEvents
  ] = await Promise.all([
    db.user.count({ where: { isFlagged: true } }),
    db.user.count({ where: { suspectedMultiAccount: true } }),
    db.user.count({ where: { trustScore: { lt: 30 } } }),
    db.securityAudit.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    })
  ])

  return {
    totalFlagged,
    multiAccountSuspects,
    lowTrustUsers,
    recentSecurityEvents
  }
}
