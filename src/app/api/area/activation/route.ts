import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Area Activation Requirements
const AREA_ACTIVATION_REQUIREMENTS = {
  MIN_USERS: 50,        // Minimum registered users
  MIN_WEEKLY_TASKS: 10, // Minimum weekly tasks
  MIN_PROVIDERS: 5      // Minimum task providers
}

// GET - Get area activation status
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const areaCode = searchParams.get('areaCode') || user.areaCode

    if (!areaCode) {
      return NextResponse.json({ 
        error: 'Area code required',
        hasArea: false 
      }, { status: 400 })
    }

    // Get or create area
    let area = await db.area.findUnique({
      where: { areaCode }
    })

    if (!area) {
      // Create new area
      area = await db.area.create({
        data: {
          areaCode,
          areaName: `Area ${areaCode}`,
          registeredUsers: 1,
          isActive: false
        }
      })
    }

    // Calculate current stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Count registered users in area
    const registeredUsers = await db.user.count({
      where: { areaCode }
    })

    // Count weekly tasks (problems created in last 7 days)
    const weeklyTasks = await db.problem.count({
      where: {
        areaCode,
        createdAt: { gte: weekAgo }
      }
    })

    // Count unique task providers (users who posted problems)
    const taskProviders = await db.problem.groupBy({
      by: ['postedById'],
      where: {
        areaCode,
        createdAt: { gte: weekAgo }
      }
    })

    // Calculate activation progress
    const userProgress = Math.min(100, (registeredUsers / AREA_ACTIVATION_REQUIREMENTS.MIN_USERS) * 100)
    const taskProgress = Math.min(100, (weeklyTasks / AREA_ACTIVATION_REQUIREMENTS.MIN_WEEKLY_TASKS) * 100)
    const providerProgress = Math.min(100, (taskProviders.length / AREA_ACTIVATION_REQUIREMENTS.MIN_PROVIDERS) * 100)

    // Check if all requirements met
    const canActivate = 
      registeredUsers >= AREA_ACTIVATION_REQUIREMENTS.MIN_USERS &&
      weeklyTasks >= AREA_ACTIVATION_REQUIREMENTS.MIN_WEEKLY_TASKS &&
      taskProviders.length >= AREA_ACTIVATION_REQUIREMENTS.MIN_PROVIDERS

    // Auto-activate if requirements met and not already active
    if (canActivate && !area.isActive) {
      area = await db.area.update({
        where: { areaCode },
        data: {
          isActive: true,
          activatedAt: now,
          registeredUsers,
          weeklyTasks,
          taskProviders: taskProviders.length
        }
      })

      // Notify all users in the area
      await db.notification.createMany({
        data: (await db.user.findMany({ where: { areaCode } })).map(u => ({
          userId: u.id,
          type: 'SYSTEM',
          title: '🎉 Area Activated!',
          message: `Your area ${areaCode} is now active! You can now post and help with tasks.`
        }))
      })
    } else {
      // Update stats
      await db.area.update({
        where: { areaCode },
        data: {
          registeredUsers,
          weeklyTasks,
          taskProviders: taskProviders.length
        }
      })
    }

    return NextResponse.json({
      success: true,
      area: {
        code: areaCode,
        name: area.areaName,
        isActive: area.isActive,
        activatedAt: area.activatedAt
      },
      requirements: AREA_ACTIVATION_REQUIREMENTS,
      current: {
        registeredUsers,
        weeklyTasks,
        taskProviders: taskProviders.length
      },
      progress: {
        users: Math.round(userProgress),
        tasks: Math.round(taskProgress),
        providers: Math.round(providerProgress),
        overall: Math.round((userProgress + taskProgress + providerProgress) / 3)
      },
      canActivate,
      message: area.isActive 
        ? 'Your area is active! You can post and help with tasks.'
        : `Area needs ${AREA_ACTIVATION_REQUIREMENTS.MIN_USERS - registeredUsers} more users, ${AREA_ACTIVATION_REQUIREMENTS.MIN_WEEKLY_TASKS - weeklyTasks} more weekly tasks to activate.`
    })
  } catch (error) {
    console.error('Area activation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Update area stats (called when user joins/creates task)
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, areaCode } = body

    if (!areaCode) {
      return NextResponse.json({ error: 'Area code required' }, { status: 400 })
    }

    // Get or create area
    let area = await db.area.findUnique({
      where: { areaCode }
    })

    if (!area) {
      area = await db.area.create({
        data: {
          areaCode,
          areaName: `Area ${areaCode}`,
          registeredUsers: 1,
          isActive: false
        }
      })
    }

    // Update user's area
    await db.user.update({
      where: { id: user.id },
      data: { areaCode }
    })

    // Recalculate stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const registeredUsers = await db.user.count({
      where: { areaCode }
    })

    const weeklyTasks = await db.problem.count({
      where: {
        areaCode,
        createdAt: { gte: weekAgo }
      }
    })

    const taskProviders = await db.problem.groupBy({
      by: ['postedById'],
      where: {
        areaCode,
        createdAt: { gte: weekAgo }
      }
    })

    // Check activation
    const canActivate = 
      registeredUsers >= AREA_ACTIVATION_REQUIREMENTS.MIN_USERS &&
      weeklyTasks >= AREA_ACTIVATION_REQUIREMENTS.MIN_WEEKLY_TASKS &&
      taskProviders.length >= AREA_ACTIVATION_REQUIREMENTS.MIN_PROVIDERS

    let updateData: any = {
      registeredUsers,
      weeklyTasks,
      taskProviders: taskProviders.length,
      totalUsers: registeredUsers
    }

    if (canActivate && !area.isActive) {
      updateData.isActive = true
      updateData.activatedAt = now
    }

    area = await db.area.update({
      where: { areaCode },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      area,
      isNewActivation: canActivate && !area.isActive
    })
  } catch (error) {
    console.error('Area update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
