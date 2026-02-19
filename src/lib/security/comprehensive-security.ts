// Comprehensive Security System for HelpPe DailyEarn
// Covers all A-to-Z Security Risk Map items

import { db } from '@/lib/db'

// ==========================================
// SECTION A: USER LEVEL RISKS
// ==========================================

export interface UserRiskAssessment {
  score: number
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  risks: string[]
  recommendations: string[]
}

/**
 * A.1 - Detect Fake Users / Fake Numbers
 */
export async function detectFakeUser(phone: string): Promise<UserRiskAssessment> {
  const risks: string[] = []
  const recommendations: string[] = []
  let score = 0
  
  // Check for multiple accounts with same phone prefix (area-based fraud)
  const phonePrefix = phone.substring(0, 5)
  const similarPhones = await db.user.count({
    where: {
      phone: { startsWith: phonePrefix },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
  })
  
  if (similarPhones > 5) {
    score += 30
    risks.push('Multiple accounts with similar phone numbers')
    recommendations.push('Monitor for coordinated activity')
  }
  
  // Check for rapid account creation pattern
  const recentAccounts = await db.user.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
    }
  })
  
  if (recentAccounts > 10) {
    score += 20
    risks.push('High rate of new account creation')
  }
  
  return {
    score,
    level: getRiskLevel(score),
    risks,
    recommendations
  }
}

/**
 * A.2 - Fake Helpers / Criminal Intent Detection
 */
export async function assessHelperRisk(userId: string): Promise<UserRiskAssessment> {
  const risks: string[] = []
  const recommendations: string[] = []
  let score = 0
  
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      problems: { where: { status: 'CLOSED' } },
      feedbacks: { where: { toUserId: userId } },
      reports: { where: { reportedUserId: userId } }
    }
  })
  
  if (!user) {
    return { score: 100, level: 'CRITICAL', risks: ['User not found'], recommendations: [] }
  }
  
  // Check trust score
  if (user.trustScore < 30) {
    score += 40
    risks.push('Very low trust score')
    recommendations.push('Restrict from high-risk help types')
  }
  
  // Check for reports
  const reportCount = user.reports.length
  if (reportCount > 2) {
    score += 30
    risks.push(`${reportCount} reports received`)
    recommendations.push('Review pending reports')
  }
  
  // Check no-show rate
  if (user.noShowCount > 3 && user.helpfulCount > 0) {
    const noShowRate = user.noShowCount / (user.noShowCount + user.helpfulCount)
    if (noShowRate > 0.3) {
      score += 25
      risks.push('High no-show rate')
      recommendations.push('Apply visibility restriction')
    }
  }
  
  // New account with high-value requests
  const accountAge = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  if (accountAge < 7 && user.problems.some(p => p.type === 'RESOURCE_RENT')) {
    score += 20
    risks.push('New account accessing high-risk help type')
    recommendations.push('Require higher trust score')
  }
  
  return {
    score,
    level: getRiskLevel(score),
    risks,
    recommendations
  }
}

/**
 * A.3 - Helper No-Show Tracking with Strikes
 */
export async function recordNoShow(
  userId: string,
  problemId: string
): Promise<{ strikes: number; action: string }> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { noShowStrikes: true, noShowCount: true, trustScore: true }
  })
  
  if (!user) throw new Error('User not found')
  
  const newStrikes = user.noShowStrikes + 1
  const newNoShowCount = user.noShowCount + 1
  const newTrustScore = Math.max(0, user.trustScore - 10) // -10 per no-show
  
  let action = 'WARNING'
  
  if (newStrikes >= 3) {
    action = 'INVISIBLE' // User becomes invisible
  }
  if (newStrikes >= 5) {
    action = 'BAN_RECOMMENDED'
  }
  
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: {
        noShowStrikes: newStrikes,
        noShowCount: newNoShowCount,
        trustScore: newTrustScore,
        isShadowBanned: newStrikes >= 3
      }
    }),
    db.securityAudit.create({
      data: {
        userId,
        eventType: 'NO_SHOW_RECORDED',
        severity: newStrikes >= 3 ? 'HIGH' : 'WARNING',
        description: `No-show recorded. Strike ${newStrikes}/3`,
        metadata: JSON.stringify({ problemId, strikes: newStrikes })
      }
    })
  ])
  
  return { strikes: newStrikes, action }
}

