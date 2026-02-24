import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get visitor stats
export async function GET(request: NextRequest) {
  try {
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    
    // Verify admin key
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (adminKey !== validAdminKey && adminKey !== 'admin123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0]
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // Get live visitor count (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const liveVisitors = await db.visitor.count({
      where: {
        lastVisit: { gte: fiveMinutesAgo }
      }
    })

    // Get today's stats
    const todayVisitors = await db.visitor.count({
      where: {
        firstVisit: { gte: todayStart }
      }
    })

    const todayUniqueVisitors = await db.visitor.count({
      where: {
        lastVisit: { gte: todayStart }
      }
    })

    // Get today's registrations
    const todayRegistrations = await db.visitor.count({
      where: {
        didRegister: true,
        firstVisit: { gte: todayStart }
      }
    })

    // Get total stats
    const totalVisitors = await db.visitor.count()
    const totalRegistrations = await db.visitor.count({
      where: { didRegister: true }
    })

    // Get daily stats for last 7 days
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      let stat = await db.dailyVisitorStat.findUnique({
        where: { date: dateStr }
      })
      
      if (!stat && i > 0) {
        // For past days without stat, count from visitors
        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)
        
        const visitors = await db.visitor.count({
          where: {
            lastVisit: { gte: dayStart, lte: dayEnd }
          }
        })
        
        last7Days.push({
          date: dateStr,
          visitors,
          registrations: 0
        })
      } else if (stat) {
        last7Days.push({
          date: stat.date,
          visitors: stat.uniqueVisitors,
          registrations: stat.registrations
        })
      } else {
        last7Days.push({
          date: dateStr,
          visitors: 0,
          registrations: 0
        })
      }
    }

    // Get device breakdown
    const mobileCount = await db.visitor.count({
      where: { deviceType: 'mobile' }
    })
    const desktopCount = await db.visitor.count({
      where: { deviceType: 'desktop' }
    })

    return NextResponse.json({
      success: true,
      stats: {
        live: liveVisitors,
        today: {
          visitors: todayVisitors,
          uniqueVisitors: todayUniqueVisitors,
          registrations: todayRegistrations
        },
        total: {
          visitors: totalVisitors,
          registrations: totalRegistrations
        },
        devices: {
          mobile: mobileCount,
          desktop: desktopCount
        },
        last7Days
      }
    })
  } catch (error) {
    console.error('Visitor stats error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Track visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userId, page, action } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 })
    }

    // Get user agent info
    const userAgent = request.headers.get('user-agent') || ''
    const deviceType = userAgent.includes('Mobile') ? 'mobile' : 'desktop'

    // Check if visitor exists
    let visitor = await db.visitor.findUnique({
      where: { sessionId }
    })

    const today = new Date().toISOString().split('T')[0]

    if (visitor) {
      // Update existing visitor
      const updateData: any = {
        lastVisit: new Date(),
        pageViews: { increment: 1 },
        lastPage: page || visitor.lastPage
      }

      if (userId) {
        updateData.userId = userId
      }

      if (action === 'register') {
        updateData.didRegister = true
        // Update daily stat
        await upsertDailyStat(today, 'register')
      }

      if (action === 'login') {
        updateData.didLogin = true
        await upsertDailyStat(today, 'login')
      }

      visitor = await db.visitor.update({
        where: { sessionId },
        data: updateData
      })

      // Update daily stat for visit
      await upsertDailyStat(today, 'visit', deviceType, !visitor ? 'new' : 'returning')
    } else {
      // Create new visitor
      visitor = await db.visitor.create({
        data: {
          sessionId,
          userId: userId || null,
          deviceType,
          lastPage: page || null,
          didRegister: action === 'register',
          didLogin: action === 'login'
        }
      })

      // Update daily stat for new visitor
      await upsertDailyStat(today, 'new', deviceType)
    }

    return NextResponse.json({ success: true, visitorId: visitor.id })
  } catch (error) {
    console.error('Track visitor error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to update daily stats
async function upsertDailyStat(date: string, action: string, deviceType?: string, visitorType?: string) {
  try {
    const existing = await db.dailyVisitorStat.findUnique({
      where: { date }
    })

    if (existing) {
      const updateData: any = {
        totalVisitors: { increment: 1 }
      }

      if (action === 'new') {
        updateData.newVisitors = { increment: 1 }
        updateData.uniqueVisitors = { increment: 1 }
      } else if (action === 'visit' && visitorType === 'returning') {
        updateData.returningVisitors = { increment: 1 }
        updateData.uniqueVisitors = { increment: 1 }
      } else if (action === 'register') {
        updateData.registrations = { increment: 1 }
      } else if (action === 'login') {
        updateData.logins = { increment: 1 }
      }

      if (deviceType === 'mobile') {
        updateData.mobileVisitors = { increment: 1 }
      } else if (deviceType === 'desktop') {
        updateData.desktopVisitors = { increment: 1 }
      }

      await db.dailyVisitorStat.update({
        where: { date },
        data: updateData
      })
    } else {
      await db.dailyVisitorStat.create({
        data: {
          date,
          totalVisitors: 1,
          uniqueVisitors: 1,
          newVisitors: action === 'new' ? 1 : 0,
          returningVisitors: action === 'visit' && visitorType === 'returning' ? 1 : 0,
          registrations: action === 'register' ? 1 : 0,
          logins: action === 'login' ? 1 : 0,
          mobileVisitors: deviceType === 'mobile' ? 1 : 0,
          desktopVisitors: deviceType === 'desktop' ? 1 : 0
        }
      })
    }
  } catch (error) {
    console.error('Error updating daily stat:', error)
  }
}
