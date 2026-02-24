/**
 * Social Proof API
 * Displays "Aaj is area me X madad hui" on home screen
 * Visibility = Survival
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET - Get social proof stats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const areaCode = searchParams.get('areaCode')
    const action = searchParams.get('action')

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (action === 'area-stats' && areaCode) {
      // Get area-specific stats
      const [
        todayHelps,
        todayPosts,
        activeHelpers,
        totalUsers,
        weeklyHelps
      ] = await Promise.all([
        // Helps completed today
        db.feedback.count({
          where: {
            createdAt: { gte: today, lt: tomorrow },
            problem: { areaCode }
          }
        }),
        
        // Posts created today
        db.problem.count({
          where: {
            createdAt: { gte: today, lt: tomorrow },
            areaCode
          }
        }),
        
        // Active helpers today
        db.helperRegistration.count({
          where: {
            registeredAt: { gte: today, lt: tomorrow },
            problem: { areaCode }
          }
        }),
        
        // Total users in area
        db.user.count({
          where: { areaCode }
        }),
        
        // Helps this week
        db.feedback.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            problem: { areaCode }
          }
        })
      ])

      // Update area with today's stats
      await db.area.updateMany({
        where: { areaCode },
        data: {
          todayHelps,
          todayPosts,
          activeHelpers
        }
      })

      return NextResponse.json({
        success: true,
        areaCode,
        today: {
          helps: todayHelps,
          posts: todayPosts,
          activeHelpers
        },
        total: {
          users: totalUsers
        },
        weekly: {
          helps: weeklyHelps
        },
        message: generateSocialProofMessage(todayHelps, areaCode)
      })
    }

    // Get global stats for home page
    const [
      todayHelps,
      todayPosts,
      totalUsers,
      activeAreas
    ] = await Promise.all([
      db.feedback.count({
        where: { createdAt: { gte: today, lt: tomorrow } }
      }),
      db.problem.count({
        where: { createdAt: { gte: today, lt: tomorrow } }
      }),
      db.user.count(),
      db.area.count({ where: { isActive: true } })
    ])

    // Get today's stat record
    const todayStr = today.toISOString().split('T')[0]
    let dailyStat = await db.dailyStat.findUnique({
      where: { date: todayStr }
    })

    if (!dailyStat) {
      // Create today's stat
      dailyStat = await db.dailyStat.create({
        data: {
          date: todayStr,
          totalHelps: todayHelps,
          problemsPosted: todayPosts,
          activeUsers: await db.user.count({
            where: { lastActiveAt: { gte: today } }
          })
        }
      })
    }

    return NextResponse.json({
      success: true,
      today: {
        helps: todayHelps,
        posts: todayPosts
      },
      total: {
        users: totalUsers,
        areas: activeAreas
      },
      message: generateSocialProofMessage(todayHelps),
      detailedMessage: todayHelps > 0 
        ? `Aaj ${todayHelps} logon ki madad hui! 🙌` 
        : 'Aaj madad ka mauka hai! Pehle helper bano! 💪'
    })
  } catch (error) {
    console.error('[Social Proof] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social proof' },
      { status: 500 }
    )
  }
}

/**
 * POST - Update social proof (called when help completed)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { areaCode, action } = body

    if (action === 'HELP_COMPLETED') {
      // Update area's today helps
      await db.area.updateMany({
        where: { areaCode },
        data: {
          todayHelps: { increment: 1 },
          totalTasks: { increment: 1 }
        }
      })

      // Update daily stat
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]

      await db.dailyStat.upsert({
        where: { date: todayStr },
        update: {
          totalHelps: { increment: 1 }
        },
        create: {
          date: todayStr,
          totalHelps: 1
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Social proof updated'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Social Proof] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update social proof' },
      { status: 500 }
    )
  }
}

/**
 * Generate social proof message for display
 */
function generateSocialProofMessage(helps: number, areaCode?: string | null): string {
  const location = areaCode ? `is area me` : 'aaj'
  
  if (helps === 0) {
    return `🤝 ${location.replace('me', 'me pehla')} madad ka mauka hai!`
  }
  
  if (helps < 5) {
    return `✨ ${location} ${helps} madad hui!`
  }
  
  if (helps < 10) {
    return `🌟 ${location} ${helps} madad hui! Community active hai!`
  }
  
  if (helps < 20) {
    return `🔥 ${location} ${helps} madad hui! Bahut accha!`
  }
  
  return `🏆 ${location} ${helps} madad hui! Champion community!`
}

/**
 * PUT - Get activity timeline for social proof
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { areaCode, limit = 10 } = body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get recent helps for timeline
    const recentHelps = await db.feedback.findMany({
      where: {
        createdAt: { gte: today },
        ...(areaCode && { problem: { areaCode } })
      },
      include: {
        problem: {
          select: {
            title: true,
            type: true,
            category: true
          }
        },
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    const timeline = recentHelps.map(help => ({
      id: help.id,
      type: help.problem.type,
      title: help.problem.title,
      helperName: help.user.name?.split(' ')[0] || 'Helper',
      helperAvatar: help.user.avatar,
      rating: help.rating,
      time: formatTimeAgo(help.createdAt)
    }))

    return NextResponse.json({
      success: true,
      timeline
    })
  } catch (error) {
    console.error('[Social Proof] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    )
  }
}

/**
 * Format time ago
 */
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffMins < 1) return 'Abhi'
  if (diffMins < 60) return `${diffMins} min pehle`
  if (diffHours < 24) return `${diffHours} ghante pehle`
  return 'Aaj'
}
