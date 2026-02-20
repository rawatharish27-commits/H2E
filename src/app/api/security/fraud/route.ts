import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Fraud Detection Configuration
const FRAUD_CONFIG = {
  MAX_DEVICES_PER_ACCOUNT: 2,        // Max devices allowed per account
  MAX_ACCOUNTS_PER_DEVICE: 1,        // Max accounts allowed per device
  MAX_ACCOUNTS_PER_IP: 3,            // Max accounts allowed per IP (same household)
  MAX_IP_CHANGES_PER_DAY: 5,         // Max IP changes allowed per day
  GPS_SPOOF_THRESHOLD: 500,          // km/h - impossible travel speed
  SUSPICIOUS_ACTIVITY_THRESHOLD: 3,   // Strikes before flagging
}

// GET - Get fraud status and security audit logs
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'

    if (action === 'status') {
      // Get user's security status
      const deviceBindings = await db.deviceBinding.findMany({
        where: { userId: user.id }
      })

      const securityAudits = await db.securityAudit.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      return NextResponse.json({
        success: true,
        status: {
          deviceFingerprint: user.deviceFingerprint,
          registeredIP: user.registeredIP,
          lastLoginIP: user.lastLoginIP,
          suspectedMultiAccount: user.suspectedMultiAccount,
          isFlagged: user.isFlagged,
          devicesCount: deviceBindings.length,
          isPrimaryDevice: deviceBindings.find(d => d.deviceFingerprint === user.deviceFingerprint)?.isPrimary || false
        },
        devices: deviceBindings.map(d => ({
          fingerprint: d.deviceFingerprint,
          deviceName: d.deviceName,
          deviceType: d.deviceType,
          isPrimary: d.isPrimary,
          isBlocked: d.isBlocked,
          lastUsedAt: d.lastUsedAt
        })),
        recentAudits: securityAudits.map(a => ({
          type: a.eventType,
          severity: a.severity,
          description: a.description,
          resolved: a.resolved,
          createdAt: a.createdAt
        }))
      })
    }

    if (action === 'check-device') {
      const fingerprint = searchParams.get('fingerprint')
      
      if (!fingerprint) {
        return NextResponse.json({ error: 'Device fingerprint required' }, { status: 400 })
      }

      // Check if device is already bound to another account
      const existingBinding = await db.deviceBinding.findFirst({
        where: {
          deviceFingerprint: fingerprint,
          userId: { not: user.id }
        },
        include: { user: { select: { id: true, phone: true } } }
      })

      const currentUserBindings = await db.deviceBinding.count({
        where: { userId: user.id }
      })

      return NextResponse.json({
        success: true,
        deviceStatus: {
          isAlreadyUsed: !!existingBinding,
          canBind: currentUserBindings < FRAUD_CONFIG.MAX_DEVICES_PER_ACCOUNT,
          currentBindingsCount: currentUserBindings,
          maxDevices: FRAUD_CONFIG.MAX_DEVICES_PER_ACCOUNT
        },
        warning: existingBinding 
          ? 'This device is already linked to another account'
          : currentUserBindings >= FRAUD_CONFIG.MAX_DEVICES_PER_ACCOUNT
            ? 'Maximum device limit reached for this account'
            : null
      })
    }

    if (action === 'check-ip') {
      const ip = searchParams.get('ip') || request.headers.get('x-forwarded-for') || 'unknown'
      
      // Check accounts using same IP
      const accountsWithSameIP = await db.user.count({
        where: {
          OR: [
            { registeredIP: ip },
            { lastLoginIP: ip }
          ],
          id: { not: user.id }
        }
      })

      return NextResponse.json({
        success: true,
        ipStatus: {
          ip,
          accountsOnSameIP: accountsWithSameIP,
          maxAllowed: FRAUD_CONFIG.MAX_ACCOUNTS_PER_IP,
          isWarning: accountsWithSameIP >= FRAUD_CONFIG.MAX_ACCOUNTS_PER_IP
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Fraud check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Register device, update IP, detect fraud
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, deviceFingerprint, deviceName, deviceType, osInfo, lat, lng } = body

    // Get client IP
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    if (action === 'register-device') {
      if (!deviceFingerprint) {
        return NextResponse.json({ error: 'Device fingerprint required' }, { status: 400 })
      }

      // Check if device already bound
      const existingBinding = await db.deviceBinding.findUnique({
        where: { deviceFingerprint }
      })

      if (existingBinding && existingBinding.userId !== user.id) {
        // Device bound to another account - potential multi-account
        await db.securityAudit.create({
          data: {
            userId: user.id,
            eventType: 'MULTI_ACCOUNT',
            severity: 'HIGH',
            description: `Attempted to register device already bound to another account`,
            deviceFingerprint,
            ipAddress: clientIP
          }
        })

        await db.user.update({
          where: { id: user.id },
          data: { suspectedMultiAccount: true }
        })

        return NextResponse.json({
          success: false,
          error: 'Device already linked to another account',
          isFraudSuspected: true
        }, { status: 403 })
      }

      // Check device count for user
      const currentDeviceCount = await db.deviceBinding.count({
        where: { userId: user.id }
      })

      if (currentDeviceCount >= FRAUD_CONFIG.MAX_DEVICES_PER_ACCOUNT && !existingBinding) {
        return NextResponse.json({
          success: false,
          error: 'Maximum device limit reached'
        }, { status: 403 })
      }

      // Register or update device
      const binding = await db.deviceBinding.upsert({
        where: { deviceFingerprint },
        create: {
          userId: user.id,
          deviceFingerprint,
          deviceName,
          deviceType,
          osInfo,
          isPrimary: currentDeviceCount === 0
        },
        update: {
          lastUsedAt: new Date(),
          deviceName,
          deviceType,
          osInfo
        }
      })

      // Update user's device fingerprint if primary
      if (binding.isPrimary) {
        await db.user.update({
          where: { id: user.id },
          data: {
            deviceFingerprint,
            lastLoginIP: clientIP,
            lastActiveAt: new Date()
          }
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Device registered successfully',
        isPrimary: binding.isPrimary
      })
    }

    if (action === 'update-location') {
      if (!lat || !lng) {
        return NextResponse.json({ error: 'Location required' }, { status: 400 })
      }

      // Check for GPS spoofing (impossible travel)
      if (user.lat && user.lng && user.locationUpdatedAt) {
        const lastUpdate = new Date(user.locationUpdatedAt)
        const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceUpdate < 1) { // Less than 1 hour
          const distance = calculateDistance(
            user.lat, user.lng,
            lat, lng
          )
          
          const speed = distance / hoursSinceUpdate // km/h

          if (speed > FRAUD_CONFIG.GPS_SPOOF_THRESHOLD) {
            // Impossible travel detected
            await db.securityAudit.create({
              data: {
                userId: user.id,
                eventType: 'GPS_SPOOF',
                severity: 'HIGH',
                description: `Impossible travel detected: ${Math.round(distance)}km in ${hoursSinceUpdate.toFixed(2)} hours (${Math.round(speed)} km/h)`,
                lat,
                lng,
                deviceFingerprint: user.deviceFingerprint,
                ipAddress: clientIP
              }
            })

            // Flag user
            await db.user.update({
              where: { id: user.id },
              data: { isFlagged: true }
            })

            return NextResponse.json({
              success: false,
              error: 'GPS anomaly detected. Location not updated.',
              isFlagged: true
            }, { status: 403 })
          }
        }
      }

      // Update location
      await db.user.update({
        where: { id: user.id },
        data: {
          lat,
          lng,
          locationUpdatedAt: new Date(),
          lastActiveAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Location updated'
      })
    }

    if (action === 'update-ip') {
      // Check for IP changes
      if (user.lastLoginIP && user.lastLoginIP !== clientIP) {
        // Get IP history
        const ipHistory = user.ipHistory ? JSON.parse(user.ipHistory) : []
        
        // Count recent IP changes (last 24 hours)
        const recentChanges = ipHistory.filter(
          (ip: any) => Date.now() - new Date(ip.timestamp).getTime() < 24 * 60 * 60 * 1000
        ).length

        if (recentChanges >= FRAUD_CONFIG.MAX_IP_CHANGES_PER_DAY) {
          await db.securityAudit.create({
            data: {
              userId: user.id,
              eventType: 'SUSPICIOUS_LOGIN',
              severity: 'MEDIUM',
              description: `Too many IP changes in 24 hours: ${recentChanges + 1}`,
              ipAddress: clientIP
            }
          })
        }

        // Update IP history
        ipHistory.push({ ip: clientIP, timestamp: new Date().toISOString() })
        
        // Keep only last 20 entries
        const recentIPHistory = ipHistory.slice(-20)

        await db.user.update({
          where: { id: user.id },
          data: {
            lastLoginIP: clientIP,
            ipHistory: JSON.stringify(recentIPHistory),
            lastActiveAt: new Date()
          }
        })
      } else if (!user.registeredIP) {
        // First time - set registered IP
        await db.user.update({
          where: { id: user.id },
          data: {
            registeredIP: clientIP,
            lastLoginIP: clientIP
          }
        })
      }

      return NextResponse.json({
        success: true,
        ip: clientIP
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Fraud detection error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper: Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
