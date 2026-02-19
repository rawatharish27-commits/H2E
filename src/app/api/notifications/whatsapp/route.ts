import { NextRequest, NextResponse } from 'next/server'
import { 
  notifyNearbyPaidUsers,
  getNotificationHistory,
  getNotificationPreferences,
  updateNotificationPreferences
} from '@/lib/notifications/whatsapp'
import { db } from '@/lib/db'
import { ProblemType } from '@/types'

/**
 * POST /api/notifications/whatsapp
 * Send WhatsApp notifications to nearby paid users when a new problem is posted
 * 
 * Request body:
 * - problemId: string (required)
 * - lat: number (required)
 * - lng: number (required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, lat, lng } = body

    // Validate required fields
    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      )
    }

    // Get problem details
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Only send notifications for open problems
    if (problem.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Problem is not open' },
        { status: 400 }
      )
    }

    // Send notifications to nearby paid users
    const result = await notifyNearbyPaidUsers({
      id: problem.id,
      type: problem.type as ProblemType,
      title: problem.title,
      category: problem.category,
      lat: problem.lat,
      lng: problem.lng,
      offerPrice: problem.offerPrice,
      postedById: problem.postedById,
      postedBy: problem.postedBy
    })

    // Log notification activity
    console.log(`[WhatsApp API] Notifications sent for problem ${problemId}:`, {
      notified: result.totalNotified,
      skipped: result.totalSkipped,
      failed: result.totalFailed
    })

    return NextResponse.json({
      success: true,
      data: {
        problemId,
        totalNotified: result.totalNotified,
        totalSkipped: result.totalSkipped,
        totalFailed: result.totalFailed
      }
    })
  } catch (error) {
    console.error('[WhatsApp API] Error sending notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/notifications/whatsapp
 * Get notification preferences and history for a user
 * 
 * Query params:
 * - userId: string (required)
 * - action: 'preferences' | 'history' (default: 'preferences')
 * - limit: number (default: 20, for history)
 * - offset: number (default: 0, for history)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action') || 'preferences'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (action === 'history') {
      // Get notification history
      const history = await getNotificationHistory(userId, limit, offset)
      
      return NextResponse.json({
        success: true,
        data: {
          history,
          hasMore: history.length === limit
        }
      })
    } else {
      // Get notification preferences
      const preferences = await getNotificationPreferences(userId)
      
      return NextResponse.json({
        success: true,
        data: preferences
      })
    }
  } catch (error) {
    console.error('[WhatsApp API] Error getting notification data:', error)
    return NextResponse.json(
      { error: 'Failed to get notification data' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/notifications/whatsapp
 * Update notification preferences for a user
 * 
 * Request body:
 * - userId: string (required)
 * - whatsappEnabled?: boolean
 * - whatsappNumber?: string | null
 * - quietHoursStart?: string | null (format: "HH:MM")
 * - quietHoursEnd?: string | null (format: "HH:MM")
 * - notificationTypes?: string[] (e.g., ["EMERGENCY", "TIME_ACCESS"])
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      whatsappEnabled,
      whatsappNumber,
      quietHoursStart,
      quietHoursEnd,
      notificationTypes
    } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate phone number format if provided
    if (whatsappNumber !== undefined && whatsappNumber !== null) {
      const phoneRegex = /^\+?[1-9]\d{9,14}$/
      if (!phoneRegex.test(whatsappNumber.replace(/[\s-]/g, ''))) {
        return NextResponse.json(
          { error: 'Invalid WhatsApp number format' },
          { status: 400 }
        )
      }
    }

    // Validate time format if provided
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
    if (quietHoursStart !== undefined && quietHoursStart !== null && !timeRegex.test(quietHoursStart)) {
      return NextResponse.json(
        { error: 'Invalid quiet hours start time format. Use HH:MM' },
        { status: 400 }
      )
    }
    if (quietHoursEnd !== undefined && quietHoursEnd !== null && !timeRegex.test(quietHoursEnd)) {
      return NextResponse.json(
        { error: 'Invalid quiet hours end time format. Use HH:MM' },
        { status: 400 }
      )
    }

    // Validate notification types if provided
    const validTypes = ['EMERGENCY', 'TIME_ACCESS', 'RESOURCE_RENT']
    if (notificationTypes !== undefined) {
      for (const type of notificationTypes) {
        if (!validTypes.includes(type)) {
          return NextResponse.json(
            { error: `Invalid notification type: ${type}` },
            { status: 400 }
          )
        }
      }
    }

    // Update preferences
    const result = await updateNotificationPreferences(userId, {
      whatsappEnabled,
      whatsappNumber,
      quietHoursStart,
      quietHoursEnd,
      notificationTypes
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update preferences' },
        { status: 500 }
      )
    }

    // Get updated preferences
    const updatedPreferences = await getNotificationPreferences(userId)

    return NextResponse.json({
      success: true,
      data: updatedPreferences
    })
  } catch (error) {
    console.error('[WhatsApp API] Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
