/**
 * Referral Auto-Reward Service
 * Handles referral verification, rewards, and subscription extensions
 *
 * Reward Structure:
 * - ₹5 per active referral (after they complete first task)
 * - 48-hour hold period before withdrawal
 * - Minimum withdrawal: ₹200
 */

import { db } from '@/lib/db'
import { notifyReferralReward } from '@/lib/notifications'

// Configuration
const REFERRAL_REWARD_AMOUNT = 5 // ₹5 per active referral
const REWARD_UNLOCK_HOURS = 48 // Hours after first task before reward unlocks
const MIN_WITHDRAWAL_AMOUNT = 200 // ₹200 minimum withdrawal

export interface ReferralRewardResult {
  success: boolean
  rewardAmount?: number
  error?: string
  status: 'PENDING' | 'VERIFIED' | 'FIRST_TASK' | 'REWARDED'
}

/**
 * Process referral when a new user registers with a referral code
 */
export async function processReferralOnRegistration(
  newUserId: string,
  referralCode: string
): Promise<{ success: boolean; referrerId?: string; error?: string }> {
  try {
    // Find referrer by code
    const referrer = await db.user.findFirst({
      where: {
        referralCode,
        isBanned: false,
        isBlocked: false
      }
    })

    if (!referrer) {
      return { success: false, error: 'Invalid referral code' }
    }

    // Prevent self-referral
    if (referrer.id === newUserId) {
      return { success: false, error: 'Cannot refer yourself' }
    }

    // Check if user was already referred
    const existingReferral = await db.referral.findUnique({
      where: { referredUserId: newUserId }
    })

    if (existingReferral) {
      return { success: false, error: 'User already referred' }
    }

    // Create referral record
    await db.referral.create({
      data: {
        referrerId: referrer.id,
        referredUserId: newUserId,
        code: referralCode,
        status: 'VERIFIED',
        rewardAmount: REFERRAL_REWARD_AMOUNT
      }
    })

    // Update referrer's referral count
    await db.user.update({
      where: { id: referrer.id },
      data: {
        referralCount: { increment: 1 }
      }
    })

    console.log(`[Referral] New referral: ${referrer.id} -> ${newUserId}`)

    return { success: true, referrerId: referrer.id }
  } catch (error) {
    console.error('[Referral] Process error:', error)
    return { success: false, error: 'Failed to process referral' }
  }
}

/**
 * Process referral reward when referred user completes first task
 * This should be called when a problem/help is marked as completed
 */
export async function processReferralOnFirstTask(
  userId: string
): Promise<ReferralRewardResult> {
  try {
    // Find referral where this user was referred
    const referral = await db.referral.findUnique({
      where: { referredUserId: userId },
      include: {
        referrer: {
          select: { id: true, name: true }
        }
      }
    })

    if (!referral) {
      return { success: false, status: 'PENDING', error: 'No referral found' }
    }

    // Already processed
    if (referral.firstTaskCompleted) {
      return {
        success: true,
        status: referral.status as 'FIRST_TASK' | 'REWARDED',
        rewardAmount: referral.rewardAmount
      }
    }

    // Mark first task as completed
    const rewardUnlockAt = new Date(Date.now() + REWARD_UNLOCK_HOURS * 60 * 60 * 1000)

    await db.referral.update({
      where: { id: referral.id },
      data: {
        firstTaskCompleted: true,
        firstTaskAt: new Date(),
        status: 'FIRST_TASK',
        rewardUnlockAt
      }
    })

    // Update referrer's active referral count
    await db.user.update({
      where: { id: referral.referrerId },
      data: {
        activeReferrals: { increment: 1 }
      }
    })

    console.log(`[Referral] First task completed by referred user: ${userId}`)

    return {
      success: true,
      status: 'FIRST_TASK',
      rewardAmount: REFERRAL_REWARD_AMOUNT
    }
  } catch (error) {
    console.error('[Referral] First task processing error:', error)
    return { success: false, status: 'PENDING', error: 'Processing failed' }
  }
}

/**
 * Unlock referral rewards after 48-hour hold period
 * This should be called by a cron job
 */
