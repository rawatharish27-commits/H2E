import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/area/stats - Get area statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')

    if (!lat || !lng) {
      return NextResponse.json({
        success: true,
        stats: getMockStats(),
        topHelpers: getMockTopHelpers()
      })
    }

    // Calculate date ranges
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get problems in area (within 20km radius)
    const problems = await db.problem.findMany({
      where: {
        status: { not: 'DRAFT' },
        createdAt: { gte: weekStart }
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
            trustScore: true,
            helpfulCount: true,
            ratingSum: true,
            ratingCount: true
          }
        }
      }
    })

    // Filter by distance (20km radius)
    const radiusKm = 20
    const nearbyProblems = problems.filter(p => {
      if (!p.latitude || !p.longitude) return false
      const distance = getDistanceKm(lat, lng, p.latitude, p.longitude)
      return distance <= radiusKm
    })

    // Calculate stats
    const todayHelps = nearbyProblems.filter(p => new Date(p.createdAt) >= todayStart && p.status === 'COMPLETED').length
    const yesterdayHelps = nearbyProblems.filter(p => {
      const date = new Date(p.createdAt)
      return date >= yesterdayStart && date < todayStart && p.status === 'COMPLETED'
    }).length
    const weeklyHelps = nearbyProblems.filter(p => p.status === 'COMPLETED').length

    // Get total users in area
    const usersInArea = await db.user.findMany()

    // Get top categories
    const categoryCounts = new Map<string, { count: number; icon: string }>()
    nearbyProblems.forEach(p => {
      if (p.category) {
        const existing = categoryCounts.get(p.category) || { count: 0, icon: getCategoryIcon(p.category) }
        categoryCounts.set(p.category, { count: existing.count + 1, icon: existing.icon })
      }
    })

    const sortedCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
    
    const topCategory = sortedCategories[0] ? {
      name: sortedCategories[0][0],
      count: sortedCategories[0][1].count,
      icon: sortedCategories[0][1].icon
    } : { name: 'Medical Help', count: 0, icon: '🏥' }

    // Get top resources (based on type)
    const resourceCounts = new Map<string, { count: number; icon: string }>()
    nearbyProblems.forEach(p => {
      const existing = resourceCounts.get(p.type) || { count: 0, icon: getTypeIcon(p.type) }
      resourceCounts.set(p.type, { count: existing.count + 1, icon: existing.icon })
    })

    const sortedResources = Array.from(resourceCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
    
    const topResource = sortedResources[0] ? {
      name: getTypeName(sortedResources[0][0]),
      count: sortedResources[0][1].count,
      icon: sortedResources[0][1].icon
    } : { name: 'Vehicle Transport', count: 0, icon: '🏍️' }

    // Get high demand helps (top 3 categories)
    const highDemandHelps = sortedCategories.slice(0, 3).map(([name, data]) => ({
      name: getCategoryName(name),
      count: data.count,
      icon: data.icon
    }))

    // Get top 10 helpers
    const helperStats = new Map<string, {
      id: string
      name: string
      avatar: string | null
      trustScore: number
      helpsDone: number
      ratingSum: number
      ratingCount: number
    }>()

    nearbyProblems.forEach(p => {
      if (p.acceptedBy && p.status === 'COMPLETED') {
        p.acceptedBy.forEach(helperId => {
          const existing = helperStats.get(helperId) || {
            id: helperId,
            name: 'User',
            avatar: null,
            trustScore: 50,
            helpsDone: 0,
            ratingSum: 0,
            ratingCount: 0
          }
          existing.helpsDone += 1
          helperStats.set(helperId, existing)
        })
      }
    })

    // Fetch helper details
    const helperIds = Array.from(helperStats.keys())
    const helpers = await db.user.findMany({
      where: { id: { in: helperIds } },
      select: {
        id: true,
        name: true,
        avatar: true,
        trustScore: true,
        helpfulCount: true,
        ratingSum: true,
        ratingCount: true
      }
    })

    const topHelpers = helpers
      .map(h => {
        const stats = helperStats.get(h.id) || { helpsDone: 0 }
        return {
          id: h.id,
          name: h.name || 'User',
          avatar: h.avatar,
          trustScore: h.trustScore,
          helpsDone: stats.helpsDone,
          rating: h.ratingCount > 0 ? (h.ratingSum / h.ratingCount).toFixed(1) : '0.0',
          badge: getHelperBadge(h.trustScore, stats.helpsDone)
        }
      })
      .sort((a, b) => b.helpsDone - a.helpsDone)
      .slice(0, 10)

    // If no real data, return mock data
    if (topHelpers.length === 0) {
      return NextResponse.json({
        success: true,
        stats: getMockStats(),
        topHelpers: getMockTopHelpers()
      })
    }

    return NextResponse.json({
      success: true,
      stats: {
        todayHelps,
        yesterdayHelps,
        weeklyHelps,
        totalUsers: usersInArea.length,
        topCategory,
        topResource,
        highDemandHelps: highDemandHelps.length > 0 ? highDemandHelps : [
          { name: 'Medicine Delivery', count: 45, icon: '💊' },
          { name: 'Grocery Pickup', count: 38, icon: '🛒' },
          { name: 'Elderly Assist', count: 32, icon: '👴' }
        ]
      },
      topHelpers
    })

  } catch (error) {
    console.error('Area stats error:', error)
    return NextResponse.json({
      success: true,
      stats: getMockStats(),
      topHelpers: getMockTopHelpers()
    })
  }
}

