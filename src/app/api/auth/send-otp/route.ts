import { NextRequest, NextResponse } from 'next/server'
import { db, withRetry } from '@/lib/db'
import { randomInt } from 'crypto'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { validateInput, sendOtpRequestSchema, sanitizePhone } from '@/lib/validation'
import { sendOtpSms, isTwilioConfigured } from '@/lib/sms/twilio'

// Send OTP - Production Secure with Twilio SMS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = validateInput(sendOtpRequestSchema, {
      phone: sanitizePhone(body.phone || '')
    })
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    const { phone } = validation.data
    
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit (by phone and IP) with retry
    const [phoneLimit, ipLimit] = await withRetry(() => Promise.all([
      checkRateLimit(phone, 'SEND_OTP'),
      checkRateLimit(clientIp, 'SEND_OTP')
    ]))
    
    if (!phoneLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many OTP requests. Please wait before requesting again.',
          resetAt: phoneLimit.resetAt 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': phoneLimit.remaining.toString(),
            'X-RateLimit-Reset': phoneLimit.resetAt.toISOString()
          }
        }
      )
    }
    
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests from this IP. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Check if user exists and is blocked/banned with retry
    const existingUser = await withRetry(() => db.user.findUnique({
      where: { phone },
      select: { isBlocked: true, isBanned: true }
    }))
    
    if (existingUser?.isBanned) {
      return NextResponse.json(
        { error: 'This number has been permanently banned' },
        { status: 403 }
      )
    }
    
    if (existingUser?.isBlocked) {
      return NextResponse.json(
        { error: 'This account is temporarily restricted. Please contact support.' },
        { status: 403 }
      )
    }
    
    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    
    // Delete existing OTPs and create new one with retry
    await withRetry(async () => {
      await db.otpVerification.deleteMany({
        where: { phone }
      })
      
      await db.otpVerification.create({
        data: {
          phone,
          otp,
          expiresAt,
        }
      })
    })
    
    // Send OTP via SMS (Twilio)
    const smsResult = await sendOtpSms(phone, otp)
    
    // Log for development
    console.log(`[OTP] Phone: ${phone}, OTP: ${otp}, Twilio: ${isTwilioConfigured() ? 'configured' : 'NOT configured'}`)
    
    if (!smsResult.success) {
      console.error('[OTP] SMS failed:', smsResult.error)
      
      // In development, still return success with OTP for testing
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: 'OTP sent successfully (dev mode - check console)',
          expiresIn: 300,
          devOtp: otp // Only in development
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to send OTP. Please check your phone number and try again.' },
        { status: 500 }
      )
    }
    
    // Security: NEVER return OTP in response in production
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your mobile number',
      expiresIn: 300, // seconds
      messageId: smsResult.messageId
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    
    // Check for specific Prisma errors
    if (error instanceof Error) {
      // Log for debugging but don't expose to user
      if (error.message.includes('prepared statement')) {
        console.error('[OTP] Database connection issue - prepared statement error')
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check Twilio status (for debugging)
export async function GET() {
  return NextResponse.json({
    twilioConfigured: isTwilioConfigured(),
    message: isTwilioConfigured() 
      ? 'Twilio is configured. OTP will be sent via SMS.'
      : 'Twilio is NOT configured. OTP will be logged to console only.'
  })
}