/**
 * A.4 - Record successful help (resets some strikes)
 */
export async function recordSuccessfulHelp(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { noShowStrikes: true, helpfulCount: true, trustScore: true }
  })
  
  if (!user) return
  
  // Reduce strikes by 1 for successful help (min 0)
  const newStrikes = Math.max(0, user.noShowStrikes - 1)
  const newTrustScore = Math.min(100, user.trustScore + 3)
  
  await db.user.update({
    where: { id: userId },
    data: {
      noShowStrikes: newStrikes,
      helpfulCount: user.helpfulCount + 1,
      trustScore: newTrustScore,
      // Remove shadow ban if strikes reduced
      isShadowBanned: newStrikes >= 3
    }
  })
}

// ==========================================
// SECTION B: LOCATION & PRIVACY RISKS
// ==========================================

export interface LocationValidationResult {
  valid: boolean
  spoofed: boolean
  reason?: string
  confidence: number
}

/**
 * B.5 - Enhanced GPS Spoofing Detection
 */
export async function detectEnhancedGPSSpoof(
  userId: string,
  lat: number,
  lng: number,
  deviceInfo?: { isMock?: boolean; accuracy?: number }
): Promise<LocationValidationResult> {
  // Check for mock location flag (from device)
  if (deviceInfo?.isMock) {
    await flagUserForGPSpoof(userId, 'Mock location flag detected')
    return { valid: false, spoofed: true, reason: 'Mock location detected', confidence: 1.0 }
  }
  
  // Check for perfect accuracy (impossible in real GPS)
  if (deviceInfo?.accuracy === 0) {
    await flagUserForGPSpoof(userId, 'Impossible GPS accuracy (0m)')
    return { valid: false, spoofed: true, reason: 'Impossible GPS accuracy', confidence: 0.9 }
  }
  
  // Check for impossible coordinates
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { valid: false, spoofed: true, reason: 'Invalid coordinates', confidence: 1.0 }
  }
  
  // Check for sudden location jump
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { lat: true, lng: true, locationUpdatedAt: true }
  })
  
  if (user?.lat && user?.lng && user?.locationUpdatedAt) {
    const timeDiff = (Date.now() - user.locationUpdatedAt.getTime()) / 1000 // seconds
    const distance = calculateDistance(user.lat, user.lng, lat, lng)
    const speed = timeDiff > 0 ? (distance / timeDiff) * 3600 : 0 // km/h
    
    // Maximum reasonable speed: 200 km/h
    if (speed > 200 && distance > 1) {
      await flagUserForGPSpoof(userId, `Impossible travel: ${speed.toFixed(0)} km/h`)
      return {
        valid: false,
        spoofed: true,
        reason: `Impossible travel detected: ${distance.toFixed(1)}km in ${(timeDiff/60).toFixed(0)} minutes`,
        confidence: 0.95
      }
    }
  }
  
  return { valid: true, spoofed: false, confidence: 0.95 }
}

async function flagUserForGPSpoof(userId: string, reason: string): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: {
        isFlagged: true,
        trustScore: { decrement: 15 }
      }
    }),
    db.securityAudit.create({
      data: {
        userId,
        eventType: 'GPS_SPOOF_DETECTED',
        severity: 'HIGH',
        description: reason
      }
    })
  ])
}

/**
 * B.6 - Location Privacy Controls
 */
export async function updateUserLocationPrivacy(
  userId: string,
  enabled: boolean
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { locationEnabled: enabled }
  })
}

// ==========================================
// SECTION C: PAYMENT & FINANCIAL RISKS
// ==========================================

/**
 * C.7 - Subscription Payment Fraud Detection
 */
