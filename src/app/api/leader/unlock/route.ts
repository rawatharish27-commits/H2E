import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/leader/unlock - Unlock leader status for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 400 })
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        helpfulCount: true,
        ratingSum: true,
        ratingCount: true,
        kycVerified: true,
        isLeader: true,
        lat: true,
        lng: true,
        areaCode: true,
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Check if already a leader
    if (user.isLeader) {
      return NextResponse.json({
        success: false,
        error: 'Already a leader'
      }, { status: 400 })
    }

    // Verify eligibility
    const avgRating = user.ratingCount > 0 
      ? user.ratingSum / user.ratingCount 
      : 0

    if (user.helpfulCount < 10) {
      return NextResponse.json({
        success: false,
        error: 'Need at least 10 completed helps'
      }, { status: 400 })
    }

    if (avgRating < 4.5) {
      return NextResponse.json({
        success: false,
        error: 'Need at least 4.5 rating'
      }, { status: 400 })
    }

    if (!user.kycVerified) {
      return NextResponse.json({
        success: false,
        error: 'KYC verification required'
      }, { status: 400 })
    }

    if (!user.lat || !user.lng) {
      return NextResponse.json({
        success: false,
        error: 'Location required'
      }, { status: 400 })
    }

    // Generate area code
    const areaCode = user.areaCode || `${user.lat.toFixed(2)}_${user.lng.toFixed(2)}`
    const areaName = 'Your Area' // In production, use reverse geocoding

    // Create leader record and update user in a transaction
    const result = await db.$transaction([
      // Create leader profile
      db.leader.create({
        data: {
          userId: user.id,
          areaCode,
          areaName,
          level: 'BRONZE',
          helpsCompleted: user.helpfulCount,
          avgRating: avgRating,
          kycVerified: user.kycVerified,
          bronzeUnlocked: true,
          unlockedAt: new Date(),
        }
      }),
      // Update user
      db.user.update({
        where: { id: userId },
        data: {
          isLeader: true,
          leaderLevel: 'BRONZE',
          areaCode,
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Congratulations! You are now a Verified Area Leader!',
      leader: {
        level: 'BRONZE',
        areaCode,
        areaName,
        unlockedAt: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Error unlocking leader status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to unlock leader status'
    }, { status: 500 })
  }
}
