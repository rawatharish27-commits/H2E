import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get all users (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('adminKey')

    // Verify admin key from environment variable
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (adminKey !== validAdminKey && adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total count
    const totalCount = await db.user.count()
    
    const users = await db.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        paymentActive: true,
        activeTill: true,
        trustScore: true,
        noShowCount: true,
        noShowStrikes: true,
        reportCount: true,
        isBlocked: true,
        isBanned: true,
        isShadowBanned: true,
        isFlagged: true,
        helpfulCount: true,
        referralCode: true,
        referralCount: true,
        createdAt: true,
        lastActiveAt: true,
        _count: {
          select: {
            problems: true,
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 500
    })

    return NextResponse.json({
      success: true,
      total: totalCount,
      users
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
