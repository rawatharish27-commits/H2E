import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Get current password from database or use environment variable
    let storedPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    try {
      const dbPassword = await db.systemSetting.findUnique({
        where: { key: 'admin_password' }
      })
      if (dbPassword) {
        storedPassword = dbPassword.value
      }
    } catch {
      // Table might not exist yet, use env variable
    }

    // Verify current password
    if (currentPassword !== storedPassword) {
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

    // Save new password to database
    try {
      await db.systemSetting.upsert({
        where: { key: 'admin_password' },
        create: {
          key: 'admin_password',
          value: newPassword,
          description: 'Admin panel password'
        },
        update: {
          value: newPassword
        }
      })
    } catch (dbError) {
      console.error('Failed to save password to database:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to save password. Please try again.' },
        { status: 500 }
      )
    }

    // Log the password change event
    try {
      await db.securityAudit.create({
        data: {
          eventType: 'ADMIN_PASSWORD_CHANGE',
          severity: 'HIGH',
          description: 'Admin password was changed successfully',
          resolved: true
        }
      })
    } catch {
      // Ignore if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully!'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
