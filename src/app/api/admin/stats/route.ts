import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get dashboard stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('adminKey')

    // Simple admin key check (in production, use proper auth)
    if (adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get today's date at midnight
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    
    // Get yesterday's date at midnight for comparison
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Get stats
    const [
      totalUsers,
      activeUsers,
      pendingPayments,
      approvedPayments,
      rejectedPayments,
      openProblems,
      flaggedUsers,
      todayProblems,
      // Daily stats
      todayLogins,
      yesterdayLogins,
      todayPayments,
      yesterdayPayments,
      todayNewUsers,
      yesterdayNewUsers,
      // Revenue
      totalRevenue,
      todayRevenue,
      // Trust metrics
      trustScoreAvg,
      noShowCount
    ] = await Promise.all([
      // Total users
      db.user.count(),
      
      // Active paid users
      db.user.count({
        where: {
          paymentActive: true,
          activeTill: { gte: new Date() }
        }
      }),
      
      // Pending payments
      db.payment.count({
        where: { status: 'PENDING' }
      }),
      
      // Approved payments
      db.payment.count({
        where: { status: 'APPROVED' }
      }),
      
      // Rejected payments
      db.payment.count({
        where: { status: 'REJECTED' }
      }),
      
      // Open problems
      db.problem.count({
        where: { status: 'OPEN' }
      }),
      
      // Flagged users
      db.user.count({
        where: {
          OR: [
            { trustScore: { lt: 40 } },
            { reportCount: { gte: 3 } }
          ]
        }
      }),
      
      // Today's problems
      db.problem.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      
      // Today's logins (users who were active today)
      db.user.count({
        where: {
          lastActiveAt: { gte: today }
        }
      }),
      
      // Yesterday's logins
      db.user.count({
        where: {
          lastActiveAt: {
            gte: yesterday,
            lt: today
          }
        }
      }),
      
      // Today's payments
      db.payment.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      
      // Yesterday's payments
      db.payment.count({
        where: {
          createdAt: {
            gte: yesterday,
            lt: today
          }
        }
      }),
      
      // Today's new users
      db.user.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      
      // Yesterday's new users
      db.user.count({
        where: {
          createdAt: {
            gte: yesterday,
            lt: today
          }
        }
      }),
      
      // Total revenue (from approved payments)
      db.payment.aggregate({
        where: { status: 'APPROVED' },
        _sum: { amount: true }
      }).then(r => r._sum.amount || 0),
      
      // Today's revenue
      db.payment.aggregate({
        where: {
          status: 'APPROVED',
          createdAt: { gte: today }
        },
        _sum: { amount: true }
      }).then(r => r._sum.amount || 0),
      
      // Average trust score
      db.user.aggregate({
        _avg: { trustScore: true }
      }).then(r => r._avg.trustScore || 50),
      
      // Total no-show count
      db.user.aggregate({
        _sum: { noShowCount: true }
      }).then(r => r._sum.noShowCount || 0)
    ])

    // Calculate trends
    const loginTrend = yesterdayLogins > 0 
      ? Math.round(((todayLogins - yesterdayLogins) / yesterdayLogins) * 100)
      : 0
      
    const paymentTrend = yesterdayPayments > 0
      ? Math.round(((todayPayments - yesterdayPayments) / yesterdayPayments) * 100)
      : 0
      
    const newUserTrend = yesterdayNewUsers > 0
      ? Math.round(((todayNewUsers - yesterdayNewUsers) / yesterdayNewUsers) * 100)
      : 0

    // Calculate no-show rate
    const totalHelps = await db.problem.count({
      where: { status: 'CLOSED' }
    })
    const noShowRate = totalHelps > 0 ? (noShowCount / totalHelps) * 100 : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        paidUsers: approvedPayments,
        pendingPayments,
        approvedPayments,
        rejectedPayments,
        openProblems,
        flaggedUsers,
        todayProblems,
        totalRevenue: Number(totalRevenue),
        todayRevenue: Number(todayRevenue),
        trustScoreAvg: Math.round(trustScoreAvg),
        noShowRate: Math.round(noShowRate * 10) / 10,
        // Daily stats
        todayLogins,
        yesterdayLogins,
        loginTrend,
        todayPayments,
        yesterdayPayments,
        paymentTrend,
        todayNewUsers,
        yesterdayNewUsers,
        newUserTrend,
        newUsersToday: todayNewUsers,
        // Calculated
        avgResponseTime: 15, // placeholder
        fraudAttempts: 0, // placeholder
        activeSOS: 0 // placeholder
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
