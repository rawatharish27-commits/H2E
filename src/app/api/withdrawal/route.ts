import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Withdrawal Configuration
const WITHDRAWAL_CONFIG = {
  MIN_AMOUNT: 200,          // ₹200 minimum
  MAX_AMOUNT: 10000,        // ₹10,000 maximum per request
  PROCESSING_DAYS: 3,       // Processing time in days
}

// GET - Get withdrawal history and balance
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'balance'

    if (action === 'balance') {
      // Get withdrawable balance
      const withdrawableReferrals = await db.referral.findMany({
        where: {
          referrerId: user.id,
          status: 'REWARDED',
          isWithdrawable: true,
          withdrawnAt: null
        }
      })

      const withdrawableAmount = withdrawableReferrals.reduce((sum, r) => sum + r.rewardAmount, 0)

      // Get pending withdrawals
      const pendingWithdrawals = await db.withdrawalRequest.findMany({
        where: {
          userId: user.id,
          status: { in: ['PENDING', 'APPROVED'] }
        }
      })

      const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0)

      return NextResponse.json({
        success: true,
        balance: {
          totalEarnings: user.referralEarnings || 0,
          pendingEarnings: user.pendingEarnings || 0,
          withdrawableAmount,
          pendingWithdrawals: pendingAmount,
          withdrawnAmount: user.withdrawnEarnings || 0,
          canWithdraw: withdrawableAmount >= WITHDRAWAL_CONFIG.MIN_AMOUNT,
          minAmount: WITHDRAWAL_CONFIG.MIN_AMOUNT,
          maxAmount: WITHDRAWAL_CONFIG.MAX_AMOUNT
        }
      })
    }

    if (action === 'history') {
      const withdrawals = await db.withdrawalRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return NextResponse.json({
        success: true,
        withdrawals: withdrawals.map(w => ({
          id: w.id,
          amount: w.amount,
          status: w.status,
          upiId: w.upiId,
          transactionRef: w.transactionRef,
          rejectionReason: w.rejectionReason,
          createdAt: w.createdAt,
          approvedAt: w.approvedAt
        }))
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Withdrawal GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create withdrawal request
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, upiId } = body

    // Validation
    if (!amount || amount < WITHDRAWAL_CONFIG.MIN_AMOUNT) {
      return NextResponse.json({ 
        error: `Minimum withdrawal amount is ₹${WITHDRAWAL_CONFIG.MIN_AMOUNT}` 
      }, { status: 400 })
    }

    if (amount > WITHDRAWAL_CONFIG.MAX_AMOUNT) {
      return NextResponse.json({ 
        error: `Maximum withdrawal amount is ₹${WITHDRAWAL_CONFIG.MAX_AMOUNT}` 
      }, { status: 400 })
    }

    if (!upiId || !upiId.includes('@')) {
      return NextResponse.json({ 
        error: 'Valid UPI ID required' 
      }, { status: 400 })
    }

    // Check withdrawable balance
    const withdrawableReferrals = await db.referral.findMany({
      where: {
        referrerId: user.id,
        status: 'REWARDED',
        isWithdrawable: true,
        withdrawnAt: null
      }
    })

    const withdrawableAmount = withdrawableReferrals.reduce((sum, r) => sum + r.rewardAmount, 0)

    if (amount > withdrawableAmount) {
      return NextResponse.json({ 
        error: `Insufficient withdrawable balance. Available: ₹${withdrawableAmount}` 
      }, { status: 400 })
    }

    // Check for pending withdrawals
    const pendingCount = await db.withdrawalRequest.count({
      where: {
        userId: user.id,
        status: 'PENDING'
      }
    })

    if (pendingCount > 0) {
      return NextResponse.json({ 
        error: 'You have a pending withdrawal request. Please wait for it to be processed.' 
      }, { status: 400 })
    }

    // Create withdrawal request
    const withdrawal = await db.withdrawalRequest.create({
      data: {
        userId: user.id,
        amount,
        upiId,
        status: 'PENDING'
      }
    })

    // Mark referrals as withdrawn (provisionally)
    let remainingAmount = amount
    for (const referral of withdrawableReferrals) {
      if (remainingAmount <= 0) break
      
      if (referral.rewardAmount <= remainingAmount) {
        await db.referral.update({
          where: { id: referral.id },
          data: { withdrawnAt: new Date() }
        })
        remainingAmount -= referral.rewardAmount
      }
    }

    // Create notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: '💰 Withdrawal Requested',
        message: `Your withdrawal request of ₹${amount} has been submitted. It will be processed within ${WITHDRAWAL_CONFIG.PROCESSING_DAYS} business days.`
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: withdrawal.id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        upiId: withdrawal.upiId,
        createdAt: withdrawal.createdAt
      },
      processingDays: WITHDRAWAL_CONFIG.PROCESSING_DAYS
    })
  } catch (error) {
    console.error('Withdrawal POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
