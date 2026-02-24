import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Mark a task as completed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, userId } = body

    if (!taskId || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task ID and User ID required' 
      }, { status: 400 })
    }

    // Check if user already completed this task
    const existingCompletion = await db.starterTaskCompletion.findUnique({
      where: {
        taskId_userId: { taskId, userId }
      }
    })

    if (existingCompletion) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task already completed' 
      }, { status: 400 })
    }

    // Get task details
    const task = await db.starterTask.findUnique({
      where: { id: taskId }
    })

    if (!task || !task.isActive) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task not found or inactive' 
      }, { status: 404 })
    }

    // Create completion record
    const completion = await db.starterTaskCompletion.create({
      data: {
        taskId,
        userId,
        status: 'COMPLETED',
        rewardAmount: task.rewardAmount
      }
    })

    // Update task completion count
    await db.starterTask.update({
      where: { id: taskId },
      data: {
        currentCompletions: { increment: 1 }
      }
    })

    // Update user's pending earnings
    await db.user.update({
      where: { id: userId },
      data: {
        pendingEarnings: { increment: task.rewardAmount }
      }
    })

    return NextResponse.json({ 
      success: true, 
      completion,
      reward: task.rewardAmount,
      message: `Task completed! ₹${task.rewardAmount} added to your pending earnings` 
    })
  } catch (error) {
    console.error('Complete task error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to complete task' 
    }, { status: 500 })
  }
}
