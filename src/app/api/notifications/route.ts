import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Get notifications
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    
    const notifications = await db.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { isRead: false })
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    const unreadCount = await db.notification.count({
      where: { userId, isRead: false }
    })
    
    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// Create notification (internal)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, data } = body
    
    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const notification = await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null
      }
    })
    
    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

// Mark as read
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
    const { notificationId, markAll } = body
    
    if (markAll) {
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      })
    } else if (notificationId) {
      await db.notification.update({
        where: { id: notificationId, userId },
        data: { isRead: true }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: markAll ? 'All notifications marked as read' : 'Notification marked as read'
    })
  } catch (error) {
    console.error('Mark read error:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
