// Trust Score System - Based on RentforHelp.docx specification
// Score Range: 0-100, Default: 50

export type TrustBadge = 'trusted' | 'neutral' | 'restricted'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface TrustScoreInfo {
  score: number
  badge: TrustBadge
  label: string
  color: string
  bgColor: string
  canViewHighRisk: boolean
  canPostResource: boolean
  postingLimit: number
}

// Calculate badge from score
export function getTrustBadge(score: number): TrustBadge {
  if (score >= 70) return 'trusted'
  if (score >= 40) return 'neutral'
  return 'restricted'
}

// Get complete trust info
export function getTrustInfo(score: number): TrustScoreInfo {
  const badge = getTrustBadge(score)
  
  const badgeConfig: Record<TrustBadge, Omit<TrustScoreInfo, 'score' | 'badge'>> = {
    trusted: {
      label: 'Trusted',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      canViewHighRisk: true,
      canPostResource: true,
      postingLimit: 10
    },
    neutral: {
      label: 'Neutral',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      canViewHighRisk: false,
      canPostResource: false,
      postingLimit: 3
    },
    restricted: {
      label: 'Restricted',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      canViewHighRisk: false,
      canPostResource: false,
      postingLimit: 1
    }
  }
  
  return {
    score,
    badge,
    ...badgeConfig[badge]
  }
}

// Trust score calculation rules from document
export const TRUST_RULES = {
  // Positive actions
  SUCCESSFUL_HELP: +3,        // Client confirms "Reached"
  POSITIVE_RATING: +2,        // 4-5 stars
  NEUTRAL_RATING: 0,          // 3 stars
  NEGATIVE_RATING: -5,        // 1-2 stars
  
  // Negative actions
  NO_SHOW: -10,               // Helper didn't reach
  VALID_REPORT: -15,          // Report verified by admin
  
  // Time-based
  ACTIVE_WEEK: +1,            // +1 per 7 days active (max +10)
  LOCATION_CONSISTENCY: +5,   // No GPS spoof flags in 30 days
  
  // Limits
  MAX_SCORE: 100,
  MIN_SCORE: 0,
  DEFAULT_SCORE: 50
}

// Calculate new trust score after an action
export function calculateNewTrustScore(
  currentScore: number,
  action: keyof typeof TRUST_RULES
): number {
  const change = TRUST_RULES[action] || 0
  const newScore = currentScore + change
  return Math.max(TRUST_RULES.MIN_SCORE, Math.min(TRUST_RULES.MAX_SCORE, newScore))
}

// Get trust score from user stats
export function calculateTrustScoreFromStats(stats: {
  helpfulCount: number
  ratingSum: number
  ratingCount: number
  noShowCount: number
  reportCount: number
  activeDays?: number
}): number {
  let score = TRUST_RULES.DEFAULT_SCORE
  
  // Successful helps
  score += stats.helpfulCount * TRUST_RULES.SUCCESSFUL_HELP
  
  // Ratings (average based)
  if (stats.ratingCount > 0) {
    const avgRating = stats.ratingSum / stats.ratingCount
    if (avgRating >= 4) {
      score += stats.ratingCount * TRUST_RULES.POSITIVE_RATING
    } else if (avgRating < 3) {
      score += stats.ratingCount * TRUST_RULES.NEGATIVE_RATING
    }
  }
  
  // No-shows
  score += stats.noShowCount * TRUST_RULES.NO_SHOW
  
  // Reports
  score += stats.reportCount * TRUST_RULES.VALID_REPORT
  
  // Active days bonus (max +10)
  if (stats.activeDays) {
    const activeBonus = Math.min(Math.floor(stats.activeDays / 7), 10)
    score += activeBonus
  }
  
  return Math.max(TRUST_RULES.MIN_SCORE, Math.min(TRUST_RULES.MAX_SCORE, score))
}

// Risk level requirements
export const RISK_REQUIREMENTS: Record<RiskLevel, {
  minTrustScore: number
  idExchangeRecommended: boolean
  depositRecommended: boolean
}> = {
  LOW: {
    minTrustScore: 40,
    idExchangeRecommended: false,
    depositRecommended: false
  },
  MEDIUM: {
    minTrustScore: 50,
    idExchangeRecommended: true,
    depositRecommended: false
  },
  HIGH: {
    minTrustScore: 70,
    idExchangeRecommended: true,
    depositRecommended: true
  }
}

// Check if user can access a problem based on risk level
export function canAccessProblem(userTrustScore: number, problemRiskLevel: RiskLevel): boolean {
  const requirements = RISK_REQUIREMENTS[problemRiskLevel]
  return userTrustScore >= requirements.minTrustScore
}

// Get no-show penalty info
export function getNoShowPenalty(noShowCount: number): {
  status: 'safe' | 'warning' | 'invisible' | 'banned'
  message: string
  strikesLeft: number
} {
  if (noShowCount === 0) {
    return {
      status: 'safe',
      message: 'Good standing',
      strikesLeft: 3
    }
  } else if (noShowCount === 1) {
    return {
      status: 'warning',
      message: '1 strike - 2 more will restrict your account',
      strikesLeft: 2
    }
  } else if (noShowCount === 2) {
    return {
      status: 'warning',
      message: '2 strikes - 1 more will make you invisible',
      strikesLeft: 1
    }
  } else if (noShowCount >= 3 && noShowCount < 5) {
    return {
      status: 'invisible',
      message: 'You are invisible to other users for 7 days',
      strikesLeft: 0
    }
  } else {
    return {
      status: 'banned',
      message: 'Account banned due to repeated no-shows',
      strikesLeft: 0
    }
  }
}
