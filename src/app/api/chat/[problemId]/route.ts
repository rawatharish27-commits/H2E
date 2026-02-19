import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Get chat messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const { problemId } = await params
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
    const before = searchParams.get('before')
    
    const messages = await db.chatMessage.findMany({
      where: {
        problemId,
        ...(before && { createdAt: { lt: new Date(before) } })
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true, trustScore: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    // Mark messages as read
    await db.chatMessage.updateMany({
      where: {
        problemId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    })
    
    return NextResponse.json({
      success: true,
      messages: messages.reverse()
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// Send message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const { problemId } = await params
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }
    
    const body = await request.json()
    const { message } = body
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }
    
    // Verify user is part of this problem
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { postedById: true, acceptedById: true }
    })
    
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }
    
    if (problem.postedById !== userId && problem.acceptedById !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    
    const chatMessage = await db.chatMessage.create({
      data: {
        problemId,
        senderId: userId,
        message: message.trim()
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      message: chatMessage
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
