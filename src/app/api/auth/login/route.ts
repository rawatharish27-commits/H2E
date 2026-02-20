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

    // Find user
    const user = await db.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found. Please register first.'
      }, { status: 404 })
    }

    // Check if user is blocked/banned
    if (user.isBanned) {
      return NextResponse.json({
        success: false,
        error: 'Your account has been banned. Contact support.'
      }, { status: 403 })
    }

    if (user.isBlocked && user.blockedTill && new Date() < user.blockedTill) {
      return NextResponse.json({
        success: false,
        error: 'Account temporarily blocked. Please try again later.'
      }, { status: 403 })
    }

    // Verify password (stored in referralCode field temporarily, or create a password field)
    // For now, we'll use a simple password check
    // In production, use bcrypt and a dedicated password field
    
    // Get stored password (we'll store it in a custom field or use a hash)
    // Since schema doesn't have password field, we'll use a simple approach
    // Store password hash in the user's badges field as JSON for now
    
    let storedPasswordHash = ''
    try {
      const badges = user.badges ? JSON.parse(user.badges) : {}
      storedPasswordHash = badges.pwd || ''
    } catch {
      storedPasswordHash = ''
    }

    // Simple password comparison (in production use bcrypt)
    if (!storedPasswordHash || storedPasswordHash !== password) {
      return NextResponse.json({
        success: false,
        error: 'Incorrect password. Please try again.'
      }, { status: 401 })
    }

    // Create session
    const token = await createSession(user.id)

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: {
        lastActiveAt: new Date(),
        lastLoginIP: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    // Return user data (excluding sensitive fields)
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
      token
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
