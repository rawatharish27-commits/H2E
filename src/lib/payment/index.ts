// Payment Integration - Razorpay
import { db } from '@/lib/db'
import { createHash, randomBytes } from 'crypto'

// Razorpay configuration (use environment variables in production)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_demo123'
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'demo_secret'

interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

// Create Razorpay order
export async function createRazorpayOrder(
  userId: string,
  amount: number = 4900, // ₹49 in paise
  months: number = 1
): Promise<{ orderId: string; amount: number; currency: string; key: string } | null> {
  try {
    const receipt = `sub_${userId.slice(0, 8)}_${Date.now()}`
    
    // In production, make actual API call to Razorpay
    // For demo, we simulate the order creation
    const orderId = `order_${randomBytes(16).toString('hex')}`
    
    // Create pending payment record
    await db.payment.create({
      data: {
        userId,
        amount: amount / 100, // Convert paise to rupees
        status: 'PENDING',
        paymentMethod: 'RAZORPAY',
        razorpayOrderId: orderId,
        month: new Date().toISOString().slice(0, 7),
        daysGranted: months * 30
      }
    })
    
    return {
      orderId,
      amount,
      currency: 'INR',
      key: RAZORPAY_KEY_ID
    }
  } catch (error) {
    console.error('Create order error:', error)
    return null
  }
}

// Verify Razorpay payment
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const body = orderId + '|' + paymentId
    const expectedSignature = createHash('sha256')
      .update(body + RAZORPAY_KEY_SECRET)
      .digest('hex')
    
    return expectedSignature === signature
  } catch {
    return false
  }
}

// Process successful payment
export async function processSuccessfulPayment(
  orderId: string,
  paymentId: string,
  userId: string
): Promise<{ success: boolean; activeTill?: Date; error?: string }> {
  try {
    const payment = await db.payment.findFirst({
      where: { razorpayOrderId: orderId, userId }
    })
    
    if (!payment) {
      return { success: false, error: 'Payment not found' }
    }
    
    if (payment.status === 'APPROVED') {
      return { success: false, error: 'Payment already processed' }
    }
    
    // Calculate active till
    const activeTill = new Date(Date.now() + payment.daysGranted * 24 * 60 * 60 * 1000)
    
    // Update in transaction
    await db.$transaction([
      db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'APPROVED',
          razorpayId: paymentId,
          approvedAt: new Date()
        }
      }),
      db.user.update({
        where: { id: userId },
        data: {
          paymentActive: true,
          activeTill,
          subscriptionType: 'PREMIUM'
        }
      })
    ])
    
    // Create admin log
    await db.adminLog.create({
      data: {
        adminId: 'system',
        action: 'PAYMENT_AUTO_APPROVED',
        targetType: 'PAYMENT',
        targetId: payment.id,
        details: `Razorpay payment ${paymentId} auto-approved`
      }
    })
    
    return { success: true, activeTill }
  } catch (error) {
    console.error('Process payment error:', error)
    return { success: false, error: 'Failed to process payment' }
  }
}

// Handle Razorpay webhook
export async function handleRazorpayWebhook(
  payload: string,
  signature: string
): Promise<boolean> {
  try {
    // Verify webhook signature
    const expectedSignature = createHash('sha256')
      .update(payload + RAZORPAY_KEY_SECRET)
      .digest('hex')
    
    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return false
    }
    
    const data = JSON.parse(payload)
    const event = data.event
    
    switch (event) {
      case 'payment.captured':
        const payment = data.payload.payment.entity
        const orderId = payment.order_id
        
        // Find and update payment
        const dbPayment = await db.payment.findFirst({
          where: { razorpayOrderId: orderId }
        })
        
        if (dbPayment && dbPayment.status !== 'APPROVED') {
          await processSuccessfulPayment(orderId, payment.id, dbPayment.userId)
        }
        break
        
      case 'payment.failed':
        // Update payment status
        const failedOrder = data.payload.payment.entity.order_id
        await db.payment.updateMany({
          where: { razorpayOrderId: failedOrder },
          data: { status: 'REJECTED' }
        })
        break
    }
    
    return true
  } catch (error) {
    console.error('Webhook error:', error)
    return false
  }
}

// UPI Payment (Manual verification)
export async function createUPIPaymentRequest(
  userId: string,
  upiId: string,
  transactionRef?: string
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  try {
    // Check for existing pending payment
    const existing = await db.payment.findFirst({
      where: { userId, status: 'PENDING' }
    })
    
    if (existing) {
      return { success: false, error: 'You already have a pending payment request' }
    }
    
    const payment = await db.payment.create({
      data: {
        userId,
        amount: 49,
        status: 'PENDING',
        paymentMethod: 'UPI',
        upiId,
        transactionRef,
        month: new Date().toISOString().slice(0, 7),
        daysGranted: 30
      }
    })
    
    return { success: true, paymentId: payment.id }
  } catch (error) {
    console.error('UPI payment error:', error)
    return { success: false, error: 'Failed to create payment request' }
  }
}

// Get payment history
export async function getPaymentHistory(userId: string) {
  return db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
}
