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
        success: false,
        error: 'Location required',
        stats: null,
        topHelpers: []
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
    const totalUsers = await db.user.count()

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
      name: getCategoryName(sortedCategories[0][0]),
      count: sortedCategories[0][1].count,
      icon: sortedCategories[0][1].icon
    } : { name: 'N/A', count: 0, icon: '📦' }

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
    } : { name: 'N/A', count: 0, icon: '📦' }

    // Get high demand helps (top 3 categories)
    const highDemandHelps = sortedCategories.slice(0, 3).map(([category, data]) => ({
      name: getCategoryName(category),
      count: data.count,
      icon: data.icon
    }))

    // Get top 10 helpers - fetch all users with helps
    const allUsers = await db.user.findMany({
      where: {
        helpfulCount: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        trustScore: true,
        helpfulCount: true,
        ratingSum: true,
        ratingCount: true
      },
      orderBy: {
        helpfulCount: 'desc'
      },
      take: 10
    })

    const topHelpers = allUsers.map(h => ({
      id: h.id,
      name: h.name || 'User',
      avatar: h.avatar,
      trustScore: h.trustScore,
      helpsDone: h.helpfulCount,
      rating: h.ratingCount > 0 ? (h.ratingSum / h.ratingCount).toFixed(1) : '0.0',
      badge: getHelperBadge(h.trustScore, h.helpfulCount)
    }))

    return NextResponse.json({
      success: true,
      stats: {
        todayHelps,
        yesterdayHelps,
        weeklyHelps,
        totalUsers,
        topCategory,
        topResource,
        highDemandHelps
      },
      topHelpers
    })

  } catch (error) {
    console.error('Area stats error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch area stats',
      stats: null,
      topHelpers: []
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
    'pets': '🐕',
    'critical-sos': '🆘',
    'emergency-road': '🚗',
    'safety-escort': '🛡️',
    'patient-medical': '🏥',
    'elderly-assist': '👴',
    'child-family': '👶',
    'line-presence': '🧍',
    'shopping-errand': '🛒',
    'household-help': '🏠',
    'vehicle-transport': '🏍️',
    'temp-manpower': '💪',
    'item-sharing': '📦',
    'digital-form': '📱',
    'local-knowledge': '🗺️',
    'pet-animal': '🐕'
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
    'pets': 'Pet & Animal',
    'critical-sos': 'Critical SOS',
    'emergency-road': 'Road Emergency',
    'safety-escort': 'Safety Escort',
    'patient-medical': 'Patient Medical',
    'elderly-assist': 'Elderly Assist',
    'child-family': 'Child & Family',
    'line-presence': 'Line Presence',
    'shopping-errand': 'Shopping Errand',
    'household-help': 'Household Help',
    'vehicle-transport': 'Vehicle Transport',
    'temp-manpower': 'Temp Manpower',
    'item-sharing': 'Item Sharing',
    'digital-form': 'Digital Form',
    'local-knowledge': 'Local Knowledge',
    'pet-animal': 'Pet & Animal'
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
