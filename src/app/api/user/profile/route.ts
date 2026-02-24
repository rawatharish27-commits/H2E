import { NextRequest, NextResponse } from 'next/server'
import { db, withRetry } from '@/lib/db'

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const user = await withRetry(() => db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        avatar: true,
        email: true,
        paymentActive: true,
        activeTill: true,
        subscriptionType: true,
        trustScore: true,
        noShowCount: true,
        noShowStrikes: true,
        reportCount: true,
        helpfulCount: true,
        ratingSum: true,
        ratingCount: true,
        referralCode: true,
        referralCount: true,
        referralRewards: true,
        isBlocked: true,
        isBanned: true,
        darkMode: true,
        language: true,
        notifications: true,
        createdAt: true
      }
    }))

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email, avatar, language, notifications, darkMode } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email.trim()
    if (avatar !== undefined) updateData.avatar = avatar
    if (language !== undefined) updateData.language = language
    if (notifications !== undefined) updateData.notifications = notifications
    if (darkMode !== undefined) updateData.darkMode = darkMode

    const user = await withRetry(() => db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        phone: true,
        name: true,
        avatar: true,
        email: true,
        paymentActive: true,
        activeTill: true,
        subscriptionType: true,
        trustScore: true,
        noShowCount: true,
        noShowStrikes: true,
        reportCount: true,
        helpfulCount: true,
        referralCode: true,
        referralCount: true,
        referralRewards: true,
        isBlocked: true,
        isBanned: true,
        darkMode: true,
        language: true,
        notifications: true,
        createdAt: true
      }
    }))

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
