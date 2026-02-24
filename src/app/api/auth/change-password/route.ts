import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Change Password - For logged in users
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, currentPassword, newPassword } = body

    // Validate
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 })
    }

    // Validate new password
    if (newPassword.length < 4) {
      return NextResponse.json({
        success: false,
        error: 'New password must be at least 4 characters'
      }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Get current password from badges
    let storedPassword = ''
    try {
      const badges = user.badges ? JSON.parse(user.badges) : {}
      storedPassword = badges.pwd || ''
    } catch {
      storedPassword = ''
    }

    // Verify current password
    if (storedPassword !== currentPassword) {
      return NextResponse.json({
        success: false,
        error: 'Current password is incorrect'
      }, { status: 401 })
    }

    // Update password
    let badges: Record<string, unknown> = {}
    try {
      badges = user.badges ? JSON.parse(user.badges) : {}
    } catch {
      badges = {}
    }

    badges.pwd = newPassword

    await db.user.update({
      where: { id: user.id },
      data: {
        badges: JSON.stringify(badges)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to change password. Please try again.'
    }, { status: 500 })
  }
}
