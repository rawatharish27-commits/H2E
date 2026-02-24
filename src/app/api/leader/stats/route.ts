import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leader/stats - Get leader statistics
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

    // Check if user is a leader
    const leader = await db.leader.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            helpfulCount: true,
            ratingSum: true,
            ratingCount: true,
          }
        }
      }
    })

    if (!leader) {
      // Return default data for non-leaders
      return NextResponse.json({
        success: true,
        leader: {
          level: 'NONE',
          connectedUsers: 0,
          totalCommission: 0,
          monthlyCommission: 0,
          areaCode: '',
          areaName: '',
          helpsCompleted: 0,
          avgRating: 0,
        }
      })
    }

    // Calculate average rating
    const avgRating = leader.user.ratingCount > 0 
      ? leader.user.ratingSum / leader.user.ratingCount 
      : 0

    return NextResponse.json({
      success: true,
      leader: {
        level: leader.level,
        connectedUsers: leader.connectedUsers,
        totalCommission: leader.totalCommission,
        monthlyCommission: leader.monthlyCommission,
        pendingCommission: leader.pendingCommission,
        areaCode: leader.areaCode,
        areaName: leader.areaName,
        helpsCompleted: leader.helpsCompleted,
        avgRating: avgRating,
        unlockedAt: leader.unlockedAt,
      }
    })

  } catch (error) {
    console.error('Error fetching leader stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leader statistics'
    }, { status: 500 })
  }
}
