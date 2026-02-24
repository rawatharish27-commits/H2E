import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Reset Password - After OTP verification
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, newPassword } = body

    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mobile number'
      }, { status: 400 })
    }

    // Validate password
    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 4 characters'
      }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Update password (stored in badges field as JSON)
    let badges: Record<string, unknown> = {}
    try {
      badges = user.badges ? JSON.parse(user.badges) : {}
    } catch {
      badges = {}
    }

    // Store new password
    badges.pwd = newPassword

    await db.user.update({
      where: { id: user.id },
      data: {
        badges: JSON.stringify(badges)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. Please login with new password.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to reset password. Please try again.'
    }, { status: 500 })
  }
}
