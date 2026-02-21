/**
 * Share to WhatsApp API
 * Generates structured WhatsApp-safe messages for admins to share
 * 
 * Format:
 * 📍 [Area Name]
 * 🚨 [Urgency] Help Needed
 * [Title]
 * 👉 Details: [App Link]
 * 
 * Rules:
 * - Contact hidden (only visible in app)
 * - Location blurred (only visible after login)
 * - Manual forward (WhatsApp safe)
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Configuration
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://help2earn.app'

/**
 * Generate WhatsApp-safe message for a problem
 */
function generateWhatsAppMessage(problem: {
  id: string
  title: string
  type: string
  category: string | null
  areaCode: string | null
  address: string | null
  offerPrice: number | null
}): {
  title: string
  message: string
  formatted: string
  link: string
} {
  const urgencyEmoji = problem.type === 'EMERGENCY' ? '🚨' : 
                       problem.type === 'TIME_ACCESS' ? '⏰' : '📦'
  
  const urgencyText = problem.type === 'EMERGENCY' ? 'Urgent Help' :
                      problem.type === 'TIME_ACCESS' ? 'Quick Help' : 'Help Request'
  
  const location = problem.address?.split(',')[0] || problem.areaCode || 'Your Area'
  
  const priceText = problem.offerPrice ? `💰 ₹${problem.offerPrice}` : ''
  
  const link = `${APP_BASE_URL}/problem/${problem.id}`
  
  // WhatsApp-safe formatted message
  const formatted = `📍 ${location}
${urgencyEmoji} ${urgencyText} Needed

${problem.title}
${priceText}

👉 Details dekhne ke liye app open karein:
${link}

_
Help2Earn - Madad karein, kamaayein!`

  return {
    title: `${urgencyEmoji} ${problem.title}`,
    message: problem.title,
    formatted,
    link
  }
}

/**
 * GET - Get shareable content for a problem
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')
    const adminId = searchParams.get('adminId')

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID required' },
        { status: 400 }
      )
    }

    // Get problem details
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        category: true,
        areaCode: true,
        address: true,
        offerPrice: true,
        postedBy: {
          select: {
            name: true
          }
        }
      }
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Generate WhatsApp message
    const messageData = generateWhatsAppMessage(problem)

    // Create or update shareable post
    if (adminId) {
      await db.shareablePost.upsert({
        where: { problemId },
        update: {
          shareCount: { increment: 0 }
        },
        create: {
          problemId,
          adminId,
          shareTitle: messageData.title,
          shareMessage: messageData.message,
          shareLink: messageData.link,
          formattedMessage: messageData.formatted,
          status: 'PENDING'
        }
      })

      // Update admin stats
      await db.areaAdmin.updateMany({
        where: { userId: adminId },
        data: {
          sharesToWhatsApp: { increment: 1 },
          postsMonitored: { increment: 1 }
        }
      })
    }

    return NextResponse.json({
      success: true,
      problem: {
        id: problem.id,
        title: problem.title,
        type: problem.type,
        category: problem.category,
        postedBy: problem.postedBy.name
      },
      shareData: messageData,
      preview: {
        // For new users - limited preview
        title: problem.title,
        type: problem.type,
        category: problem.category,
        address: problem.address?.split(',')[0], // Only area name, not exact
        // Contact and exact location hidden
        contactHidden: true,
        locationBlurred: true
      },
      instructions: {
        step1: 'Copy the message above',
        step2: 'Open WhatsApp group',
        step3: 'Paste and send',
        step4: 'Users will open app to see details'
      }
    })
  } catch (error) {
    console.error('[Share] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate share content' },
      { status: 500 }
    )
  }
}

/**
 * POST - Track share event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, adminId, action } = body

    if (action === 'SHARED') {
      // Mark as shared
      await db.shareablePost.updateMany({
        where: { problemId },
        data: {
          status: 'SHARED',
          sharedAt: new Date(),
          shareCount: { increment: 1 }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Share tracked'
      })
    }

    if (action === 'VIEW') {
      // Track link view
      await db.shareablePost.updateMany({
        where: { problemId },
        data: {
          viewCount: { increment: 1 }
        }
      })

      return NextResponse.json({
        success: true
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Share] Error:', error)
    return NextResponse.json(
      { error: 'Failed to track share' },
      { status: 500 }
    )
  }
}

/**
 * Generate batch messages for multiple problems
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, areaCode } = body

    // Get all open problems in area
    const problems = await db.problem.findMany({
      where: {
        areaCode,
        status: 'OPEN'
      },
      select: {
        id: true,
        title: true,
        type: true,
        category: true,
        areaCode: true,
        address: true,
        offerPrice: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Generate messages for all
    const messages = problems.map(problem => ({
      problemId: problem.id,
      ...generateWhatsAppMessage(problem),
      createdAt: problem.createdAt
    }))

    return NextResponse.json({
      success: true,
      count: messages.length,
      messages
    })
  } catch (error) {
    console.error('[Share] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate batch messages' },
      { status: 500 }
    )
  }
}
