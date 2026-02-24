import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Escrow Configuration
const ESCROW_CONFIG = {
  LOCK_DURATION_HOURS: 24,    // Auto-release after 24 hours
  DISPUTE_WINDOW_HOURS: 48,   // Time to raise dispute
  AUTO_RELEASE_HOURS: 72      // Auto-release if no action
}

// GET - Get escrow status for a problem
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')

    if (!problemId) {
      return NextResponse.json({ error: 'Problem ID required' }, { status: 400 })
    }

    const escrow = await db.escrowTransaction.findFirst({
      where: { problemId },
      include: {
        problem: {
          select: { title: true, status: true }
        }
      }
    })

    if (!escrow) {
      return NextResponse.json({
        success: true,
        escrow: null,
        message: 'No escrow for this problem'
      })
    }

    // Check if user is involved
    const isClient = escrow.clientId === user.id
    const isHelper = escrow.helperId === user.id
    const isAdmin = user.statusBadge === 'LEADER'

    if (!isClient && !isHelper && !isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      escrow: {
        id: escrow.id,
        problemId: escrow.problemId,
        problem: escrow.problem,
        amount: escrow.amount,
        status: escrow.status,
        lockedAt: escrow.lockedAt,
        lockExpiryAt: escrow.lockExpiryAt,
        releasedAt: escrow.releasedAt,
        isClient,
        isHelper,
        timeRemaining: escrow.lockExpiryAt 
          ? Math.max(0, Math.floor((new Date(escrow.lockExpiryAt).getTime() - Date.now()) / 1000 / 60))
          : null
      }
    })
  } catch (error) {
    console.error('Escrow GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create/Update escrow
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, problemId, helperId, amount } = body

    if (action === 'lock') {
      // Client locks payment when helper accepts
      if (!problemId || !helperId || !amount) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Check if problem exists and user is the client
      const problem = await db.problem.findUnique({
        where: { id: problemId }
      })

      if (!problem) {
        return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
      }

      if (problem.postedById !== user.id) {
        return NextResponse.json({ error: 'Only task poster can lock payment' }, { status: 403 })
      }

      // Check for existing escrow
      const existingEscrow = await db.escrowTransaction.findFirst({
        where: { problemId }
      })

      if (existingEscrow) {
        return NextResponse.json({ error: 'Escrow already exists' }, { status: 400 })
      }

      // Create escrow
      const lockExpiryAt = new Date(Date.now() + ESCROW_CONFIG.LOCK_DURATION_HOURS * 60 * 60 * 1000)

      const escrow = await db.escrowTransaction.create({
        data: {
          problemId,
          clientId: user.id,
          helperId,
          amount,
          lockExpiryAt
        }
      })

      // Update problem status
      await db.problem.update({
        where: { id: problemId },
        data: {
          status: 'IN_PROGRESS',
          acceptedById: helperId,
          acceptedAt: new Date()
        }
      })

      // Notify helper
      await db.notification.create({
        data: {
          userId: helperId,
          type: 'HELP',
          title: '💰 Payment Locked',
          message: `₹${amount} has been locked in escrow for "${problem.title}". Complete the task to receive payment.`
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Payment locked in escrow',
        escrow: {
          id: escrow.id,
          amount: escrow.amount,
          lockExpiryAt: escrow.lockExpiryAt
        }
      })
    }

    if (action === 'release') {
      // Client releases payment after task completion
      if (!problemId) {
        return NextResponse.json({ error: 'Problem ID required' }, { status: 400 })
      }

      const escrow = await db.escrowTransaction.findFirst({
        where: { problemId, status: 'LOCKED' }
      })

      if (!escrow) {
        return NextResponse.json({ error: 'No locked escrow found' }, { status: 404 })
      }

      if (escrow.clientId !== user.id) {
        return NextResponse.json({ error: 'Only task poster can release payment' }, { status: 403 })
      }

      // Release escrow
      await db.escrowTransaction.update({
        where: { id: escrow.id },
        data: {
          status: 'RELEASED',
          releasedAt: new Date(),
          releasedBy: user.id
        }
      })

      // Update problem
      await db.problem.update({
        where: { id: problemId },
        data: {
          status: 'CLOSED',
          closedAt: new Date()
        }
      })

      // Update helper stats
      await db.user.update({
        where: { id: escrow.helperId },
        data: {
          helpfulCount: { increment: 1 },
          trustScore: { increment: 3 }
        }
      })

      // Notify helper
      await db.notification.create({
        data: {
          userId: escrow.helperId,
          type: 'HELP',
          title: '🎉 Payment Released!',
          message: `₹${escrow.amount} has been released to you for completing the task.`
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Payment released successfully'
      })
    }

    if (action === 'dispute') {
      // Raise a dispute
      const { reason } = body

      if (!problemId || !reason) {
        return NextResponse.json({ error: 'Problem ID and reason required' }, { status: 400 })
      }

      const escrow = await db.escrowTransaction.findFirst({
        where: { problemId, status: 'LOCKED' }
      })

      if (!escrow) {
        return NextResponse.json({ error: 'No locked escrow found' }, { status: 404 })
      }

      if (escrow.clientId !== user.id && escrow.helperId !== user.id) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
      }

      await db.escrowTransaction.update({
        where: { id: escrow.id },
        data: {
          status: 'DISPUTED',
          disputeReason: reason
        }
      })

      // Notify both parties and admin
      await db.notification.createMany({
        data: [
          {
            userId: escrow.clientId,
            type: 'SYSTEM',
            title: '⚠️ Dispute Raised',
            message: `A dispute has been raised on task. Admin will review shortly.`
          },
          {
            userId: escrow.helperId,
            type: 'SYSTEM',
            title: '⚠️ Dispute Raised',
            message: `A dispute has been raised on task. Admin will review shortly.`
          }
        ]
      })

      return NextResponse.json({
        success: true,
        message: 'Dispute raised. Admin will review.'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Escrow POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