export async function unlockPendingRewards(): Promise<{
  processed: number
  totalAmount: number
}> {
  const now = new Date()
  let processed = 0
  let totalAmount = 0

  // Find referrals ready to be rewarded
  const pendingReferrals = await db.referral.findMany({
    where: {
      firstTaskCompleted: true,
      status: 'FIRST_TASK',
      rewardUnlockAt: { lte: now },
      isWithdrawable: false
    },
    include: {
      referrer: { select: { id: true, name: true } },
      referredUser: { select: { id: true, name: true } }
    }
  })

  for (const referral of pendingReferrals) {
    try {
      // Update referral status
      await db.referral.update({
        where: { id: referral.id },
        data: {
          status: 'REWARDED',
          isWithdrawable: true
        }
      })

      // Add to referrer's pending earnings
      await db.user.update({
        where: { id: referral.referrerId },
        data: {
          pendingEarnings: { increment: referral.rewardAmount },
          referralEarnings: { increment: referral.rewardAmount }
        }
      })

      // Check if user can now withdraw
      const referrer = await db.user.findUnique({
        where: { id: referral.referrerId },
        select: { pendingEarnings: true }
      })

      if (referrer && referrer.pendingEarnings >= MIN_WITHDRAWAL_AMOUNT) {
        await db.user.update({
          where: { id: referral.referrerId },
          data: { canWithdraw: true }
        })
      }

      // Send notification
      await notifyReferralReward(
        referral.referrerId,
        referral.rewardAmount,
        referral.referredUser.name || 'Someone'
      )

      processed++
      totalAmount += referral.rewardAmount

      console.log(`[Referral] Reward unlocked: ₹${referral.rewardAmount} for ${referral.referrerId}`)
    } catch (error) {
      console.error(`[Referral] Failed to unlock reward ${referral.id}:`, error)
    }
  }

  return { processed, totalAmount }
}

/**
 * Check if user can withdraw their earnings
 */
export async function checkWithdrawalEligibility(userId: string): Promise<{
  eligible: boolean
  pendingEarnings: number
  withdrawnEarnings: number
  totalEarnings: number
  minWithdrawal: number
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      pendingEarnings: true,
      withdrawnEarnings: true,
      referralEarnings: true,
      canWithdraw: true
    }
  })

  if (!user) {
    return {
      eligible: false,
      pendingEarnings: 0,
      withdrawnEarnings: 0,
      totalEarnings: 0,
      minWithdrawal: MIN_WITHDRAWAL_AMOUNT
    }
  }

  return {
    eligible: user.canWithdraw && user.pendingEarnings >= MIN_WITHDRAWAL_AMOUNT,
    pendingEarnings: user.pendingEarnings,
    withdrawnEarnings: user.withdrawnEarnings,
    totalEarnings: user.referralEarnings,
    minWithdrawal: MIN_WITHDRAWAL_AMOUNT
  }
}

/**
 * Get referral stats for a user
 */
export async function getReferralStats(userId: string) {
  const [user, referrals, rewardedCount] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        referralCount: true,
        activeReferrals: true,
        referralEarnings: true,
        pendingEarnings: true,
        withdrawnEarnings: true,
        canWithdraw: true
      }
    }),
    db.referral.findMany({
      where: { referrerId: userId },
      select: {
        status: true,
        firstTaskCompleted: true,
        rewardAmount: true,
        createdAt: true,
        referredUser: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    }),
    db.referral.count({
      where: {
        referrerId: userId,
        status: 'REWARDED'
      }
    })
  ])

  return {
    code: user?.referralCode,
    totalReferrals: user?.referralCount || 0,
    activeReferrals: user?.activeReferrals || 0,
    rewardedReferrals: rewardedCount,
    totalEarnings: user?.referralEarnings || 0,
    pendingEarnings: user?.pendingEarnings || 0,
    withdrawnEarnings: user?.withdrawnEarnings || 0,
    canWithdraw: user?.canWithdraw || false,
    minWithdrawal: MIN_WITHDRAWAL_AMOUNT,
    referrals: referrals.map(r => ({
      name: r.referredUser.name || 'Anonymous',
      status: r.status,
      firstTaskCompleted: r.firstTaskCompleted,
      rewardAmount: r.rewardAmount,
      createdAt: r.createdAt
    }))
  }
}

/**
 * Get referral leaderboard
 */
export async function getReferralLeaderboard(limit: number = 10) {
  return db.user.findMany({
    where: {
      referralCount: { gt: 0 }
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      referralCount: true,
      activeReferrals: true,
      referralEarnings: true
    },
    orderBy: [
      { activeReferrals: 'desc' },
      { referralCount: 'desc' }
    ],
    take: limit
  })
}
