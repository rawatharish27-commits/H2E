import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProblemType } from '@/types'

// Haversine formula to calculate distance
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// GET /api/problems/nearby - Get problems within radius
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '20') // Default 20km
    const type = searchParams.get('type') as ProblemType | null
    const userId = searchParams.get('userId')
    const excludeUserId = searchParams.get('excludeUserId') || userId

    // Validate location
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: 'Valid location (lat, lng) is required' },
        { status: 400 }
      )
    }

    // Validate radius
    const maxRadius = 50 // Max 50km
    const effectiveRadius = Math.min(Math.max(radius, 1), maxRadius)

    // Build query
    const whereClause: Record<string, unknown> = {
      status: 'OPEN',
      moderationStatus: { not: 'REJECTED' },
      isAutoHidden: false,
    }

    // Add type filter if specified
    if (type) {
      whereClause.type = type
    }

    // Exclude user's own problems
    if (excludeUserId) {
      whereClause.postedById = { not: excludeUserId }
    }

    // Get problems with approximate location filter for performance
    // Using a rough bounding box (1 degree ≈ 111km)
    const latDelta = effectiveRadius / 111
    const lngDelta = effectiveRadius / (111 * Math.cos((lat * Math.PI) / 180))

    const problems = await db.problem.findMany({
      where: {
        ...whereClause,
        lat: {
          gte: lat - latDelta,
          lte: lat + latDelta
        },
        lng: {
          gte: lng - lngDelta,
          lte: lng + lngDelta
        }
      },
      include: {
        postedBy: {
          select: {
            id: true,
            phone: true,
            name: true,
            avatar: true,
            trustScore: true,
            paymentActive: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Calculate exact distance and filter
    const nearbyProblems = problems
      .map(problem => {
        const distance = calculateDistance(lat, lng, problem.lat, problem.lng)
        return {
          ...problem,
          distance: Math.round(distance * 100) / 100 // Round to 2 decimals
        }
      })
      .filter(p => p.distance <= effectiveRadius)
      .sort((a, b) => a.distance - b.distance)

    // Format response
    const formattedProblems = nearbyProblems.map(p => ({
      id: p.id,
      postedById: p.postedById,
      type: p.type,
      category: p.category,
      riskLevel: p.riskLevel,
      title: p.title,
      description: p.description,
      offerPrice: p.offerPrice,
      lat: p.lat,
      lng: p.lng,
      address: p.address,
      minTrustRequired: p.minTrustRequired,
      status: p.status,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt,
      distance: p.distance,
      postedBy: {
        id: p.postedBy.id,
        phone: p.postedBy.phone,
        name: p.postedBy.name,
        avatar: p.postedBy.avatar,
        trustScore: p.postedBy.trustScore,
      }
    }))

    return NextResponse.json({
      success: true,
      problems: formattedProblems,
      meta: {
        center: { lat, lng },
        radius: effectiveRadius,
        total: formattedProblems.length,
        filtered: problems.length - formattedProblems.length
      }
    })

  } catch (error) {
    console.error('Get nearby problems error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nearby problems' },
      { status: 500 }
    )
  }
}
