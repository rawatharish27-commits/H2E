import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Create payment request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, upiId, transactionRef } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Check if user already has pending payment
    const existingPending = await db.payment.findFirst({
      where: {
        userId,
        status: 'PENDING'
      }
    })

    if (existingPending) {
      return NextResponse.json(
        { error: 'You already have a pending payment request' },
        { status: 400 }
      )
    }

    // Get current month
    const month = new Date().toISOString().slice(0, 7)

    // Check if already paid for this month
    const existingPaid = await db.payment.findFirst({
      where: {
        userId,
        status: 'APPROVED',
        month
      }
    })

    if (existingPaid) {
      return NextResponse.json(
        { error: 'Already subscribed for this month' },
        { status: 400 }
      )
    }

    // Create payment request
    const payment = await db.payment.create({
      data: {
        userId,
        amount: 49,
        status: 'PENDING',
        upiId,
        transactionRef,
        month
      }
    })

    return NextResponse.json({
      success: true,
      payment
    })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment request' },
      { status: 500 }
    )
  }
}

// Get user's payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const payments = await db.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      payments
    })
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
