import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProblemType, ProblemStatus } from '@/types'
import { notifyNearbyPaidUsers } from '@/lib/notifications/whatsapp'

// Get nearby problems
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const type = searchParams.get('type') as ProblemType | null
    const status = searchParams.get('status') as ProblemStatus || 'OPEN'
    const userId = searchParams.get('userId')

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Location required' },
        { status: 400 }
      )
    }

    // Check user subscription
    if (userId) {
      const user = await db.user.findUnique({
        where: { id: userId }
      })
      
      if (!user || !user.paymentActive || (user.activeTill && user.activeTill < new Date())) {
        return NextResponse.json(
          { error: 'Active subscription required' },
          { status: 403 }
        )
      }
    }

    // Get all open problems
    const problems = await db.problem.findMany({
      where: {
        status,
        ...(type && { type }),
        postedById: { not: userId || undefined }
      },
      include: {
        postedBy: {
          select: {
            id: true,
            phone: true,
            name: true,
            avatar: true,
            trustScore: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Filter by distance (20km radius)
    const R = 6371 // Earth's radius in km
    const nearbyProblems = problems
      .map(problem => {
        const dLat = ((problem.lat - lat) * Math.PI) / 180
        const dLng = ((problem.lng - lng) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat * Math.PI) / 180) *
            Math.cos((problem.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c

        return {
          ...problem,
          distance
        }
      })
      .filter(p => p.distance <= 20)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({
      success: true,
      problems: nearbyProblems
    })
  } catch (error) {
    console.error('Get problems error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}

// Create new problem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      type,
      category,
      title,
      description,
      offerPrice,
      lat,
      lng,
      address,
      minTrustRequired
    } = body

    // Validate
    if (!userId || !type || !title || !lat || !lng) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check user subscription and trust
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.paymentActive || (user.activeTill && user.activeTill < new Date())) {
      return NextResponse.json(
        { error: 'Active subscription required' },
        { status: 403 }
      )
    }

    if (user.isBlocked || user.isBanned) {
      return NextResponse.json(
        { error: 'Account is restricted' },
        { status: 403 }
      )
    }

    // Determine min trust based on type
    const defaultMinTrust = type === 'RESOURCE_RENT' ? 70 : 
                           type === 'TIME_ACCESS' ? 50 : 40

    // Create problem
    const problem = await db.problem.create({
      data: {
        postedById: userId,
        type,
        category,
        title,
        description,
        offerPrice,
        lat,
        lng,
        address,
        minTrustRequired: minTrustRequired || defaultMinTrust,
        status: 'OPEN',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      },
      include: {
        postedBy: {
          select: {
            id: true,
            phone: true,
            name: true,
            trustScore: true,
          }
        }
      }
    })

    // Send WhatsApp notifications to nearby paid users (async, non-blocking)
    // This runs in the background and doesn't affect the response
    notifyNearbyPaidUsers({
      id: problem.id,
      type: problem.type as ProblemType,
      title: problem.title,
      category: problem.category,
      lat: problem.lat,
      lng: problem.lng,
      offerPrice: problem.offerPrice,
      postedById: problem.postedById,
      postedBy: {
        name: problem.postedBy.name
      }
    }).catch(error => {
      // Log error but don't fail the request
      console.error('[Problem API] Failed to send WhatsApp notifications:', error)
    })

    return NextResponse.json({
      success: true,
      problem
    })
  } catch (error) {
    console.error('Create problem error:', error)
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    )
  }
}
