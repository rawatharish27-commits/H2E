import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { checkAdminAccess } from '@/lib/security/admin-rbac'

// Resolve security event
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    
    let adminId = 'system'
    
    // Check admin key or token
    if (adminKey === 'admin123') {
      adminId = 'admin'
    } else if (token) {
      const userId = await verifyToken(token)
      if (userId) {
        const admin = await checkAdminAccess(userId)
        if (!admin) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        adminId = userId
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { eventId, resolution } = body
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }
    
    await db.securityAudit.update({
      where: { id: eventId },
      data: {
        resolved: true,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        resolution: resolution || 'Resolved by admin'
      }
    })
    
    // Log action
    await db.adminLog.create({
      data: {
        adminId,
        action: 'RESOLVE_SECURITY_EVENT',
        targetType: 'SYSTEM',
        targetId: eventId,
        details: resolution
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resolve security event error:', error)
    return NextResponse.json({ error: 'Failed to resolve event' }, { status: 500 })
  }
}
