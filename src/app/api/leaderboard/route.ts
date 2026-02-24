import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Leaderboard Configuration
const LEADERBOARD_CONFIG = {
  TOP_COUNT: 5,
  BONUS_AMOUNTS: [100, 75, 50, 30, 20], // Rank 1-5
  BADGES: ['🥇', '🥈', '🥉', '🏅', '🏅']
}

// Helper to get current week range
function getCurrentWeekRange() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Monday
  
  const weekStart = new Date(now.setDate(diff))
  weekStart.setHours(0, 0, 0, 0)
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  
  return { weekStart, weekEnd }
}

// GET - Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'current'
    const areaCode = searchParams.get('areaCode')

    if (action === 'current') {
      const { weekStart, weekEnd } = getCurrentWeekRange()

      // Get or create leaderboard entries for this week
      let leaderboard = await db.weeklyLeaderboard.findMany({
        where: { weekStart },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              avgRating: true,
              areaCode: true
            }
          }
        },
        orderBy: [
          { totalEarnings: 'desc' }
        ],
        take: LEADERBOARD_CONFIG.TOP_COUNT
      })

      if (leaderboard.length === 0) {
        // Calculate from feedback and problems
        const topEarners = await db.feedback.groupBy({
          by: ['toUserId'],
          where: {
            createdAt: {
              gte: weekStart,
              lte: weekEnd
            }
          },
          _count: { id: true },
          _avg: { rating: true }
        })

        // Get user details and calculate earnings
        const earnersWithDetails = await Promise.all(
          topEarners.slice(0, LEADERBOARD_CONFIG.TOP_COUNT).map(async (earner, index) => {
            const userData = await db.user.findUnique({
              where: { id: earner.toUserId },
              select: { id: true, name: true, avatar: true, avgRating: true, areaCode: true }
            })

            if (!userData) return null

            // Create leaderboard entry
            await db.weeklyLeaderboard.create({
              data: {
                userId: earner.toUserId,
                weekStart,
                weekEnd,
                totalHelps: earner._count.id,
                avgRating: earner._avg.rating || 0,
                rank: index + 1,
                bonusAmount: LEADERBOARD_CONFIG.BONUS_AMOUNTS[index] || 0
              }
            })

            return {
              rank: index + 1,
              user: userData,
              totalHelps: earner._count.id,
              avgRating: earner._avg.rating || 0,
              badge: LEADERBOARD_CONFIG.BADGES[index],
              bonusAmount: LEADERBOARD_CONFIG.BONUS_AMOUNTS[index] || 0
            }
          })
        )

        leaderboard = earnersWithDetails.filter(Boolean) as any[]
      }

      return NextResponse.json({
        success: true,
        leaderboard: leaderboard.map((entry, index) => ({
          rank: entry.rank || index + 1,
          user: entry.user,
          totalEarnings: entry.totalEarnings,
          totalHelps: entry.totalHelps,
          avgRating: entry.avgRating,
          badge: LEADERBOARD_CONFIG.BADGES[entry.rank - 1] || LEADERBOARD_CONFIG.BADGES[index],
          bonusAmount: entry.bonusAmount,
          bonusClaimed: entry.bonusClaimed
        })),
        weekStart,
        weekEnd
      })
    }

    if (action === 'my-rank') {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { weekStart, weekEnd } = getCurrentWeekRange()

      const myEntry = await db.weeklyLeaderboard.findFirst({
        where: {
          userId: user.id,
          weekStart
        }
      })

      if (!myEntry) {
        // Calculate user's position
        const myStats = await db.feedback.count({
          where: {
            toUserId: user.id,
            createdAt: {
              gte: weekStart,
              lte: weekEnd
            }
          }
        })

        return NextResponse.json({
          success: true,
          myRank: null,
          stats: {
            weeklyHelps: myStats,
            totalEarnings: 0
          },
          message: 'Not in top 5 this week. Keep helping to climb the leaderboard!'
        })
      }

      return NextResponse.json({
        success: true,
        myRank: myEntry.rank,
        stats: {
          totalEarnings: myEntry.totalEarnings,
          totalHelps: myEntry.totalHelps,
          avgRating: myEntry.avgRating
        },
        bonusAvailable: myEntry.bonusAmount > 0 && !myEntry.bonusClaimed
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Leaderboard GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Claim bonus
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { weekStart } = getCurrentWeekRange()

    const entry = await db.weeklyLeaderboard.findFirst({
      where: {
        userId: user.id,
        weekStart,
        bonusClaimed: false
      }
    })

    if (!entry || entry.bonusAmount <= 0) {
      return NextResponse.json({ error: 'No bonus available to claim' }, { status: 400 })
    }

    await db.weeklyLeaderboard.update({
      where: { id: entry.id },
      data: { bonusClaimed: true }
    })

    await db.user.update({
      where: { id: user.id },
      data: {
        referralEarnings: { increment: entry.bonusAmount }
      }
    })

    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: '🎁 Bonus Claimed!',
        message: `₹${entry.bonusAmount} bonus claimed for rank #${entry.rank} on the weekly leaderboard!`
      }
    })

    return NextResponse.json({
      success: true,
      message: `₹${entry.bonusAmount} bonus claimed!`,
      amount: entry.bonusAmount
    })
  } catch (error) {
    console.error('Leaderboard POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
