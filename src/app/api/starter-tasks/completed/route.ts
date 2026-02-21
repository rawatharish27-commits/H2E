import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get completed task IDs for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID required' 
      }, { status: 400 })
    }

    const completions = await db.starterTaskCompletion.findMany({
      where: { userId },
      select: { taskId: true }
    })

    const taskIds = completions.map(c => c.taskId)

    return NextResponse.json({ 
      success: true, 
      taskIds,
      total: taskIds.length
    })
  } catch (error) {
    console.error('Fetch completed tasks error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch completed tasks' 
    }, { status: 500 })
  }
}
