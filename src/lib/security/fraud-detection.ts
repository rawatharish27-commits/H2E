// Fraud Detection System
import { db } from '@/lib/db'

interface FraudIndicators {
  impossibleTravel: boolean
  multipleAccounts: boolean
  suspiciousPattern: boolean
  deviceFingerprint: boolean
  velocityViolation: boolean
}

interface RiskAssessment {
  score: number
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  indicators: string[]
  recommendation: 'ALLOW' | 'MONITOR' | 'REVIEW' | 'BLOCK'
}

// Detect GPS spoofing
export async function detectGPSpoofing(
  userId: string,
  newLat: number,
  newLng: number,
  timestamp: Date = new Date()
): Promise<{ spoofed: boolean; reason?: string }> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { lat: true, lng: true, locationUpdatedAt: true }
  })
  
  if (!user || !user.lat || !user.lng) {
    return { spoofed: false }
  }
  
  const prevLat = user.lat
  const prevLng = user.lng
  const prevTime = user.locationUpdatedAt ? new Date(user.locationUpdatedAt) : new Date(0)
  
  // Calculate distance traveled
  const distance = calculateDistanceKm(prevLat, prevLng, newLat, newLng)
  
  // Calculate time difference in hours
  const hoursDiff = (timestamp.getTime() - prevTime.getTime()) / (1000 * 60 * 60)
  
  // If time difference is less than 1 hour, check for impossible travel
  if (hoursDiff < 1 && hoursDiff > 0) {
    const speedKmh = distance / hoursDiff
    
    // Maximum reasonable speed: 200 km/h (car/train)
    if (speedKmh > 200) {
      return {
        spoofed: true,
        reason: `Impossible travel detected: ${distance.toFixed(1)}km in ${(hoursDiff * 60).toFixed(0)} minutes`
      }
    }
  }
  
  return { spoofed: false }
}

// Calculate distance between two points (Haversine)
function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Detect suspicious activity patterns
export async function detectSuspiciousActivity(userId: string): Promise<RiskAssessment> {
  const indicators: string[] = []
  let score = 0
  
  // Check recent activity
  const recentProblems = await db.problem.count({
    where: {
      postedById: userId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
  })
  
  // High posting velocity
  if (recentProblems > 20) {
    score += 30
    indicators.push('High problem posting velocity')
  }
  
  // Check for multiple failed payments
  const failedPayments = await db.payment.count({
    where: {
      userId,
      status: 'REJECTED',
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  })
  
  if (failedPayments > 3) {
    score += 25
    indicators.push('Multiple failed payment attempts')
  }
  
  // Check no-show rate
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { noShowCount: true, helpfulCount: true, reportCount: true, trustScore: true }
  })
  
  if (user) {
    const totalHelps = user.helpfulCount + user.noShowCount
    if (totalHelps > 5 && (user.noShowCount / totalHelps) > 0.3) {
      score += 20
      indicators.push('High no-show rate')
    }
    
    if (user.reportCount > 3) {
      score += 15
      indicators.push('Multiple reports received')
    }
  }
  
  // Determine risk level
  let level: RiskAssessment['level'] = 'LOW'
  let recommendation: RiskAssessment['recommendation'] = 'ALLOW'
  
  if (score >= 70) {
    level = 'CRITICAL'
    recommendation = 'BLOCK'
  } else if (score >= 50) {
    level = 'HIGH'
    recommendation = 'REVIEW'
  } else if (score >= 25) {
    level = 'MEDIUM'
    recommendation = 'MONITOR'
  }
  
  return { score, level, indicators, recommendation }
}

// Calculate overall risk score
export function calculateRiskScore(factors: {
  trustScore: number
  accountAge: number
  verificationStatus: boolean
  previousIncidents: number
}): number {
  let risk = 0
  
  // Lower trust = higher risk
  risk += (100 - factors.trustScore) * 0.3
  
  // Newer accounts are riskier
  if (factors.accountAge < 7) {
    risk += 20
  } else if (factors.accountAge < 30) {
    risk += 10
  }
  
  // Unverified accounts are riskier
  if (!factors.verificationStatus) {
    risk += 15
  }
  
  // Previous incidents
  risk += factors.previousIncidents * 10
  
  return Math.min(100, risk)
}

// Flag user for admin review
export async function flagForReview(
  userId: string,
  reason: string,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
): Promise<void> {
  // Update user status if critical
  if (severity === 'CRITICAL') {
    await db.user.update({
      where: { id: userId },
      data: { isBlocked: true }
    })
  }
  
  // Create admin log
  await db.adminLog.create({
    data: {
      adminId: 'system',
      action: 'FRAUD_FLAG',
      targetType: 'USER',
      targetId: userId,
      details: `${severity}: ${reason}`
    }
  })
  
  console.log(`[Fraud] User ${userId} flagged for review: ${reason} (${severity})`)
}

// Get fraud summary for admin dashboard
export async function getFraudSummary() {
  const [
    blockedUsers,
    recentFlags,
    highRiskUsers
  ] = await Promise.all([
    db.user.count({ where: { isBlocked: true } }),
    db.adminLog.count({
      where: {
        action: 'FRAUD_FLAG',
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    db.user.count({
      where: { trustScore: { lt: 40 } }
    })
  ])
  
  return {
    blockedUsers,
    recentFlags,
    highRiskUsers
  }
}
