import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Referral Reward Configuration
const REFERRAL_CONFIG = {
  REWARD_AMOUNT: 5,           // ₹5 per active referral
  REWARD_UNLOCK_HOURS: 48,    // 48 hours after first task
  MIN_WITHDRAWAL: 200         // ₹200 minimum withdrawal
}

// GET - Get user's referral earnings
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'

    if (action === 'stats') {
      // Get referral stats
      const referrals = await db.referral.findMany({
        where: { referrerId: user.id },
        include: {
          referredUser: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              helpfulCount: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const totalReferrals = referrals.length
      const activeReferrals = referrals.filter(r => r.firstTaskCompleted).length
      const pendingReferrals = referrals.filter(r => !r.firstTaskCompleted).length
      
      const totalEarnings = referrals
        .filter(r => r.status === 'REWARDED')
        .reduce((sum, r) => sum + r.rewardAmount, 0)

      const pendingEarnings = referrals
        .filter(r => r.status === 'FIRST_TASK' || (r.status === 'REWARDED' && !r.isWithdrawable))
        .reduce((sum, r) => sum + r.rewardAmount, 0)

      const canWithdraw = (user.referralEarnings || 0) >= REFERRAL_CONFIG.MIN_WITHDRAWAL

      return NextResponse.json({
        success: true,
        stats: {
          totalReferrals,
          activeReferrals,
          pendingReferrals,
          referralCode: user.referralCode,
          referralEarnings: user.referralEarnings || 0,
          pendingEarnings,
          withdrawnEarnings: user.withdrawnEarnings || 0,
          canWithdraw,
          minWithdrawal: REFERRAL_CONFIG.MIN_WITHDRAWAL
        },
        referrals: referrals.map(r => ({
          id: r.id,
          referredUser: r.referredUser,
          status: r.status,
          firstTaskCompleted: r.firstTaskCompleted,
          firstTaskAt: r.firstTaskAt,
          rewardAmount: r.rewardAmount,
          rewardUnlockAt: r.rewardUnlockAt,
          isWithdrawable: r.isWithdrawable,
          createdAt: r.createdAt
        }))
      })
    }

    if (action === 'available') {
      // Get available rewards ready to claim
      const availableRewards = await db.referral.findMany({
        where: {
          referrerId: user.id,
          status: 'REWARDED',
          isWithdrawable: false,
          rewardUnlockAt: { lte: new Date() }
        }
      })

      const availableAmount = availableRewards.reduce((sum, r) => sum + r.rewardAmount, 0)

      return NextResponse.json({
        success: true,
        availableRewards: availableRewards.length,
        availableAmount
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Referral stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Process referral reward (called when user completes first task)
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, referredUserId, helperId } = body

    if (action === 'task-completed') {
      // This is called when a user completes their first task
      // Check if this user was referred by someone
      const referral = await db.referral.findFirst({
        where: {
          referredUserId: user.id,
          status: { in: ['PENDING', 'VERIFIED'] }
        },
        include: { referrer: true }
      })

      if (!referral) {
        return NextResponse.json({ 
          success: true, 
          message: 'No referral found for this user' 
        })
      }

      // Check if this is the first task
      const previousTasks = await db.problem.count({
        where: {
          postedById: user.id,
          status: 'CLOSED'
        }
      })

      // Also check as helper
      const previousHelps = await db.feedback.count({
        where: { toUserId: user.id }
      })

      const isFirstTask = previousTasks === 0 && previousHelps === 0

      if (!isFirstTask) {
        return NextResponse.json({ 
          success: true, 
          message: 'Not first task, no referral reward' 
        })
      }

      // Calculate unlock time (48 hours from now)
      const unlockTime = new Date(Date.now() + REFERRAL_CONFIG.REWARD_UNLOCK_HOURS * 60 * 60 * 1000)

      // Update referral status
      await db.referral.update({
        where: { id: referral.id },
        data: {
          status: 'FIRST_TASK',
          firstTaskCompleted: true,
          firstTaskAt: new Date(),
          rewardUnlockAt: unlockTime
        }
      })

      // Schedule reward (in real production, this would be a cron job)
      // For now, we'll create a pending reward
      await db.referral.update({
        where: { id: referral.id },
        data: {
          status: 'REWARDED'
        }
      })

      // Update referrer's referral count
      await db.user.update({
        where: { id: referral.referrerId },
        data: {
          activeReferrals: { increment: 1 },
          referralEarnings: { increment: REFERRAL_CONFIG.REWARD_AMOUNT },
          pendingEarnings: { increment: REFERRAL_CONFIG.REWARD_AMOUNT }
        }
      })

      // Create notification for referrer
      await db.notification.create({
        data: {
          userId: referral.referrerId,
          type: 'REFERRAL',
          title: '🎉 Referral Reward Unlocked!',
          message: `${user.name || 'A user'} completed their first task! You earned ₹${REFERRAL_CONFIG.REWARD_AMOUNT}. Available for withdrawal in 48 hours.`,
          data: JSON.stringify({
            referralId: referral.id,
            rewardAmount: REFERRAL_CONFIG.REWARD_AMOUNT,
            unlockAt: unlockTime.toISOString()
          })
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Referral reward processed',
        reward: {
          amount: REFERRAL_CONFIG.REWARD_AMOUNT,
          unlockAt: unlockTime,
          referrerName: referral.referrer.name
        }
      })
    }

    if (action === 'claim-rewards') {
      // Claim all available rewards
      const availableRewards = await db.referral.findMany({
        where: {
          referrerId: user.id,
          status: 'REWARDED',
          isWithdrawable: false,
          rewardUnlockAt: { lte: new Date() }
        }
      })

      if (availableRewards.length === 0) {
        return NextResponse.json({ 
          error: 'No rewards available to claim' 
        }, { status: 400 })
      }

      const totalAmount = availableRewards.reduce((sum, r) => sum + r.rewardAmount, 0)

      // Mark as withdrawable
      await db.referral.updateMany({
        where: {
          id: { in: availableRewards.map(r => r.id) }
        },
        data: {
          isWithdrawable: true
        }
      })

      // Update user's pending earnings
      await db.user.update({
        where: { id: user.id },
        data: {
          pendingEarnings: { decrement: totalAmount }
        }
      })

      return NextResponse.json({
        success: true,
        message: `₹${totalAmount} claimed successfully`,
        claimedAmount: totalAmount,
        rewardsCount: availableRewards.length
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Referral reward error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
