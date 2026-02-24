import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// GET - Get area heat map data
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'current'
    const areaCode = searchParams.get('areaCode') || user?.areaCode

    if (action === 'current') {
      if (!areaCode) {
        return NextResponse.json({ error: 'Area code required' }, { status: 400 })
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Get today's stats or calculate
      let stats = await db.areaDemandStats.findUnique({
        where: {
          areaCode_date: {
            areaCode,
            date: today
          }
        }
      })

      if (!stats) {
        // Calculate current stats
        const dayStart = new Date(today)
        const dayEnd = new Date(today)
        dayEnd.setHours(23, 59, 59, 999)

        // Count open problems
        const totalRequests = await db.problem.count({
          where: {
            areaCode,
            status: 'OPEN',
            createdAt: { gte: dayStart, lte: dayEnd }
          }
        })

        // Count active helpers (users active in last hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        const totalHelpers = await db.user.count({
          where: {
            areaCode,
            lastActiveAt: { gte: oneHourAgo },
            paymentActive: true
          }
        })

        // Calculate supply gap
        const supplyGap = totalRequests - totalHelpers

        // Determine demand level
        let demandLevel = 'MEDIUM'
        if (supplyGap >= 10) demandLevel = 'CRITICAL'
        else if (supplyGap >= 5) demandLevel = 'HIGH'
        else if (supplyGap <= -5) demandLevel = 'LOW'

        // Get category breakdown
        const categoryBreakdown = await db.problem.groupBy({
          by: ['type'],
          where: {
            areaCode,
            status: 'OPEN',
            createdAt: { gte: dayStart, lte: dayEnd }
          },
          _count: { id: true }
        })

        const categoryStats: Record<string, number> = {}
        categoryBreakdown.forEach(c => {
          categoryStats[c.type] = c._count.id
        })

        // Create stats entry
        stats = await db.areaDemandStats.create({
          data: {
            areaCode,
            date: today,
            totalRequests,
            totalHelpers,
            demandLevel,
            supplyGap,
            categoryStats: JSON.stringify(categoryStats)
          }
        })
      }

      // Get nearby areas for comparison
      const nearbyAreas = await db.areaDemandStats.findMany({
        where: {
          date: today,
          demandLevel: { in: ['HIGH', 'CRITICAL'] }
        },
        take: 5
      })

      return NextResponse.json({
        success: true,
        heatmap: {
          areaCode,
          date: stats.date,
          demandLevel: stats.demandLevel,
          totalRequests: stats.totalRequests,
          totalHelpers: stats.totalHelpers,
          supplyGap: stats.supplyGap,
          categoryStats: stats.categoryStats ? JSON.parse(stats.categoryStats) : {},
          indicators: {
            isHighDemand: stats.demandLevel === 'HIGH' || stats.demandLevel === 'CRITICAL',
            isLowSupply: stats.supplyGap > 0,
            needsHelpers: stats.supplyGap >= 5
          }
        },
        nearbyHighDemand: nearbyAreas.map(a => ({
          areaCode: a.areaCode,
          demandLevel: a.demandLevel,
          supplyGap: a.supplyGap
        })),
        recommendation: getRecommendation(stats.demandLevel, stats.supplyGap)
      })
    }

    if (action === 'weekly-trend') {
      if (!areaCode) {
        return NextResponse.json({ error: 'Area code required' }, { status: 400 })
      }

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)

      const weeklyStats = await db.areaDemandStats.findMany({
        where: {
          areaCode,
          date: { gte: startDate, lte: endDate }
        },
        orderBy: { date: 'asc' }
      })

      return NextResponse.json({
        success: true,
        trend: weeklyStats.map(s => ({
          date: s.date,
          requests: s.totalRequests,
          helpers: s.totalHelpers,
          gap: s.supplyGap,
          level: s.demandLevel
        }))
      })
    }

    if (action === 'leader-view') {
      // For leaders to see demand in their area
      if (!user || !user.isLeader) {
        return NextResponse.json({ error: 'Leader access required' }, { status: 403 })
      }

      const leaderAreas = await db.leader.findMany({
        where: { userId: user.id, isActive: true },
        select: { areaCode: true }
      })

      const areaCodes = leaderAreas.map(l => l.areaCode)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const areaStats = await db.areaDemandStats.findMany({
        where: {
          areaCode: { in: areaCodes },
          date: today
        }
      })

      return NextResponse.json({
        success: true,
        areas: areaStats.map(s => ({
          areaCode: s.areaCode,
          demandLevel: s.demandLevel,
          totalRequests: s.totalRequests,
          totalHelpers: s.totalHelpers,
          supplyGap: s.supplyGap,
          needsAttention: s.demandLevel === 'HIGH' || s.demandLevel === 'CRITICAL'
        }))
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Heatmap GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper: Get recommendation based on demand
function getRecommendation(demandLevel: string, supplyGap: number): string {
  switch (demandLevel) {
    case 'CRITICAL':
      return `⚠️ Critical demand! ${supplyGap} more helpers needed urgently. Great earning opportunity!`
    case 'HIGH':
      return `🔥 High demand zone! ${supplyGap} tasks waiting for helpers. Good time to be active.`
    case 'LOW':
      return `✅ Balanced area. Enough helpers for current demand.`
    default:
      return `📍 Moderate activity. Steady opportunities available.`
  }
}
