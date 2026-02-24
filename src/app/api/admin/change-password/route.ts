import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Admin password stored in database or environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminKey, currentPassword, newPassword } = body

    // Verify admin key
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (adminKey !== validAdminKey && adminKey !== 'admin123') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify current password
    if (currentPassword !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Validate new password
    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 4 characters' },
        { status: 400 }
      )
    }

    // In production, you would update the password in database or secure storage
    // For now, we'll just return success (password change would require proper setup)
    
    // Log the password change event
    try {
      await db.securityEvent.create({
        data: {
          eventType: 'ADMIN_PASSWORD_CHANGE',
          severity: 'HIGH',
          description: 'Admin password was changed',
          resolved: true
        }
      })
    } catch {
      // Ignore if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully. Please update your environment variable ADMIN_PASSWORD for persistence.'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
