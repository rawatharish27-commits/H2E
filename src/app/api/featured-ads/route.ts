import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Featured Ads Configuration
const FEATURED_CONFIG = {
  MONTHLY_PRICE: 999,
  QUARTERLY_PRICE: 2499,
  YEARLY_PRICE: 9999,
  MAX_ADS_PER_AREA: 5
}

// GET - Get featured ads
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    const areaCode = searchParams.get('areaCode')

    if (action === 'list') {
      if (!areaCode) {
        return NextResponse.json({ error: 'Area code required' }, { status: 400 })
      }

      const ads = await db.featuredAd.findMany({
        where: {
          areaCode,
          isActive: true,
          endsAt: { gte: new Date() }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        take: FEATURED_CONFIG.MAX_ADS_PER_AREA
      })

      return NextResponse.json({
        success: true,
        ads: ads.map(ad => ({
          id: ad.id,
          businessName: ad.businessName,
          businessType: ad.businessType,
          description: ad.description,
          logoUrl: ad.logoUrl,
          phone: ad.phone,
          address: ad.address,
          website: ad.website,
          isSponsored: true
        }))
      })
    }

    if (action === 'my-ads') {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const ads = await db.featuredAd.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        success: true,
        ads
      })
    }

    if (action === 'pricing') {
      return NextResponse.json({
        success: true,
        pricing: {
          monthly: {
            price: FEATURED_CONFIG.MONTHLY_PRICE,
            duration: '30 days',
            label: '₹999/month'
          },
          quarterly: {
            price: FEATURED_CONFIG.QUARTERLY_PRICE,
            duration: '90 days',
            label: '₹2499/quarter',
            savings: 'Save ₹500'
          },
          yearly: {
            price: FEATURED_CONFIG.YEARLY_PRICE,
            duration: '365 days',
            label: '₹9999/year',
            savings: 'Save ₹1990'
          }
        },
        benefits: [
          'Show at top of nearby tasks',
          'Special "Sponsored" badge',
          'Click tracking and analytics',
          'Priority support'
        ]
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Featured Ads GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create featured ad
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      areaCode,
      businessName,
      businessType,
      description,
      logoUrl,
      phone,
      address,
      website,
      planType
    } = body

    if (!areaCode || !businessName || !businessType || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate amount and duration
    let amount: number
    let durationDays: number

    switch (planType) {
      case 'QUARTERLY':
        amount = FEATURED_CONFIG.QUARTERLY_PRICE
        durationDays = 90
        break
      case 'YEARLY':
        amount = FEATURED_CONFIG.YEARLY_PRICE
        durationDays = 365
        break
      default:
        amount = FEATURED_CONFIG.MONTHLY_PRICE
        durationDays = 30
    }

    // Check ad slots in area
    const activeAds = await db.featuredAd.count({
      where: {
        areaCode,
        isActive: true,
        endsAt: { gte: new Date() }
      }
    })

    if (activeAds >= FEATURED_CONFIG.MAX_ADS_PER_AREA) {
      return NextResponse.json({
        error: 'Maximum featured ads reached for this area. Please try again later.',
        slotsAvailable: false
      }, { status: 400 })
    }

    const startsAt = new Date()
    const endsAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)

    const ad = await db.featuredAd.create({
      data: {
        userId: user.id,
        areaCode,
        businessName,
        businessType,
        description,
        logoUrl,
        phone,
        address,
        website,
        planType: planType || 'MONTHLY',
        amount,
        paymentStatus: 'PENDING', // Will be activated on payment
        startsAt,
        endsAt,
        isActive: true // Simulating payment success
      }
    })

    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: '🏪 Featured Ad Created!',
        message: `Your ad "${businessName}" is now live in ${areaCode}. It will be visible for ${durationDays} days.`
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Featured ad created successfully',
      ad: {
        id: ad.id,
        businessName: ad.businessName,
        areaCode: ad.areaCode,
        planType: ad.planType,
        amount: ad.amount,
        startsAt: ad.startsAt,
        endsAt: ad.endsAt
      }
    })
  } catch (error) {
    console.error('Featured Ads POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
