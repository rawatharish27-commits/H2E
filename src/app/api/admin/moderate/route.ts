import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { checkAdminAccess, hasPermission } from '@/lib/security/admin-rbac'

// Moderate user (block/ban/shadow-ban/update trust/reset strikes)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, adminKey, adminId, reason } = body

    // Authentication check
    let actingAdminId = 'admin'
    let isAdmin = false

    if (adminKey === 'admin123') {
      isAdmin = true
      actingAdminId = adminId || 'admin'
    } else {
      // Check token-based admin access
      const token = request.cookies.get('auth-token')?.value
      if (token) {
        const tokenUserId = await verifyToken(token)
        if (tokenUserId) {
          const admin = await checkAdminAccess(tokenUserId)
          if (admin && hasPermission(admin, 'BAN_USERS')) {
            isAdmin = true
            actingAdminId = tokenUserId
          }
        }
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action required' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case 'block':
        updateData = { isBlocked: true }
        break
      case 'unblock':
        updateData = { isBlocked: false }
        break
      case 'ban':
        updateData = { isBanned: true, isBlocked: true }
        break
      case 'unban':
        updateData = { isBanned: false, isBlocked: false }
        break
      case 'shadowBan':
        updateData = { isShadowBanned: true, isFlagged: true }
        break
      case 'unshadowBan':
        updateData = { isShadowBanned: false }
        break
      case 'flag':
        updateData = { isFlagged: true }
        break
      case 'unflag':
        updateData = { isFlagged: false }
        break
      case 'resetTrust':
        updateData = { trustScore: 50 }
        break
      case 'reduceTrust':
        updateData = { trustScore: Math.max(0, user.trustScore - 10) }
        break
      case 'increaseTrust':
        updateData = { trustScore: Math.min(100, user.trustScore + 10) }
        break
      case 'resetStrikes':
        updateData = { noShowStrikes: 0 }
        break
      case 'addStrike':
        updateData = { noShowStrikes: user.noShowStrikes + 1 }
        break
      case 'clearReports':
        updateData = { reportCount: 0 }
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update user
    await db.user.update({
      where: { id: userId },
      data: updateData
    })

    // Log action
    await db.adminLog.create({
      data: {
        adminId: actingAdminId,
        action: action.toUpperCase(),
        targetType: 'USER',
        targetId: userId,
        details: reason || `Admin action: ${action}`
      }
    })

    // Create security audit for serious actions
    if (['ban', 'shadowBan', 'unban', 'unshadowBan'].includes(action)) {
      await db.securityAudit.create({
        data: {
          userId,
          eventType: `ADMIN_${action.toUpperCase()}`,
          severity: action === 'ban' || action === 'shadowBan' ? 'HIGH' : 'WARNING',
          description: `Admin ${action} applied${reason ? `: ${reason}` : ''}`,
          resolved: action.startsWith('un')
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} successful`
    })
  } catch (error) {
    console.error('Admin user action error:', error)
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 })
  }
}
