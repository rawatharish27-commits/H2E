// Trust Score Service
import { db } from '@/lib/db'

// Trust score modifiers
const TRUST_MODIFIERS = {
  SUCCESSFUL_HELP: 3,
  POSITIVE_RATING: 2,  // 4-5 stars
  NEUTRAL_RATING: 0,   // 3 stars
  NEGATIVE_RATING: -5, // 1-2 stars
  NO_SHOW: -10,
  VALID_REPORT: -15,
  TIME_ON_PLATFORM: 1, // Per 7 days, capped at +10
  LOCATION_CONSISTENCY: 5, // Bonus for 30 days consistency
}

const TRUST_THRESHOLDS = {
  RESTRICTED: 40,
  NEUTRAL: 70,
  TRUSTED: 100,
}

interface TrustEvent {
  type: string
  change: number
  reason: string
  createdAt: Date
}

// Calculate trust score based on user stats
export function calculateTrustScore(stats: {
  helpfulCount: number
  ratingSum: number
  ratingCount: number
  noShowCount: number
  reportCount: number
  daysOnPlatform: number
  locationConsistency: boolean
}): number {
  let score = 50 // Base score
  
  // Add for successful helps
  score += stats.helpfulCount * TRUST_MODIFIERS.SUCCESSFUL_HELP
  
  // Add for positive ratings
  if (stats.ratingCount > 0) {
    const avgRating = stats.ratingSum / stats.ratingCount
    if (avgRating >= 4) {
      score += stats.ratingCount * TRUST_MODIFIERS.POSITIVE_RATING
    } else if (avgRating < 3) {
      score += stats.ratingCount * TRUST_MODIFIERS.NEGATIVE_RATING
    }
  }
  
  // Subtract for no-shows
  score -= stats.noShowCount * Math.abs(TRUST_MODIFIERS.NO_SHOW)
  
  // Subtract for reports
  score -= stats.reportCount * Math.abs(TRUST_MODIFIERS.VALID_REPORT)
  
  // Time bonus (capped)
  const timeBonus = Math.min(Math.floor(stats.daysOnPlatform / 7), 10)
  score += timeBonus * TRUST_MODIFIERS.TIME_ON_PLATFORM
  
  // Location consistency bonus
  if (stats.locationConsistency) {
    score += TRUST_MODIFIERS.LOCATION_CONSISTENCY
  }
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score))
}

// Update user's trust score
export async function updateTrustScore(
  userId: string,
  event: {
    type: 'HELP_SUCCESS' | 'HELP_NO_SHOW' | 'RATING_RECEIVED' | 'REPORT_RECEIVED' | 'TIME_BONUS'
    change?: number
    reason: string
  }
): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      trustScore: true,
      helpfulCount: true,
      ratingSum: true,
      ratingCount: true,
      noShowCount: true,
      reportCount: true,
      createdAt: true,
    }
  })
  
  if (!user) throw new Error('User not found')
  
  let change = event.change ?? 0
  
  switch (event.type) {
    case 'HELP_SUCCESS':
      change = TRUST_MODIFIERS.SUCCESSFUL_HELP
      break
    case 'HELP_NO_SHOW':
      change = TRUST_MODIFIERS.NO_SHOW
      break
    case 'RATING_RECEIVED':
      // Change provided in event
      break
    case 'REPORT_RECEIVED':
      change = TRUST_MODIFIERS.VALID_REPORT
      break
  }
  
  const newScore = Math.max(0, Math.min(100, user.trustScore + change))
  
  await db.user.update({
    where: { id: userId },
    data: { trustScore: newScore }
  })
  
  // Log trust change (could be stored in a TrustHistory table)
  console.log(`[Trust] User ${userId}: ${user.trustScore} -> ${newScore} (${event.reason})`)
  
  return newScore
}

// Check if user meets trust requirements for action
export function checkTrustRequirements(
  trustScore: number,
  action: 'VIEW_EMERGENCY' | 'VIEW_TIME_ACCESS' | 'VIEW_RESOURCE_RENT' | 'POST_PROBLEM' | 'POST_HIGH_RISK'
): { allowed: boolean; reason?: string } {
  const requirements: Record<string, number> = {
    VIEW_EMERGENCY: 40,
    VIEW_TIME_ACCESS: 50,
    VIEW_RESOURCE_RENT: 70,
    POST_PROBLEM: 30,
    POST_HIGH_RISK: 60,
  }
  
  const required = requirements[action] ?? 40
  
  if (trustScore < required) {
    return {
      allowed: false,
      reason: `Trust score of ${required}+ required. Current: ${trustScore}`
    }
  }
  
  return { allowed: true }
}

// Get trust badge
export function getTrustBadge(score: number): { level: string; color: string; icon: string } {
  if (score >= 70) {
    return { level: 'TRUSTED', color: 'green', icon: '🟢' }
  } else if (score >= 40) {
    return { level: 'NEUTRAL', color: 'yellow', icon: '🟡' }
  } else {
    return { level: 'RESTRICTED', color: 'red', icon: '🔴' }
  }
}

// Get trust statistics for user
export async function getTrustStats(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      trustScore: true,
      helpfulCount: true,
      ratingSum: true,
      ratingCount: true,
      noShowCount: true,
      reportCount: true,
    }
  })
  
  if (!user) throw new Error('User not found')
  
  const avgRating = user.ratingCount > 0 
    ? (user.ratingSum / user.ratingCount).toFixed(1) 
    : 'N/A'
  
  return {
    score: user.trustScore,
    badge: getTrustBadge(user.trustScore),
    stats: {
      helpsCompleted: user.helpfulCount,
      avgRating,
      totalRatings: user.ratingCount,
      noShows: user.noShowCount,
      reports: user.reportCount,
    }
  }
}
