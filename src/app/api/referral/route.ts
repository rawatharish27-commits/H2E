import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, generateTempReferralCode, generateReferralCode } from '@/lib/auth'

// Get referral stats and code
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const userId = await verifyToken(token)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        referralCount: true,
        referralRewards: true,
        name: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Generate permanent code if not exists
    let referralCode = user.referralCode
    if (!referralCode) {
      referralCode = generateReferralCode(user.name || undefined)
      await db.user.update({
        where: { id: userId },
        data: { referralCode }
      })
    }
    
    // Get referred users
    const referrals = await db.referral.findMany({
      where: { referrerId: userId },
      include: {
        referredUser: {
          select: {
            name: true,
            phone: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    // Calculate next reward tier
    const nextTier = getNextRewardTier(user.referralCount)
    
    return NextResponse.json({
      success: true,
      referral: {
        code: referralCode,
        count: user.referralCount,
        rewards: user.referralRewards,
        referrals: referrals.map(r => ({
          id: r.id,
          name: r.referredUser.name,
          phone: r.referredUser.phone.replace(/.(?=.{4})/g, '*'),
          status: r.status,
          createdAt: r.createdAt
        })),
        nextTier
      }
    })
  } catch (error) {
    console.error('Get referral error:', error)
    return NextResponse.json(
      { error: 'Failed to get referral info' },
      { status: 500 }
    )
  }
}

// Generate temp referral code (pre-login)
export async function POST(request: NextRequest) {
  try {
    const tempCode = generateTempReferralCode()
    
    return NextResponse.json({
      success: true,
      tempCode,
      shareMessage: `Help2Earn ek app hai jahan madad karke kamaai hoti hai.
Apne area ke log jud rahe hain.
Join karo - Code: ${tempCode}
Download: https://help2earn.app`
    })
  } catch (error) {
    console.error('Generate temp referral error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    )
  }
}

// Helper to get next reward tier
function getNextRewardTier(currentCount: number): { target: number; reward: string; badge?: string } {
  if (currentCount < 5) {
    return { target: 5, reward: '+7 days free subscription', badge: 'Active Sharer' }
  } else if (currentCount < 10) {
    return { target: 10, reward: '+30 days subscription', badge: 'Super Sharer' }
  } else if (currentCount < 25) {
    return { target: 25, reward: 'Area Connector badge + Priority access', badge: 'Area Connector' }
  } else if (currentCount < 50) {
    return { target: 50, reward: '3 months free + Featured helper', badge: 'Community Builder' }
  } else if (currentCount < 100) {
    return { target: 100, reward: 'Lifetime discounted access', badge: 'Community Leader' }
  }
  return { target: currentCount + 10, reward: 'Continue sharing for more rewards!' }
}