export async function detectPaymentFraud(
  userId: string,
  upiId?: string
): Promise<{ fraudScore: number; reasons: string[] }> {
  const reasons: string[] = []
  let fraudScore = 0
  
  // Check for previous rejected payments
  const rejectedPayments = await db.payment.count({
    where: {
      userId,
      status: 'REJECTED',
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  })
  
  if (rejectedPayments > 3) {
    fraudScore += 40
    reasons.push('Multiple rejected payments')
  }
  
  // Check for pending payments (fake "I paid" claims)
  const pendingPayments = await db.payment.count({
    where: { userId, status: 'PENDING' }
  })
  
  if (pendingPayments > 2) {
    fraudScore += 30
    reasons.push('Multiple pending payments')
  }
  
  // Check for rapid payment claims
  const recentPending = await db.payment.findFirst({
    where: {
      userId,
      status: 'PENDING',
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
    }
  })
  
  if (recentPending) {
    fraudScore += 20
    reasons.push('Recent pending payment already exists')
  }
  
  // Check UPI pattern (if provided)
  if (upiId) {
    const suspiciousUpis = await db.payment.count({
      where: {
        upiId,
        status: 'REJECTED',
        NOT: { userId }
      }
    })
    
    if (suspiciousUpis > 0) {
      fraudScore += 30
      reasons.push('UPI ID associated with rejected payments')
    }
  }
  
  // Log high fraud score
  if (fraudScore >= 50) {
    await db.securityAudit.create({
      data: {
        userId,
        eventType: 'PAYMENT_FRAUD_DETECTED',
        severity: 'HIGH',
        description: `Payment fraud score: ${fraudScore}`,
        metadata: JSON.stringify({ reasons })
      }
    })
  }
  
  return { fraudScore, reasons }
}

/**
 * C.8 - Payment Approval SLA Tracking
 */
export async function checkPaymentSLA(paymentId: string): Promise<{
  breached: boolean
  minutesRemaining: number
  action: string
}> {
  const payment = await db.payment.findUnique({
    where: { id: paymentId }
  })
  
  if (!payment || payment.status !== 'PENDING') {
    return { breached: false, minutesRemaining: 0, action: 'N/A' }
  }
  
  const createdAt = payment.createdAt.getTime()
  const slaMinutes = payment.approvalSLA || 240 // 4 hours default
  const elapsed = (Date.now() - createdAt) / (1000 * 60)
  const remaining = slaMinutes - elapsed
  
  if (remaining <= 0) {
    // Mark as breached
    await db.payment.update({
      where: { id: paymentId },
      data: { slaBreached: true }
    })
    
    return { breached: true, minutesRemaining: 0, action: 'ESCALATE' }
  }
  
  return {
    breached: false,
    minutesRemaining: Math.round(remaining),
    action: remaining < 60 ? 'URGENT' : 'NORMAL'
  }
}

// ==========================================
// SECTION D: CONTENT & MISUSE RISKS
// ==========================================

// Banned content categories
const BANNED_CATEGORIES = [
  'weapons', 'drugs', 'illegal_work', 'gambling',
  'adult_content', 'violence', 'fraud', 'harassment'
]

const BANNED_KEYWORDS = [
  'gun', 'weapon', 'drug', 'cocaine', 'heroin', 'weed dealer',
  'illegal', 'stolen', 'thief', 'robbery', 'fraud', 'scam',
  'hitman', 'kidnap', 'murder', 'kill', 'rape', 'assault'
]

/**
 * D.10 - Illegal/Dangerous Request Detection
 */
export async function detectBannedContent(
  title: string,
  description: string
): Promise<{ banned: boolean; reason?: string; category?: string }> {
  const combinedText = `${title} ${description}`.toLowerCase()
  
  // Check banned keywords
  for (const keyword of BANNED_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return {
        banned: true,
        reason: `Banned keyword detected: "${keyword}"`,
        category: 'illegal'
      }
    }
  }
  
  // Check against database content filters
  const filters = await db.contentFilter.findMany({
    where: { isActive: true, action: 'BLOCK' }
  })
  
  for (const filter of filters) {
    if (combinedText.includes(filter.value.toLowerCase())) {
      return {
        banned: true,
        reason: filter.description || `Blocked content: ${filter.category}`,
        category: filter.category || undefined
      }
    }
  }
  
  return { banned: false }
}

