import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Boost Configuration
const BOOST_CONFIG = {
  TASK_BOOST_PRICE: 20,
  PROFILE_BOOST_PRICE: 20,
  DURATION_HOURS: 24,
  MAX_PRIORITY: 5
}

// GET - Get boost status and active boosts
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'active'

    if (action === 'active') {
      // Get active boosts for user
      const boosts = await db.boostPurchase.findMany({
        where: {
          userId: user.id,
          isActive: true,
          endsAt: { gte: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        success: true,
        boosts: boosts.map(b => ({
          id: b.id,
          type: b.boostType,
          targetId: b.targetId,
          startsAt: b.startsAt,
          endsAt: b.endsAt,
          priority: b.priority,
          impressions: b.impressions,
          clicks: b.clicks,
          timeRemaining: Math.max(0, Math.floor((new Date(b.endsAt!).getTime() - Date.now()) / 1000 / 60))
        }))
      })
    }

    if (action === 'history') {
      const boosts = await db.boostPurchase.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return NextResponse.json({
        success: true,
        boosts
      })
    }

    if (action === 'pricing') {
      return NextResponse.json({
        success: true,
        pricing: {
          taskBoost: {
            price: BOOST_CONFIG.TASK_BOOST_PRICE,
            duration: `${BOOST_CONFIG.DURATION_HOURS} hours`,
            benefits: ['Top visibility in nearby list', 'Highlighted border', 'Priority in search']
          },
          profileBoost: {
            price: BOOST_CONFIG.PROFILE_BOOST_PRICE,
            duration: `${BOOST_CONFIG.DURATION_HOURS} hours`,
            benefits: ['Profile shown first to task posters', 'Verified badge highlight', 'More visibility']
          }
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Boost GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Purchase boost
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { boostType, targetId } = body

    if (!boostType || !['TASK_BOOST', 'PROFILE_BOOST'].includes(boostType)) {
      return NextResponse.json({ error: 'Invalid boost type' }, { status: 400 })
    }

    // For task boost, verify task belongs to user
    if (boostType === 'TASK_BOOST') {
      if (!targetId) {
        return NextResponse.json({ error: 'Target ID required for task boost' }, { status: 400 })
      }

      const problem = await db.problem.findUnique({
        where: { id: targetId }
      })

      if (!problem || problem.postedById !== user.id) {
        return NextResponse.json({ error: 'Task not found or not authorized' }, { status: 403 })
      }

      // Check for existing active boost
      const existingBoost = await db.boostPurchase.findFirst({
        where: {
          targetId,
          boostType: 'TASK_BOOST',
          isActive: true,
          endsAt: { gte: new Date() }
        }
      })

      if (existingBoost) {
        return NextResponse.json({ error: 'Task already has active boost' }, { status: 400 })
      }
    }

    const amount = boostType === 'TASK_BOOST' ? BOOST_CONFIG.TASK_BOOST_PRICE : BOOST_CONFIG.PROFILE_BOOST_PRICE
    const startsAt = new Date()
    const endsAt = new Date(Date.now() + BOOST_CONFIG.DURATION_HOURS * 60 * 60 * 1000)

    // Create boost (in production, payment would be processed first)
    const boost = await db.boostPurchase.create({
      data: {
        userId: user.id,
        boostType,
        targetId: boostType === 'TASK_BOOST' ? targetId : null,
        amount,
        paymentStatus: 'PAID', // Simulating payment success
        startsAt,
        endsAt,
        isActive: true,
        priority: 3 // Default priority
      }
    })

    // Notify user
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: '🚀 Boost Activated!',
        message: `Your ${boostType === 'TASK_BOOST' ? 'task' : 'profile'} is now boosted for ${BOOST_CONFIG.DURATION_HOURS} hours with top visibility.`
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Boost purchased successfully',
      boost: {
        id: boost.id,
        type: boost.boostType,
        startsAt: boost.startsAt,
        endsAt: boost.endsAt,
        amount: boost.amount
      }
    })
  } catch (error) {
    console.error('Boost POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
