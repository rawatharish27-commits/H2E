import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('adminKey')
    const period = searchParams.get('period') || '7d'

    if (adminKey !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }
    const days = daysMap[period] || 7
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    // Top helpers
    const topHelpers = await db.user.findMany({
      where: { helpfulCount: { gt: 0 } },
      select: { id: true, name: true, phone: true, helpfulCount: true, trustScore: true },
      orderBy: { helpfulCount: 'desc' },
      take: 10
    })

    // Top referrers
    const topReferrers = await db.user.findMany({
      where: { referralCount: { gt: 0 } },
      select: { id: true, name: true, phone: true, referralCount: true, referralRewards: true },
      orderBy: { referralCount: 'desc' },
      take: 10
    })

    // Category distribution
    const categoryStats = await db.problem.groupBy({
      by: ['category'],
      _count: true,
      where: { createdAt: { gte: startDate } }
    })

    // Type distribution
    const typeStats = await db.problem.groupBy({
      by: ['type'],
      _count: true,
      where: { createdAt: { gte: startDate } }
    })

    return NextResponse.json({
      success: true,
      analytics: {
        period,
        topHelpers,
        topReferrers,
        categoryStats,
        typeStats
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
