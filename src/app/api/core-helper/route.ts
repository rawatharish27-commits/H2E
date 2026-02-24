/**
 * Core Helper API
 * Manages the first 50 helpers per area with founding badge
 * 
 * Benefits:
 * - Founding Helper badge
 * - 30-min response rule
 * - Featured visibility
 * - Priority notifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createNotification } from '@/lib/notifications'

// Configuration
const MAX_CORE_HELPERS_PER_AREA = 50

/**
 * GET - Get core helpers
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const areaCode = searchParams.get('areaCode')
    const action = searchParams.get('action')

    if (action === 'check' && userId && areaCode) {
      // Check if user is a core helper
      const coreHelper = await db.coreHelper.findUnique({
        where: {
          userId_areaCode: { userId, areaCode }
        }
      })

      return NextResponse.json({
        success: true,
        isCoreHelper: !!coreHelper,
        coreHelper
      })
    }

    if (areaCode) {
      // Get all core helpers for an area
      const helpers = await db.coreHelper.findMany({
        where: {
          areaCode,
          status: 'ACTIVE'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              phone: true,
              trustScore: true,
              helpfulCount: true
            }
          }
        },
        orderBy: [
          { responseStreak: 'desc' },
          { totalHelps: 'desc' }
        ]
      })

      return NextResponse.json({
        success: true,
        count: helpers.length,
        maxAllowed: MAX_CORE_HELPERS_PER_AREA,
        slotsRemaining: MAX_CORE_HELPERS_PER_AREA - helpers.length,
        helpers
      })
    }

    if (userId) {
      // Get user's core helper profiles (can be in multiple areas)
      const profiles = await db.coreHelper.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              trustScore: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        profiles
      })
    }

    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Core Helper] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch core helpers' },
      { status: 500 }
    )
  }
}

/**
 * POST - Register as core helper
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, areaCode } = body

    if (!userId || !areaCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists and is trustworthy
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        trustScore: true,
        helpfulCount: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Minimum trust score required
    if (user.trustScore < 40) {
      return NextResponse.json(
        { error: 'Minimum trust score of 40 required' },
        { status: 400 }
      )
    }

    // Check if already a core helper
    const existingHelper = await db.coreHelper.findUnique({
      where: {
        userId_areaCode: { userId, areaCode }
      }
    })

    if (existingHelper) {
      return NextResponse.json(
        { error: 'Already a core helper in this area' },
        { status: 400 }
      )
    }

    // Check slots remaining
    const currentCount = await db.coreHelper.count({
      where: { areaCode, status: 'ACTIVE' }
    })

    if (currentCount >= MAX_CORE_HELPERS_PER_AREA) {
      return NextResponse.json(
        { error: 'Core helper slots full for this area' },
        { status: 400 }
      )
    }

    // Create core helper
    const coreHelper = await db.coreHelper.create({
      data: {
        userId,
        areaCode,
        status: 'ACTIVE',
        badgeType: 'FOUNDING_HELPER',
        badgeEarnedAt: new Date(),
        responseTimeRequired: 30 // 30 minutes
      }
    })

    // Send notification
    await createNotification({
      userId,
      type: 'SYSTEM',
      title: '🎉 Founding Helper Badge Earned!',
      message: `You are now a Founding Helper in your area! Please respond to requests within 30 minutes.`,
      priority: 'HIGH'
    })

    console.log(`[Core Helper] Created: ${userId} for area: ${areaCode}`)

    return NextResponse.json({
      success: true,
      coreHelper,
      badge: {
        type: 'FOUNDING_HELPER',
        earnedAt: coreHelper.badgeEarnedAt,
        benefits: [
          'Founding Helper badge on profile',
          'Priority visibility in area',
          'First to receive help requests',
          '30-minute response expectation'
        ]
      },
      slotInfo: {
        position: currentCount + 1,
        totalSlots: MAX_CORE_HELPERS_PER_AREA
      }
    })
  } catch (error) {
    console.error('[Core Helper] Error:', error)
    return NextResponse.json(
      { error: 'Failed to register as core helper' },
      { status: 500 }
    )
  }
}

/**
 * PATCH - Update core helper stats
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { helperId, userId, areaCode, action } = body

    // Find helper
    let helper
    if (helperId) {
      helper = await db.coreHelper.findUnique({
        where: { id: helperId }
      })
    } else if (userId && areaCode) {
      helper = await db.coreHelper.findUnique({
        where: {
          userId_areaCode: { userId, areaCode }
        }
      })
    }

    if (!helper) {
      return NextResponse.json(
        { error: 'Core helper not found' },
        { status: 404 }
      )
    }

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case 'RESPONSE_RECORDED':
        // Record a response within time limit
        const currentStreak = helper.responseStreak + 1
        updateData = {
          todayResponses: { increment: 1 },
          responseStreak: currentStreak,
          bestResponseStreak: Math.max(helper.bestResponseStreak, currentStreak),
          lastResponseAt: new Date()
        }
        break
      
      case 'RESPONSE_MISSED':
        // Missed the 30-min window
        updateData = {
          responseStreak: 0
        }
        break
      
      case 'HELP_COMPLETED':
        updateData = {
          totalHelps: { increment: 1 }
        }
        break
      
      case 'RATING_RECEIVED':
        // Recalculate average rating
        const user = await db.user.findUnique({
          where: { id: helper.userId },
          select: { avgRating: true }
        })
        updateData = {
          avgRating: user?.avgRating || 0
        }
        break
      
      case 'RESET_DAILY':
        // Reset daily counters
        updateData = {
          todayResponses: 0
        }
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const updated = await db.coreHelper.update({
      where: { id: helper.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      coreHelper: updated
    })
  } catch (error) {
    console.error('[Core Helper] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update core helper' },
      { status: 500 }
    )
  }
}
