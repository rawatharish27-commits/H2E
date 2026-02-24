import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth'

// Login with mobile number and password
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, password } = body

    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mobile number'
      }, { status: 400 })
    }

    // Validate password
    if (!password || password.length < 4) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 400 })
    }

    // Find user by phone
    const user = await db.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found. Please register first.'
      }, { status: 400 })
    }

    // Verify password (stored in badges field as JSON)
    try {
      const badges = user.badges ? JSON.parse(user.badges) : {}
      if (badges.pwd !== password) {
        return NextResponse.json({
          success: false,
          error: 'Incorrect password'
        }, { status: 400 })
      }
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Account error. Please contact support.'
      }, { status: 400 })
    }

    // Update last login IP
    await db.user.update({
      where: { id: user.id },
      data: {
        lastLoginIP: request.headers.get('x-forwarded-for') || 'unknown',
        lastActiveAt: new Date()
      }
    })

    // Create session
    const token = await createSession(user.id)

    // Return user data
    const userData = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      avatar: user.avatar,
      trustScore: user.trustScore,
      paymentActive: user.paymentActive,
      activeTill: user.activeTill,
      helpfulCount: user.helpfulCount,
      ratingSum: user.ratingSum,
      ratingCount: user.ratingCount,
      referralCode: user.referralCode,
      darkMode: user.darkMode,
      isLeader: user.isLeader,
      leaderLevel: user.leaderLevel
    }

    const response = NextResponse.json({
      success: true,
      user: userData,
      token,
      message: 'Login successful!'
    })

    // Set cookie
    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Login failed. Please try again.'
    }, { status: 500 })
  }
}
