import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Verification Configuration
const VERIFICATION_CONFIG = {
  TOP_PERFORMER_MIN_HELPS: 20,
  TOP_PERFORMER_MIN_RATING: 4.5,
  TOP_PERFORMER_WEEKLY_HELPS: 5
}

// GET - Get user verification status
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || user.id

    let verification = await db.userVerification.findUnique({
      where: { userId }
    })

    if (!verification) {
      // Create default verification record
      verification = await db.userVerification.create({
        data: {
          userId,
          totalHelps: user.helpfulCount,
          avgRating: user.avgRating
        }
      })
    }

    // Check auto-qualification for Top Performer
    const qualifiesTopPerformer = 
      user.helpfulCount >= VERIFICATION_CONFIG.TOP_PERFORMER_MIN_HELPS &&
      user.avgRating >= VERIFICATION_CONFIG.TOP_PERFORMER_MIN_RATING

    if (qualifiesTopPerformer && !verification.topPerformer) {
      await db.userVerification.update({
        where: { userId },
        data: {
          topPerformer: true,
          autoQualified: true,
          qualifiedAt: new Date(),
          totalHelps: user.helpfulCount,
          avgRating: user.avgRating
        }
      })
      verification.topPerformer = true
    }

    return NextResponse.json({
      success: true,
      verification: {
        idVerified: verification.idVerified,
        businessVerified: verification.businessVerified,
        topPerformer: verification.topPerformer,
        idType: verification.idType,
        idVerifiedAt: verification.idVerifiedAt,
        businessName: verification.businessName,
        businessType: verification.businessType,
        autoQualified: verification.autoQualified
      },
      badges: {
        idVerified: {
          icon: '✔',
          label: 'ID Verified',
          color: verification.idVerified ? 'green' : 'gray',
          active: verification.idVerified
        },
        businessVerified: {
          icon: '🏪',
          label: 'Business Verified',
          color: verification.businessVerified ? 'blue' : 'gray',
          active: verification.businessVerified
        },
        topPerformer: {
          icon: '⭐',
          label: 'Top Performer',
          color: verification.topPerformer ? 'yellow' : 'gray',
          active: verification.topPerformer
        }
      }
    })
  } catch (error) {
    console.error('Verification GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Submit verification request
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    // type: 'ID' or 'BUSINESS'

    if (type === 'ID') {
      const { idType, idNumber, idDocumentUrl } = data

      if (!idType || !idNumber || !idDocumentUrl) {
        return NextResponse.json({ error: 'Missing ID verification fields' }, { status: 400 })
      }

      const verification = await db.userVerification.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          idType,
          idNumber: idNumber.slice(-4).padStart(idNumber.length, '*'), // Mask ID
          idDocumentUrl,
          totalHelps: user.helpfulCount,
          avgRating: user.avgRating
        },
        update: {
          idType,
          idNumber: idNumber.slice(-4).padStart(idNumber.length, '*'),
          idDocumentUrl
        }
      })

      // In production, this would trigger admin review
      // For now, auto-verify (in real app, admin would approve)
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM',
          title: '📋 ID Verification Submitted',
          message: 'Your ID verification is under review. You will be notified once approved.'
        }
      })

      return NextResponse.json({
        success: true,
        message: 'ID verification submitted for review'
      })
    }

    if (type === 'BUSINESS') {
      const { businessName, businessType, businessAddress, businessDocUrl } = data

      if (!businessName || !businessType) {
        return NextResponse.json({ error: 'Missing business verification fields' }, { status: 400 })
      }

      await db.userVerification.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          businessName,
          businessType,
          businessAddress,
          businessDocUrl,
          totalHelps: user.helpfulCount,
          avgRating: user.avgRating
        },
        update: {
          businessName,
          businessType,
          businessAddress,
          businessDocUrl
        }
      })

      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM',
          title: '🏪 Business Verification Submitted',
          message: 'Your business verification is under review. You will be notified once approved.'
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Business verification submitted for review'
      })
    }

    return NextResponse.json({ error: 'Invalid verification type' }, { status: 400 })
  } catch (error) {
    console.error('Verification POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
