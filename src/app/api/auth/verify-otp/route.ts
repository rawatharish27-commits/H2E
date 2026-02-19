import { NextRequest, NextResponse } from 'next/server'
import { db, withRetry } from '@/lib/db'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { validateInput, verifyOtpRequestSchema, sanitizePhone } from '@/lib/validation'
import { createSession, generateReferralCode } from '@/lib/auth'

// Verify OTP and Login/Register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = validateInput(verifyOtpRequestSchema, {
      phone: sanitizePhone(body.phone || ''),
      otp: body.otp || ''
    })
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    const { phone, otp } = validation.data
    const name = body.name as string | undefined
    const referralCode = body.referralCode as string | undefined // Code user entered (someone referred them)
    const tempReferralCode = body.tempReferralCode as string | undefined // User's temp code to convert
    
    // Get client info
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || undefined
    
    // Check rate limit with retry
    const rateLimit = await withRetry(() => checkRateLimit(phone, 'VERIFY_OTP'))
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many failed attempts. Please wait before trying again.',
          resetAt: rateLimit.resetAt 
        },
        { status: 429 }
      )
    }
    
    // Find valid OTP with retry
    const otpRecord = await withRetry(() => db.otpVerification.findFirst({
      where: {
        phone,
        verified: false,
        expiresAt: { gte: new Date() }
      }
    }))
    
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }
    
    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      // Increment attempts with retry
      await withRetry(() => db.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } }
      }))
      
      const remaining = 3 - (otpRecord.attempts + 1)
      
      if (remaining <= 0) {
        // Delete OTP after max attempts with retry
        await withRetry(() => db.otpVerification.delete({ where: { id: otpRecord.id } }))
        return NextResponse.json(
          { error: 'Maximum attempts exceeded. Please request a new OTP.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: `Invalid OTP. ${remaining} attempts remaining.` },
        { status: 400 }
      )
    }
    
    // Mark OTP as verified with retry
    await withRetry(() => db.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    }))
    
    // Find or create user
    let user = await withRetry(() => db.user.findUnique({
      where: { phone }
    }))
    
    let isNewUser = false
    
    if (!user) {
      isNewUser = true
      
      // Generate permanent referral code for new user
      // If they had a temp code, use similar format, otherwise generate new
      let userReferralCode = tempReferralCode || generateReferralCode()
      
      // If temp code was TEMP-XXXX, convert to H2E-XXXX
      if (userReferralCode.startsWith('TEMP-')) {
        userReferralCode = userReferralCode.replace('TEMP-', 'H2E-')
      }
      
      // Ensure uniqueness
      const existingCode = await withRetry(() => db.user.findUnique({
        where: { referralCode: userReferralCode }
      }))
      
      if (existingCode) {
        userReferralCode = generateReferralCode()
      }
      
      // Create new user
      user = await withRetry(() => db.user.create({
        data: {
          phone,
          name: name?.trim() || null,
          trustScore: 50, // Start with neutral trust score
          paymentActive: false,
          referralCode: userReferralCode,
          lastActiveAt: new Date()
        }
      }))
      
      // Handle referral if provided (someone referred this user)
      if (referralCode && referralCode.startsWith('H2E-')) {
        const referrer = await withRetry(() => db.user.findUnique({
          where: { referralCode: referralCode }
        }))
        
        if (referrer && referrer.id !== user.id) {
          // Create referral record
          await withRetry(() => db.referral.create({
            data: {
              referrerId: referrer.id,
              referredUserId: user!.id,
              code: referralCode,
              status: 'VERIFIED',
              verifiedAt: new Date()
            }
          }))
          
          // Update referrer count
          await withRetry(() => db.user.update({
            where: { id: referrer.id },
            data: {
              referralCount: { increment: 1 },
              referralRewards: { increment: 7 } // +7 days per referral
            }
          }))
        }
      }
    } else {
      // Existing user - update name if provided
      if (name?.trim() && !user.name) {
        await withRetry(() => db.user.update({
          where: { id: user!.id },
          data: { name: name.trim() }
        }))
        user = { ...user, name: name.trim() }
      }
    }
    
    // Check if user is banned
    if (user.isBanned) {
      return NextResponse.json(
        { error: 'Account has been permanently banned' },
        { status: 403 }
      )
    }
    
    if (user.isBlocked) {
      return NextResponse.json(
        { error: 'Account is temporarily restricted. Please contact support.' },
        { status: 403 }
      )
    }
    
    // Create session
    const token = await createSession(
      user.id,
      userAgent,
      clientIp
    )
    
    // Update last active with retry
    await withRetry(() => db.user.update({
      where: { id: user!.id },
      data: { lastActiveAt: new Date() }
    }))
    
    // Create response
    const response = NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        paymentActive: user.paymentActive,
        activeTill: user.activeTill,
        trustScore: user.trustScore,
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        referralRewards: user.referralRewards,
        noShowCount: user.noShowCount,
        reportCount: user.reportCount,
        isBlocked: user.isBlocked,
        isBanned: user.isBanned,
        darkMode: user.darkMode,
        language: user.language,
        createdAt: user.createdAt,
      },
      token
    })
    
    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}
