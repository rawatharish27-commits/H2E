import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lat, lng, message } = body

    // In a real app, we'd get userId from auth token
    // For now, we'll use a placeholder
    const authHeader = request.headers.get('authorization')
    
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Location required' },
        { status: 400 }
      )
    }

    // Create SOS alert
    const sosAlert = await db.sosAlert.create({
      data: {
        userId: 'demo-user', // Would be from auth
        lat,
        lng,
        message: message || 'Emergency help needed',
        status: 'ACTIVE'
      }
    })

    // In production, you would:
    // 1. Notify nearby trusted users via push notification
    // 2. Log the event in security audit
    // 3. Potentially auto-alert authorities

    // Log security audit
    await db.securityAudit.create({
      data: {
        userId: 'demo-user',
        eventType: 'SOS_TRIGGERED',
        severity: 'CRITICAL',
        description: 'User triggered SOS alert',
        metadata: JSON.stringify({ sosAlertId: sosAlert.id, lat, lng }),
        lat,
        lng
      }
    })

    return NextResponse.json({
      success: true,
      alertId: sosAlert.id,
      message: 'SOS alert sent successfully'
    })
  } catch (error) {
    console.error('SOS API Error:', error)
    return NextResponse.json(
      { error: 'Failed to send SOS alert' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, status, resolvedBy } = body

    const updated = await db.sosAlert.update({
      where: { id: alertId },
      data: {
        status,
        resolvedBy,
        resolvedAt: new Date(),
        responseTime: Date.now() // Would calculate actual response time
      }
    })

    return NextResponse.json({
      success: true,
      alert: updated
    })
  } catch (error) {
    console.error('SOS Resolve Error:', error)
    return NextResponse.json(
      { error: 'Failed to resolve SOS' },
      { status: 500 }
    )
  }
}
