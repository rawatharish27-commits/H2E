import { NextRequest, NextResponse } from 'next/server'
import { db, withRetry } from '@/lib/db'

// Verify referral code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const code = (body.code || '').trim().toUpperCase()
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Referral code is required / रेफरल कोड आवश्यक है' },
        { status: 400 }
      )
    }
    
    // Check code format
    if (!code.startsWith('H2E-') && !code.startsWith('TEMP-')) {
      return NextResponse.json(
        { success: false, error: 'Invalid code format. Code should start with H2E- / अमान्य कोड प्रारूप' },
        { status: 400 }
      )
    }
    
    if (code.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Invalid referral code / अमान्य रेफरल कोड' },
        { status: 400 }
      )
    }
    
    // TEMP- codes are pre-login codes (for new users who haven't registered yet)
    if (code.startsWith('TEMP-')) {
      // TEMP codes are valid for new users
      // They will be properly linked after registration
      return NextResponse.json({
        success: true,
        message: 'Valid temporary referral code',
        code,
        type: 'TEMP'
      })
    }
    
    // H2E- codes must exist in database
    const referrer = await withRetry(() => db.user.findFirst({
      where: { referralCode: code },
      select: {
        id: true,
        name: true,
        referralCount: true,
        isBlocked: true,
        isBanned: true
      }
    }))
    
    if (!referrer) {
      return NextResponse.json(
        { success: false, error: 'Invalid referral code. No user found with this code. / अमान्य रेफरल कोड। इस कोड वाला कोई यूज़र नहीं मिला।' },
        { status: 400 }
      )
    }
    
    // Check if referrer is blocked or banned
    if (referrer.isBanned) {
      return NextResponse.json(
        { success: false, error: 'This referral code is no longer valid. / यह रेफरल कोड अब मान्य नहीं है।' },
        { status: 400 }
      )
    }
    
    if (referrer.isBlocked) {
      return NextResponse.json(
        { success: false, error: 'This referral code is temporarily unavailable. / यह रेफरल कोड अस्थायी रूप से अनुपलब्ध है।' },
        { status: 400 }
      )
    }
    
    // Valid referral code
    return NextResponse.json({
      success: true,
      message: 'Valid referral code',
      code,
      type: 'H2E',
      referrer: {
        name: referrer.name?.split(' ')[0] || 'Helper',
        referralCount: referrer.referralCount
      }
    })
    
  } catch (error) {
    console.error('Verify referral error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify referral code. Please try again. / रेफरल कोड सत्यापित करने में विफल।' },
      { status: 500 }
    )
  }
}
