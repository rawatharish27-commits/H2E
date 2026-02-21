/**
 * Feedback API
 * Handles ratings and feedback after help completion
 * Updates trust scores and processes referral rewards
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { updateTrustScore } from '@/lib/trust'
import { processReferralOnFirstTask } from '@/lib/referral'
import { createNotification, notifyTrustChange } from '@/lib/notifications'

// Submit feedback after help
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      problemId,
      fromUserId,    // Client who posted the problem
      toUserId,      // Helper who helped
      rating,        // 1-5 stars
      comment,
      helperArrived, // Did helper show up?
      duration       // How long did help take (minutes)
    } = body

    // Validate
    if (!problemId || !fromUserId || !toUserId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if feedback already exists
    const existingFeedback = await db.feedback.findUnique({
      where: {
        problemId_fromUserId: { problemId, fromUserId }
      }
    })

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already submitted' },
        { status: 400 }
      )
    }

    // Get problem details
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { postedById: true, status: true, acceptedById: true }
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Verify the feedback provider is the problem poster
    if (problem.postedById !== fromUserId) {
      return NextResponse.json(
        { error: 'Only the problem poster can submit feedback' },
        { status: 403 }
      )
    }

    // Create feedback
    const feedback = await db.feedback.create({
      data: {
        problemId,
        fromUserId,
        toUserId,
        rating,
        comment,
        helperArrived: helperArrived ?? true,
        duration
      }
    })

    // === UPDATE TRUST SCORE ===
    let trustChange = 0
    
    if (helperArrived === false) {
      // No-show: -10 trust
      trustChange = -10
      await updateTrustScore(toUserId, {
        type: 'HELP_NO_SHOW',
        reason: 'Did not show up for help'
      })
      
      // Increment no-show count
      await db.user.update({
        where: { id: toUserId },
        data: {
          noShowCount: { increment: 1 },
          noShowStrikes: { increment: 1 }
        }
      })
    } else {
      // Helper arrived - calculate trust change based on rating
      if (rating >= 4) {
        // Positive rating: +2 trust
        trustChange = 2
        await updateTrustScore(toUserId, {
          type: 'RATING_RECEIVED',
          change: 2,
          reason: `Received ${rating}-star rating`
        })
      } else if (rating <= 2) {
        // Negative rating: -5 trust
        trustChange = -5
        await updateTrustScore(toUserId, {
          type: 'RATING_RECEIVED',
          change: -5,
          reason: `Received ${rating}-star rating`
        })
      }

      // Successful help: +3 trust
      await updateTrustScore(toUserId, {
        type: 'HELP_SUCCESS',
        reason: 'Successfully completed a help request'
      })
      trustChange += 3

      // Update helper stats
      await db.user.update({
        where: { id: toUserId },
        data: {
          helpfulCount: { increment: 1 },
          ratingSum: { increment: rating },
          ratingCount: { increment: 1 }
        }
      })

      // Process referral reward (first task)
      await processReferralOnFirstTask(toUserId)
    }

    // Get updated trust score
    const helper = await db.user.findUnique({
      where: { id: toUserId },
      select: { trustScore: true, name: true }
    })

    // Notify helper about feedback
    await createNotification({
      userId: toUserId,
      type: 'RATING_RECEIVED',
      title: rating >= 4 ? '⭐ Great Rating!' : '📝 New Feedback',
      message: `You received a ${rating}-star rating${comment ? `: "${comment.substring(0, 50)}..."` : ''}`,
      data: { rating, problemId, trustChange },
      priority: 'NORMAL'
    })

    // Notify about trust change
    if (trustChange !== 0 && helper) {
      await notifyTrustChange(
        toUserId,
        trustChange,
        helper.trustScore,
        helperArrived === false ? 'No-show penalty' : `Rating: ${rating} stars`
      )
    }

    // Update problem status to closed
    await db.problem.update({
      where: { id: problemId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        helperArrived
      }
    })

    console.log(`[Feedback] Created for problem ${problemId}: ${rating} stars`)

    return NextResponse.json({
      success: true,
      feedback,
      trustChange,
      newTrustScore: helper?.trustScore
    })
  } catch (error) {
    console.error('[Feedback] Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

// Get feedback for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const problemId = searchParams.get('problemId')

    if (!userId && !problemId) {
      return NextResponse.json(
        { error: 'userId or problemId required' },
        { status: 400 }
      )
    }

    if (problemId) {
      // Get feedback for a specific problem
      const feedback = await db.feedback.findMany({
        where: { problemId },
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          }
        }
      })
      return NextResponse.json({ success: true, feedback })
    }

    // Get feedback received by user
    const feedback = await db.feedback.findMany({
      where: { toUserId: userId! },
      include: {
        problem: {
          select: { id: true, title: true, type: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Calculate stats
    const stats = await db.feedback.aggregate({
      where: { toUserId: userId! },
      _avg: { rating: true },
      _count: { id: true }
    })

    return NextResponse.json({
      success: true,
      feedback,
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.id
      }
    })
  } catch (error) {
    console.error('[Feedback] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
