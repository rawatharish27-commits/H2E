import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Streak Configuration
const STREAK_CONFIG = {
  REWARDS: {
    3: { type: 'VISIBILITY_BOOST', duration: 6, label: '6hr Profile Boost' },
    7: { type: 'BADGE', badgeId: 'week_warrior', label: 'Week Warrior Badge' },
    14: { type: 'VISIBILITY_BOOST', duration: 24, label: '24hr Profile Boost' },
    30: { type: 'BADGE', badgeId: 'month_master', label: 'Month Master Badge' },
    60: { type: 'VISIBILITY_BOOST', duration: 72, label: '72hr Profile Boost' },
    90: { type: 'BADGE', badgeId: 'consistency_king', label: 'Consistency King Badge' }
  }
}

// GET - Get streak status
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let streak = await db.loginStreak.findUnique({
      where: { userId: user.id }
    })

    if (!streak) {
      streak = await db.loginStreak.create({
        data: { userId: user.id }
      })
    }

    // Check if streak should continue
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastLogin = streak.lastLoginDate ? new Date(streak.lastLoginDate) : null
    if (lastLogin) {
      lastLogin.setHours(0, 0, 0, 0)
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let streakBroken = false
    if (lastLogin) {
      if (lastLogin.getTime() < yesterday.getTime()) {
        // Streak broken - more than 1 day gap
        streakBroken = true
      }
    }

    if (streakBroken && streak.currentStreak > 0) {
      await db.loginStreak.update({
        where: { userId: user.id },
        data: { currentStreak: 0 }
      })
      streak.currentStreak = 0
    }

    // Check for today's reward
    const alreadyLoggedInToday = lastLogin?.getTime() === today.getTime()
    
    // Get next reward milestone
    let nextMilestone = null
    const milestones = Object.keys(STREAK_CONFIG.REWARDS).map(Number).sort((a, b) => a - b)
    for (const milestone of milestones) {
      if (streak.currentStreak < milestone) {
        nextMilestone = {
          days: milestone,
          reward: STREAK_CONFIG.REWARDS[milestone as keyof typeof STREAK_CONFIG.REWARDS]
        }
        break
      }
    }

    return NextResponse.json({
      success: true,
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        lastLogin: streak.lastLoginDate,
        todayCompleted: alreadyLoggedInToday,
        totalRewards: streak.totalRewards,
        nextMilestone,
        currentReward: streak.currentReward ? JSON.parse(streak.currentReward) : null
      },
      milestones: milestones.map(m => ({
        days: m,
        reward: STREAK_CONFIG.REWARDS[m as keyof typeof STREAK_CONFIG.REWARDS],
        achieved: streak.currentStreak >= m
      }))
    })
  } catch (error) {
    console.error('Streak GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Record daily login and claim reward
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body || {}

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let streak = await db.loginStreak.findUnique({
      where: { userId: user.id }
    })

    if (!streak) {
      streak = await db.loginStreak.create({
        data: { userId: user.id }
      })
    }

    const lastLogin = streak.lastLoginDate ? new Date(streak.lastLoginDate) : null
    if (lastLogin) {
      lastLogin.setHours(0, 0, 0, 0)
    }

    // Check if already logged in today
    if (lastLogin?.getTime() === today.getTime()) {
      return NextResponse.json({
        success: true,
        message: 'Already logged in today',
        streak: {
          current: streak.currentStreak,
          longest: streak.longestStreak,
          todayCompleted: true
        }
      })
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let newStreakCount = 1
    if (lastLogin && lastLogin.getTime() === yesterday.getTime()) {
      // Continue streak
      newStreakCount = streak.currentStreak + 1
    }

    // Check for reward
    let reward = null
    const rewardConfig = STREAK_CONFIG.REWARDS[newStreakCount as keyof typeof STREAK_CONFIG.REWARDS]
    if (rewardConfig) {
      reward = rewardConfig
    }

    // Update streak
    streak = await db.loginStreak.update({
      where: { userId: user.id },
      data: {
        currentStreak: newStreakCount,
        longestStreak: Math.max(streak.longestStreak, newStreakCount),
        lastLoginDate: today,
        currentReward: reward ? JSON.stringify(reward) : null,
        totalRewards: reward ? { increment: 1 } : undefined
      }
    })

    // Apply reward if any
    if (reward) {
      if (reward.type === 'VISIBILITY_BOOST') {
        // Create boost
        await db.boostPurchase.create({
          data: {
            userId: user.id,
            boostType: 'PROFILE_BOOST',
            amount: 0,
            paymentStatus: 'PAID',
            startsAt: new Date(),
            endsAt: new Date(Date.now() + reward.duration * 60 * 60 * 1000),
            isActive: true,
            priority: 2
          }
        })

        await db.notification.create({
          data: {
            userId: user.id,
            type: 'SYSTEM',
            title: `🔥 ${reward.label} Unlocked!`,
            message: `Congratulations! ${newStreakCount} day streak reward: ${reward.label} activated!`
          }
        })
      } else if (reward.type === 'BADGE') {
        // Add badge to user
        await db.user.update({
          where: { id: user.id },
          data: {
            badges: JSON.stringify([
              ...(user.badges ? JSON.parse(user.badges) : []),
              reward.badgeId
            ])
          }
        })

        await db.notification.create({
          data: {
            userId: user.id,
            type: 'SYSTEM',
            title: `🏆 ${reward.label} Earned!`,
            message: `Amazing! ${newStreakCount} day streak! You've earned the ${reward.label}!`
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Login streak updated!',
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        todayCompleted: true
      },
      reward: reward ? {
        type: reward.type,
        label: reward.label,
        duration: reward.duration
      } : null
    })
  } catch (error) {
    console.error('Streak POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
