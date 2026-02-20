import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Leader Unlock Requirements
const LEADER_REQUIREMENTS = {
  MIN_TASKS: 10,           // Minimum completed tasks (helps)
  MIN_RATING: 4.5,         // Minimum average rating
  MIN_REFERRALS: 20,       // Minimum active referrals
  MAX_LEADERS_PER_AREA: 3  // Maximum 3 leaders per area
}

// Leader Level Thresholds
const LEADER_LEVELS = {
  BRONZE: { minConnected: 20, commission: 0.005 },     // 0.5% commission
  SILVER: { minConnected: 50, commission: 0.0075 },   // 0.75% commission
  GOLD: { minConnected: 100, commission: 0.01 },      // 1% commission
  AMBASSADOR: { minConnected: 200, commission: 0.015 } // 1.5% commission
}

// GET - Get leader status and progress
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'

    if (action === 'status') {
      // Get user's leader progress
      const tasksCompleted = user.helpfulCount || 0
      const avgRating = user.avgRating || 0
      const activeReferrals = user.activeReferrals || 0

      // Calculate progress percentages
      const tasksProgress = Math.min(100, (tasksCompleted / LEADER_REQUIREMENTS.MIN_TASKS) * 100)
      const ratingProgress = Math.min(100, (avgRating / LEADER_REQUIREMENTS.MIN_RATING) * 100)
      const referralsProgress = Math.min(100, (activeReferrals / LEADER_REQUIREMENTS.MIN_REFERRALS) * 100)

      // Check if all requirements met
      const canUnlock = 
        tasksCompleted >= LEADER_REQUIREMENTS.MIN_TASKS &&
        avgRating >= LEADER_REQUIREMENTS.MIN_RATING &&
        activeReferrals >= LEADER_REQUIREMENTS.MIN_REFERRALS &&
        user.kycVerified

      // Check if already a leader
      let leaderProfile = await db.leader.findUnique({
        where: { userId: user.id },
        include: {
          commissions: {
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      // Check area leader slots
      let areaSlotsAvailable = 0
      if (user.areaCode && canUnlock && !leaderProfile) {
        const areaLeaders = await db.leader.count({
          where: {
            areaCode: user.areaCode,
            isActive: true
          }
        })
        areaSlotsAvailable = LEADER_REQUIREMENTS.MAX_LEADERS_PER_AREA - areaLeaders
      }

      // Calculate next level
      let nextLevel = 'BRONZE'
      let connectedUsers = leaderProfile?.connectedUsers || 0
      
      if (connectedUsers >= LEADER_LEVELS.AMBASSADOR.minConnected) {
        nextLevel = 'AMBASSADOR'
      } else if (connectedUsers >= LEADER_LEVELS.GOLD.minConnected) {
        nextLevel = 'GOLD'
      } else if (connectedUsers >= LEADER_LEVELS.SILVER.minConnected) {
        nextLevel = 'SILVER'
      }

      return NextResponse.json({
        success: true,
        isLeader: user.isLeader,
        leaderLevel: user.leaderLevel,
        requirements: LEADER_REQUIREMENTS,
        current: {
          tasksCompleted,
          avgRating,
          activeReferrals,
          kycVerified: user.kycVerified
        },
        progress: {
          tasks: Math.round(tasksProgress),
          rating: Math.round(ratingProgress),
          referrals: Math.round(referralsProgress)
        },
        canUnlock,
        areaSlotsAvailable,
        slotsBlocked: areaSlotsAvailable <= 0 && canUnlock && !leaderProfile,
        leaderProfile: leaderProfile ? {
          id: leaderProfile.id,
          level: leaderProfile.level,
          areaCode: leaderProfile.areaCode,
          connectedUsers: leaderProfile.connectedUsers,
          totalCommission: leaderProfile.totalCommission,
          monthlyCommission: leaderProfile.monthlyCommission,
          pendingCommission: leaderProfile.pendingCommission,
          isActive: leaderProfile.isActive,
          isVerified: leaderProfile.isVerified,
          unlockedAt: leaderProfile.unlockedAt,
          nextLevel,
          commissions: leaderProfile.commissions
        } : null
      })
    }

    if (action === 'leaderboard') {
      const areaCode = searchParams.get('areaCode') || user.areaCode

      // Get top leaders
      const leaders = await db.leader.findMany({
        where: {
          ...(areaCode ? { areaCode } : {}),
          isActive: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              avgRating: true,
              helpfulCount: true
            }
          }
        },
        orderBy: [
          { totalCommission: 'desc' }
        ],
        take: 20
      })

      return NextResponse.json({
        success: true,
        leaders: leaders.map((l, i) => ({
          rank: i + 1,
          id: l.id,
          userId: l.userId,
          user: l.user,
          level: l.level,
          areaCode: l.areaCode,
          connectedUsers: l.connectedUsers,
          totalCommission: l.totalCommission,
          isVerified: l.isVerified
        }))
      })
    }

    if (action === 'area-slots') {
      const areaCode = searchParams.get('areaCode') || user.areaCode

      if (!areaCode) {
        return NextResponse.json({ error: 'Area code required' }, { status: 400 })
      }

      const leaders = await db.leader.findMany({
        where: { areaCode, isActive: true },
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          }
        }
      })

      return NextResponse.json({
        success: true,
        areaCode,
        maxSlots: LEADER_REQUIREMENTS.MAX_LEADERS_PER_AREA,
        currentLeaders: leaders.length,
        slotsAvailable: LEADER_REQUIREMENTS.MAX_LEADERS_PER_AREA - leaders.length,
        leaders: leaders.map(l => ({
          id: l.id,
          user: l.user,
          level: l.level,
          connectedUsers: l.connectedUsers,
          slotNumber: l.slotNumber
        }))
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Leader status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Unlock leader status or update leader
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'unlock') {
      // Verify requirements
      const tasksCompleted = user.helpfulCount || 0
      const avgRating = user.avgRating || 0
      const activeReferrals = user.activeReferrals || 0

      if (tasksCompleted < LEADER_REQUIREMENTS.MIN_TASKS) {
        return NextResponse.json({ 
          error: `Need ${LEADER_REQUIREMENTS.MIN_TASKS} completed tasks. Current: ${tasksCompleted}` 
        }, { status: 400 })
      }

      if (avgRating < LEADER_REQUIREMENTS.MIN_RATING) {
        return NextResponse.json({ 
          error: `Need ${LEADER_REQUIREMENTS.MIN_RATING}+ rating. Current: ${avgRating.toFixed(1)}` 
        }, { status: 400 })
      }

      if (activeReferrals < LEADER_REQUIREMENTS.MIN_REFERRALS) {
        return NextResponse.json({ 
          error: `Need ${LEADER_REQUIREMENTS.MIN_REFERRALS} active referrals. Current: ${activeReferrals}` 
        }, { status: 400 })
      }

      if (!user.kycVerified) {
        return NextResponse.json({ 
          error: 'KYC verification required for leader status' 
        }, { status: 400 })
      }

      if (!user.areaCode) {
        return NextResponse.json({ 
          error: 'Area code required. Please set your location.' 
        }, { status: 400 })
      }

      // Check if already a leader
      const existingLeader = await db.leader.findUnique({
        where: { userId: user.id }
      })

      if (existingLeader) {
        return NextResponse.json({ 
          error: 'Already a leader' 
        }, { status: 400 })
      }

      // Check area slots
      const areaLeaders = await db.leader.count({
        where: {
          areaCode: user.areaCode,
          isActive: true
        }
      })

      if (areaLeaders >= LEADER_REQUIREMENTS.MAX_LEADERS_PER_AREA) {
        return NextResponse.json({ 
          error: 'No leader slots available in your area. All 3 slots are filled.',
          slotsBlocked: true
        }, { status: 400 })
      }

      // Create leader profile
      const leader = await db.leader.create({
        data: {
          userId: user.id,
          areaCode: user.areaCode,
          level: 'BRONZE',
          tasksCompleted,
          avgRating,
          activeReferrals,
          kycVerified: user.kycVerified,
          connectedUsers: activeReferrals,
          slotNumber: areaLeaders + 1,
          isVerified: true,
          unlockedAt: new Date(),
          bronzeUnlocked: true
        }
      })

      // Update user
      await db.user.update({
        where: { id: user.id },
        data: {
          isLeader: true,
          leaderLevel: 'BRONZE'
        }
      })

      // Update area
      await db.area.update({
        where: { areaCode: user.areaCode },
        data: {
          currentLeaders: { increment: 1 }
        }
      })

      // Create notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'LEADER',
          title: '🎉 Leader Status Unlocked!',
          message: `Congratulations! You are now a Bronze Leader in ${user.areaCode}. You'll earn 0.5% commission on helps in your area.`
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Leader status unlocked!',
        leader: {
          id: leader.id,
          level: leader.level,
          areaCode: leader.areaCode,
          slotNumber: leader.slotNumber,
          commission: LEADER_LEVELS.BRONZE.commission
        }
      })
    }

    if (action === 'upgrade') {
      // Check for level upgrade
      const leader = await db.leader.findUnique({
        where: { userId: user.id }
      })

      if (!leader) {
        return NextResponse.json({ error: 'Not a leader' }, { status: 400 })
      }

      const connectedUsers = leader.connectedUsers
      let newLevel = leader.level

      if (connectedUsers >= LEADER_LEVELS.AMBASSADOR.minConnected && !leader.ambassadorUnlocked) {
        newLevel = 'AMBASSADOR'
      } else if (connectedUsers >= LEADER_LEVELS.GOLD.minConnected && !leader.goldUnlocked) {
        newLevel = 'GOLD'
      } else if (connectedUsers >= LEADER_LEVELS.SILVER.minConnected && !leader.silverUnlocked) {
        newLevel = 'SILVER'
      }

      if (newLevel === leader.level) {
        return NextResponse.json({ 
          message: 'No upgrade available',
          currentLevel: leader.level,
          connectedUsers,
          nextLevelAt: getNextLevelThreshold(leader.level)
        })
      }

      // Update leader level
      const updateData: any = { level: newLevel }
      if (newLevel === 'SILVER') updateData.silverUnlocked = true
      if (newLevel === 'GOLD') updateData.goldUnlocked = true
      if (newLevel === 'AMBASSADOR') updateData.ambassadorUnlocked = true

      await db.leader.update({
        where: { id: leader.id },
        data: updateData
      })

      await db.user.update({
        where: { id: user.id },
        data: { leaderLevel: newLevel }
      })

      // Notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'LEADER',
          title: `🚀 Upgraded to ${newLevel}!`,
          message: `Congratulations! Your commission is now ${(LEADER_LEVELS[newLevel as keyof typeof LEADER_LEVELS].commission * 100).toFixed(1)}%`
        }
      })

      return NextResponse.json({
        success: true,
        message: `Upgraded to ${newLevel}!`,
        newLevel,
        commission: LEADER_LEVELS[newLevel as keyof typeof LEADER_LEVELS].commission
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Leader unlock error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper: Get next level threshold
function getNextLevelThreshold(currentLevel: string): { level: string; minConnected: number } | null {
  switch (currentLevel) {
    case 'BRONZE':
      return { level: 'SILVER', minConnected: LEADER_LEVELS.SILVER.minConnected }
    case 'SILVER':
      return { level: 'GOLD', minConnected: LEADER_LEVELS.GOLD.minConnected }
    case 'GOLD':
      return { level: 'AMBASSADOR', minConnected: LEADER_LEVELS.AMBASSADOR.minConnected }
    default:
      return null
  }
}
