import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Forgot Password - Send OTP to verify identity
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = body

    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mobile number'
      }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found with this mobile number'
      }, { status: 404 })
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTP for this phone
    await db.otpVerification.deleteMany({
      where: { phone }
    })

    // Create new OTP
    await db.otpVerification.create({
      data: {
        phone,
        otp,
        expiresAt
      }
    })

    // In production, send OTP via SMS
    console.log(`[FORGOT PASSWORD] OTP for ${phone}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your mobile number',
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send OTP. Please try again.'
    }, { status: 500 })
  }
}
