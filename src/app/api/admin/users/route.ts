import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get all users (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('adminKey')

    if (adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        paymentActive: true,
        activeTill: true,
        trustScore: true,
        noShowCount: true,
        reportCount: true,
        isBlocked: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            problems: true,
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({
      success: true,
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
