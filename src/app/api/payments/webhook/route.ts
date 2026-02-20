import { NextRequest, NextResponse } from 'next/server'
import { handleRazorpayWebhook } from '@/lib/payment'

// Razorpay webhook handler
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-razorpay-signature') || ''
    
    const success = await handleRazorpayWebhook(payload, signature)
    
    if (!success) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
