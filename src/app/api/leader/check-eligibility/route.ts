import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Leader Unlock Requirements
const LEADER_REQUIREMENTS = {
  MIN_HELPS: 10,        // Minimum completed helps
  MIN_RATING: 4.5,      // Minimum average rating
  KYC_REQUIRED: true,   // KYC verification required
}

// GET /api/leader/check-eligibility - Check if user is eligible for leader unlock
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

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
        leaderLevel: true,
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

    // If already a leader, return current status
    if (user.isLeader) {
      return NextResponse.json({
        success: true,
        eligible: true,
        alreadyLeader: true,
        level: user.leaderLevel,
        message: 'Already a leader'
      })
    }

    // Calculate average rating
    const avgRating = user.ratingCount > 0 
      ? user.ratingSum / user.ratingCount 
      : 0

    // Check each requirement
    const checks = {
      helpsCompleted: {
        required: LEADER_REQUIREMENTS.MIN_HELPS,
        current: user.helpfulCount,
        passed: user.helpfulCount >= LEADER_REQUIREMENTS.MIN_HELPS,
      },
      rating: {
        required: LEADER_REQUIREMENTS.MIN_RATING,
        current: Number(avgRating.toFixed(1)),
        passed: avgRating >= LEADER_REQUIREMENTS.MIN_RATING,
      },
      kycVerified: {
        required: true,
        current: user.kycVerified,
        passed: user.kycVerified,
      },
      locationActive: {
        required: true,
        current: user.lat !== null && user.lng !== null,
        passed: user.lat !== null && user.lng !== null,
      },
    }

    // Overall eligibility
    const isEligible = Object.values(checks).every(check => check.passed)

    // Generate area code from coordinates (simplified - just round to 2 decimal places)
    let areaCode = ''
    let areaName = ''
    
    if (user.lat && user.lng) {
      areaCode = `${user.lat.toFixed(2)}_${user.lng.toFixed(2)}`
      // In production, you'd use reverse geocoding to get the actual area name
      areaName = 'Your Area'
    }

    return NextResponse.json({
      success: true,
      eligible: isEligible,
      alreadyLeader: false,
      checks,
      areaCode,
      areaName,
      message: isEligible 
        ? 'Congratulations! You are eligible to become a Leader!'
        : 'Complete all requirements to unlock Leader status'
    })

  } catch (error) {
    console.error('Error checking leader eligibility:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check eligibility'
    }, { status: 500 })
  }
}
