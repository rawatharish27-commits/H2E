import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get comprehensive dashboard stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('adminKey')

    if (adminKey !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all stats in parallel
    const [
      totalUsers,
      activeUsers,
      pendingPayments,
      approvedPaymentsToday,
      openProblems,
      closedProblemsToday,
      flaggedUsers,
      todaySignups,
      sosActive,
      pendingReports
    ] = await Promise.all([
      db.user.count(),
      db.user.count({
        where: { paymentActive: true, activeTill: { gte: new Date() } }
      }),
      db.payment.count({ where: { status: 'PENDING' } }),
      db.payment.count({
        where: { status: 'APPROVED', approvedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
      }),
      db.problem.count({ where: { status: 'OPEN' } }),
      db.problem.count({
        where: { status: 'CLOSED', closedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
      }),
      db.user.count({
        where: { OR: [{ trustScore: { lt: 40 } }, { reportCount: { gte: 3 } }, { isBlocked: true }] }
      }),
      db.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      db.sosAlert.count({ where: { status: 'ACTIVE' } }),
      db.report.count({ where: { status: 'PENDING' } })
    ])

    // Trust distribution
    const [trusted, neutral, restricted] = await Promise.all([
      db.user.count({ where: { trustScore: { gte: 70 } } }),
      db.user.count({ where: { trustScore: { gte: 40, lt: 70 } } }),
      db.user.count({ where: { trustScore: { lt: 40 } } })
    ])

    // Revenue stats
    const revenueStats = await db.payment.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true },
      _count: true
    })

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          todaySignups,
          flagged: flaggedUsers,
          trustDistribution: { trusted, neutral, restricted }
        },
        payments: {
          pending: pendingPayments,
          approvedToday: approvedPaymentsToday,
          totalRevenue: revenueStats._sum.amount || 0,
          totalPayments: revenueStats._count
        },
        problems: {
          open: openProblems,
          closedToday: closedProblemsToday
        },
        safety: {
          sosActive,
          pendingReports
        }
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
