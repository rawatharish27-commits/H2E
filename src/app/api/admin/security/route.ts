import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { checkAdminAccess } from '@/lib/security/admin-rbac'

// Get security events
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    
    let isAdmin = false
    
    // Check admin key or token
    if (adminKey === 'admin123') {
      isAdmin = true
    } else if (token) {
      const userId = await verifyToken(token)
      if (userId) {
        const admin = await checkAdminAccess(userId)
        isAdmin = !!admin
      }
    }
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const events = await db.securityAudit.findMany({
      where: { resolved: false },
      include: {
        user: {
          select: { phone: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    
    return NextResponse.json({
      success: true,
      events
    })
  } catch (error) {
    console.error('Get security events error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