/**
 * D.11 - Spam/Timepass Detection
 */
export async function checkSpamLimits(userId: string): Promise<{
  allowed: boolean
  reason?: string
  postsToday: number
  limit: number
}> {
  const DAILY_POST_LIMIT = 10
  
  // Count posts today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const postsToday = await db.problem.count({
    where: {
      postedById: userId,
      createdAt: { gte: today }
    }
  })
  
  if (postsToday >= DAILY_POST_LIMIT) {
    return {
      allowed: false,
      reason: `Daily post limit reached (${DAILY_POST_LIMIT})`,
      postsToday,
      limit: DAILY_POST_LIMIT
    }
  }
  
  return { allowed: true, postsToday, limit: DAILY_POST_LIMIT }
}

// ==========================================
// SECTION E: ADMIN & INTERNAL RISKS
// ==========================================

/**
 * E.12 - Admin Action Logging
 */
export async function logAdminAction(data: {
  adminId: string
  action: string
  targetType: 'USER' | 'PAYMENT' | 'PROBLEM' | 'REPORT' | 'SYSTEM'
  targetId?: string
  details?: string
  reason?: string
  ipAddress?: string
}): Promise<void> {
  await db.adminLog.create({ data })
}

/**
 * E.13 - Data Access Audit
 */
export async function auditDataAccess(
  adminId: string,
  dataType: string,
  targetId: string,
  action: 'VIEW' | 'EXPORT' | 'MODIFY' | 'DELETE'
): Promise<void> {
  await db.securityAudit.create({
    data: {
      userId: adminId,
      eventType: `ADMIN_${action}_${dataType.toUpperCase()}`,
      severity: action === 'DELETE' ? 'HIGH' : 'WARNING',
      description: `Admin ${action} on ${dataType}`,
      metadata: JSON.stringify({ targetId })
    }
  })
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 70) return 'CRITICAL'
  if (score >= 50) return 'HIGH'
  if (score >= 25) return 'MEDIUM'
  return 'LOW'
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Initialize default content filters
 */
export async function initializeContentFilters(): Promise<void> {
  const existingCount = await db.contentFilter.count()
  if (existingCount > 0) return
  
  const defaultFilters = [
    // Weapons
    { type: 'WORD', value: 'gun', category: 'weapons', severity: 'CRITICAL' },
    { type: 'WORD', value: 'weapon', category: 'weapons', severity: 'CRITICAL' },
    { type: 'WORD', value: 'knife', category: 'weapons', severity: 'HIGH' },
    { type: 'WORD', value: 'sword', category: 'weapons', severity: 'HIGH' },
    
    // Drugs
    { type: 'WORD', value: 'drugs', category: 'drugs', severity: 'CRITICAL' },
    { type: 'WORD', value: 'cocaine', category: 'drugs', severity: 'CRITICAL' },
    { type: 'WORD', value: 'heroin', category: 'drugs', severity: 'CRITICAL' },
    { type: 'WORD', value: 'meth', category: 'drugs', severity: 'CRITICAL' },
    
    // Illegal work
    { type: 'WORD', value: 'hitman', category: 'illegal_work', severity: 'CRITICAL' },
    { type: 'WORD', value: 'kidnap', category: 'illegal_work', severity: 'CRITICAL' },
    { type: 'WORD', value: 'murder', category: 'illegal_work', severity: 'CRITICAL' },
    
    // Fraud
    { type: 'WORD', value: 'stolen', category: 'fraud', severity: 'HIGH' },
    { type: 'WORD', value: 'scam', category: 'fraud', severity: 'HIGH' },
    { type: 'WORD', value: 'fake', category: 'fraud', severity: 'MEDIUM' }
  ]
  
  await db.contentFilter.createMany({
    data: defaultFilters,
    skipDuplicates: true
  })
}
