import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        name: true,
        avatar: true,
        paymentActive: true,
        activeTill: true,
        trustScore: true,
        noShowCount: true,
        reportCount: true,
        isBlocked: true,
        isBanned: false, // Don't expose ban status
        createdAt: true,
      }
    })

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
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, lat, lng } = body

    const user = await db.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(lat && lng && { lat, lng, locationUpdatedAt: new Date() })
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        paymentActive: user.paymentActive,
        activeTill: user.activeTill,
        trustScore: user.trustScore,
        noShowCount: user.noShowCount,
        reportCount: user.reportCount,
        isBlocked: user.isBlocked,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
      }
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
