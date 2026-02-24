import { NextRequest, NextResponse } from 'next/server'
import { db, withRetry } from '@/lib/db'

// Get pending payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('adminKey')

    if (adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payments = await withRetry(() => db.payment.findMany({
      where: { 
        status: { in: ['PENDING', 'APPROVED', 'REJECTED'] }
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
            trustScore: true,
            paymentActive: true,
            activeTill: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    }))

    return NextResponse.json({
      success: true,
      payments
    })
  } catch (error) {
    console.error('Admin payments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// Approve/Reject payment - Auto-activates user immediately
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, action, adminKey, adminId } = body

    if (adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'Payment ID and action required' },
        { status: 400 }
      )
    }

    const payment = await withRetry(() => db.payment.findUnique({
      where: { id: paymentId },
      include: { user: true }
    }))

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      // Calculate active till (30 days from now)
      const activeTill = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      // Update payment and user in transaction with retry
      const result = await withRetry(() => db.$transaction([
        db.payment.update({
          where: { id: paymentId },
          data: {
            status: 'APPROVED',
            approvedBy: adminId,
            approvedAt: new Date()
          }
        }),
        db.user.update({
          where: { id: payment.userId },
          data: {
            paymentActive: true,
            activeTill,
            subscriptionType: 'PREMIUM'
          }
        })
      ]))

      // Log action
      await withRetry(() => db.adminLog.create({
        data: {
          adminId: adminId || 'admin',
          action: 'PAYMENT_APPROVED',
          targetType: 'PAYMENT',
          targetId: paymentId,
          details: `Approved payment for user ${payment.user.phone}`
        }
      }))

      return NextResponse.json({
        success: true,
        message: 'Payment approved! User account activated immediately.',
        user: {
          id: payment.userId,
          paymentActive: true,
          activeTill: activeTill.toISOString()
        }
      })

    } else if (action === 'reject') {
      await withRetry(() => db.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REJECTED',
          rejectionReason: 'Rejected by admin',
          approvedBy: adminId,
          approvedAt: new Date()
        }
      }))

      await withRetry(() => db.adminLog.create({
        data: {
          adminId: adminId || 'admin',
          action: 'PAYMENT_REJECTED',
          targetType: 'PAYMENT',
          targetId: paymentId,
          details: `Rejected payment for user ${payment.user.phone}`
        }
      }))

      return NextResponse.json({
        success: true,
        message: 'Payment rejected'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Admin payment action error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
