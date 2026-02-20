import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { createRazorpayOrder } from '@/lib/payment'
import { checkRateLimit } from '@/lib/security/rate-limit'

// Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = await verifyToken(token)
    
    if (!userId) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }
    
    // Rate limit
    const rateLimit = await checkRateLimit(userId, 'CREATE_PAYMENT')
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    
    const body = await request.json()
    const amount = body.amount || 4900 // Default ₹49
    const months = body.months || 1
    
    // Create order
    const order = await createRazorpayOrder(userId, amount, months)
    
    if (!order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Verify payment
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = await verifyToken(token)
    
    if (!userId) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }
    
    const body = await request.json()
    const { orderId, paymentId, signature } = body
    
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }
    
    // Verify signature
    const { verifyRazorpaySignature, processSuccessfulPayment } = await import('@/lib/payment')
    
    if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }
    
    // Process payment
    const result = await processSuccessfulPayment(orderId, paymentId, userId)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment successful',
      activeTill: result.activeTill
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
