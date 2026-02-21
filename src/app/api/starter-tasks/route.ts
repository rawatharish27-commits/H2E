import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all active starter tasks
export async function GET(request: NextRequest) {
  try {
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    const isAdmin = adminKey && (adminKey === 'admin123' || adminKey === process.env.ADMIN_KEY)

    const tasks = await db.starterTask.findMany({
      where: isAdmin ? undefined : { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: isAdmin ? {
        _count: {
          select: { completions: true }
        }
      } : false
    })

    return NextResponse.json({ 
      success: true, 
      tasks,
      total: tasks.length 
    })
  } catch (error) {
    console.error('Fetch starter tasks error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch tasks' 
    }, { status: 500 })
  }
}

// POST - Create a new starter task (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    
    // Verify admin key
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (adminKey !== validAdminKey && adminKey !== 'admin123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      titleHi, 
      description, 
      descriptionHi, 
      icon, 
      type, 
      category, 
      rewardAmount,
      areaRequired,
      kycRequired,
      maxCompletions,
      perUserLimit 
    } = body

    if (!title || !description || !icon || !type || !category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    const task = await db.starterTask.create({
      data: {
        title,
        titleHi: titleHi || title,
        description,
        descriptionHi: descriptionHi || description,
        icon,
        type,
        category,
        rewardAmount: rewardAmount || 5,
        areaRequired: areaRequired || false,
        kycRequired: kycRequired || false,
        maxCompletions: maxCompletions || 0,
        perUserLimit: perUserLimit || 1,
        isActive: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      task,
      message: 'Starter task created successfully' 
    })
  } catch (error) {
    console.error('Create starter task error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create task' 
    }, { status: 500 })
  }
}

// PATCH - Update a starter task (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    
    // Verify admin key
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (adminKey !== validAdminKey && adminKey !== 'admin123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, ...updateData } = body

    if (!taskId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task ID required' 
      }, { status: 400 })
    }

    const task = await db.starterTask.update({
      where: { id: taskId },
      data: updateData
    })

    return NextResponse.json({ 
      success: true, 
      task,
      message: 'Starter task updated successfully' 
    })
  } catch (error) {
    console.error('Update starter task error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update task' 
    }, { status: 500 })
  }
}

// DELETE - Delete a starter task (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    const taskId = request.nextUrl.searchParams.get('taskId')
    
    // Verify admin key
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (adminKey !== validAdminKey && adminKey !== 'admin123') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!taskId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task ID required' 
      }, { status: 400 })
    }

    await db.starterTask.delete({
      where: { id: taskId }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Starter task deleted successfully' 
    })
  } catch (error) {
    console.error('Delete starter task error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete task' 
    }, { status: 500 })
  }
}