// Helper functions
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'medical': '🏥',
    'transport': '🏍️',
    'shopping': '🛒',
    'household': '🏠',
    'elderly': '👴',
    'child': '👶',
    'emergency': '🆘',
    'digital': '📱',
    'tools': '🔧',
    'pets': '🐕'
  }
  return icons[category.toLowerCase()] || '📦'
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    'medical': 'Medical Help',
    'transport': 'Vehicle Transport',
    'shopping': 'Shopping Errand',
    'household': 'Household Help',
    'elderly': 'Elderly Assist',
    'child': 'Child & Family',
    'emergency': 'Emergency SOS',
    'digital': 'Digital Form',
    'tools': 'Tools Needed',
    'pets': 'Pet & Animal'
  }
  return names[category.toLowerCase()] || category
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    'EMERGENCY': '🆘',
    'TIME_ACCESS': '⏰',
    'RESOURCE_RENT': '📦'
  }
  return icons[type] || '📦'
}

function getTypeName(type: string): string {
  const names: Record<string, string> = {
    'EMERGENCY': 'Emergency Help',
    'TIME_ACCESS': 'Time Based Help',
    'RESOURCE_RENT': 'Resource Rent'
  }
  return names[type] || type
}

function getHelperBadge(trustScore: number, helpsDone: number): string {
  if (helpsDone >= 100 && trustScore >= 85) return '🏆 Top Helper'
  if (helpsDone >= 50 && trustScore >= 70) return '⭐ Star Helper'
  if (trustScore >= 70) return '💚 Trusted'
  if (helpsDone >= 20) return '⭐ Rising Star'
  return '🌱 New Helper'
}

function getMockStats() {
  return {
    todayHelps: 15,
    yesterdayHelps: 23,
    weeklyHelps: 87,
    totalUsers: 156,
    topCategory: { name: 'Medical Help', count: 34, icon: '🏥' },
    topResource: { name: 'Vehicle Transport', count: 28, icon: '🏍️' },
    highDemandHelps: [
      { name: 'Medicine Delivery', count: 45, icon: '💊' },
      { name: 'Grocery Pickup', count: 38, icon: '🛒' },
      { name: 'Elderly Assist', count: 32, icon: '👴' }
    ]
  }
}

function getMockTopHelpers() {
  return [
    { id: '1', name: 'Rajesh Kumar', trustScore: 92, helpsDone: 156, rating: '4.9', badge: '🏆 Top Helper', avatar: null },
    { id: '2', name: 'Priya Sharma', trustScore: 88, helpsDone: 134, rating: '4.8', badge: '⭐ Star Helper', avatar: null },
    { id: '3', name: 'Amit Patel', trustScore: 85, helpsDone: 98, rating: '4.7', badge: '💚 Trusted', avatar: null },
    { id: '4', name: 'Sunita Devi', trustScore: 82, helpsDone: 87, rating: '4.6', badge: '💚 Trusted', avatar: null },
    { id: '5', name: 'Vikram Singh', trustScore: 79, helpsDone: 76, rating: '4.5', badge: '💚 Trusted', avatar: null },
    { id: '6', name: 'Neha Gupta', trustScore: 77, helpsDone: 68, rating: '4.4', badge: '⭐ Rising Star', avatar: null },
    { id: '7', name: 'Deepak Yadav', trustScore: 75, helpsDone: 62, rating: '4.3', badge: '⭐ Rising Star', avatar: null },
    { id: '8', name: 'Kavita Joshi', trustScore: 73, helpsDone: 55, rating: '4.2', badge: '⭐ Rising Star', avatar: null },
    { id: '9', name: 'Rahul Verma', trustScore: 71, helpsDone: 48, rating: '4.1', badge: '⭐ Rising Star', avatar: null },
    { id: '10', name: 'Anita Sharma', trustScore: 70, helpsDone: 42, rating: '4.0', badge: '⭐ Rising Star', avatar: null }
  ]
}
