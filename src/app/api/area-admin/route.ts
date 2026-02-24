/**
 * Area Admin API
 * Manages official area community leaders
 * 
 * Rules:
 * - Only 1 admin per area
 * - Free entry with 3 months premium
 * - "Area Community Leader" badge
 * - Featured profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createNotification } from '@/lib/notifications'

// Get area admin info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const areaId = searchParams.get('areaId')
    const action = searchParams.get('action')

    if (action === 'stats' && areaId) {
      // Get admin stats for area
      const admin = await db.areaAdmin.findFirst({
        where: { areaId, status: 'ACTIVE' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              phone: true,
              trustScore: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        admin
      })
    }

    if (userId) {
      // Get user's admin profile
      const adminProfile = await db.areaAdmin.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              phone: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        adminProfile
      })
    }

    // Get all admins
    const admins = await db.areaAdmin.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            trustScore: true
          }
        }
      },
      take: 20
    })

    return NextResponse.json({
      success: true,
      admins
    })
  } catch (error) {
    console.error('[Area Admin] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    )
  }
}

// Apply/Register as area admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, areaId, areaName, areaCode } = body

    if (!userId || !areaId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is already an admin
    const existingAdmin = await db.areaAdmin.findUnique({
      where: { userId }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'You are already an admin for another area' },
        { status: 400 }
      )
    }

    // Check if area already has an admin
    const existingAreaAdmin = await db.areaAdmin.findUnique({
      where: { areaId }
    })

    if (existingAreaAdmin) {
      return NextResponse.json(
        { error: 'This area already has an admin' },
        { status: 400 }
      )
    }

    // Calculate premium until (3 months from now)
    const premiumUntil = new Date()
    premiumUntil.setMonth(premiumUntil.getMonth() + 3)

    // Create area admin
    const admin = await db.areaAdmin.create({
      data: {
        userId,
        areaId,
        status: 'ACTIVE',
        premiumUntil,
        badgeType: 'COMMUNITY_LEADER',
        featured: true
      }
    })

    // Create or update area
    await db.area.upsert({
      where: { id: areaId },
      update: {},
      create: {
        id: areaId,
        areaCode: areaCode || areaId,
        areaName: areaName || 'Unknown Area',
        hasOfficialGroup: false
      }
    })

    // Update user with premium
    await db.user.update({
      where: { id: userId },
      data: {
        paymentActive: true,
        activeTill: premiumUntil,
        subscriptionType: 'PREMIUM'
      }
    })

    // Send notification
    await createNotification({
      userId,
      type: 'SYSTEM',
      title: '🎉 Congratulations!',
      message: 'You are now the Community Leader for your area! Enjoy 3 months premium free.',
      priority: 'HIGH'
    })

    console.log(`[Area Admin] Created admin: ${userId} for area: ${areaId}`)

    return NextResponse.json({
      success: true,
      admin,
      benefits: {
        premiumMonths: 3,
        premiumUntil,
        badgeType: 'COMMUNITY_LEADER',
        featured: true
      }
    })
  } catch (error) {
    console.error('[Area Admin] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}

// Update admin stats
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, action } = body

    const admin = await db.areaAdmin.findUnique({
      where: { id: adminId }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case 'POST_MONITORED':
        updateData = { postsMonitored: { increment: 1 } }
        break
      case 'SHARE_TO_WHATSAPP':
        updateData = { sharesToWhatsApp: { increment: 1 } }
        break
      case 'GROUP_MAINTAINED':
        updateData = { groupMaintenance: { increment: 1 } }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const updated = await db.areaAdmin.update({
      where: { id: adminId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      admin: updated
    })
  } catch (error) {
    console.error('[Area Admin] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update admin' },
      { status: 500 }
    )
  }
}
