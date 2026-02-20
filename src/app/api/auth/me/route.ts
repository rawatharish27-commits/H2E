import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, deleteSession } from '@/lib/auth'

// Logout
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (token) {
      await deleteSession(token)
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    
    // Clear cookie
    response.cookies.delete('auth-token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

// Get current user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const userId = await verifyToken(token)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        avatar: true,
        paymentActive: true,
        activeTill: true,
        trustScore: true,
        referralCode: true,
        referralCount: true,
        referralRewards: true,
        noShowCount: true,
        reportCount: true,
        helpfulCount: true,
        ratingSum: true,
        ratingCount: true,
        isBlocked: true,
        isBanned: true,
        darkMode: true,
        language: true,
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
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}
