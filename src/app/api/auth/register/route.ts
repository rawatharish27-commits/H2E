import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth'

// Register new user with mobile number and password
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      phone, 
      password, 
      name, 
      village, 
      city, 
      state, 
      pincode,
      lat,
      lng
    } = body

    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mobile number'
      }, { status: 400 })
    }

    // Validate name
    if (!name || name.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Name must be at least 2 characters'
      }, { status: 400 })
    }

    // Validate password
    if (!password || password.length < 4) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 4 characters'
      }, { status: 400 })
    }

    // Validate city
    if (!city || city.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Please enter your city'
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'This mobile number is already registered. Please login.'
      }, { status: 400 })
    }

    // Generate referral code
    const referralCode = `H2E-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Calculate area code from coordinates (simplified)
    let areaCode = 'AREA-001'
    if (lat && lng) {
      areaCode = `AREA-${Math.floor(lat * 10)}-${Math.floor(lng * 10)}`
    }

    // Store password in badges field as JSON (temporary solution)
    // In production, add a dedicated password field with bcrypt
    const badges = JSON.stringify({ 
      pwd: password, // In production: bcrypt.hash(password, 10)
      createdAt: new Date().toISOString()
    })

    // Create user
    const user = await db.user.create({
      data: {
        phone,
        name: name.trim(),
        referralCode,
        badges,
        lat: lat || null,
        lng: lng || null,
        areaCode,
        trustScore: 50, // Default trust score
        registeredIP: request.headers.get('x-forwarded-for') || 'unknown',
        lastLoginIP: request.headers.get('x-forwarded-for') || 'unknown'
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
      message: 'Account created successfully!'
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
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration failed. Please try again.'
    }, { status: 500 })
  }
}
