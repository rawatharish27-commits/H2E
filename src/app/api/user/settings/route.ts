import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// GET - Get user settings
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      settings: {
        darkMode: user.darkMode,
        language: user.language,
        notifications: user.notifications,
        locationEnabled: user.locationEnabled,
        showProfile: user.showProfile,
        crossAreaEnabled: user.crossAreaEnabled,
        whatsappEnabled: user.whatsappEnabled,
        whatsappNumber: user.whatsappNumber,
        quietHoursStart: user.quietHoursStart,
        quietHoursEnd: user.quietHoursEnd
      }
    })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update user settings
export async function PATCH(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { setting, value } = body

    const allowedSettings = [
      'darkMode',
      'language',
      'notifications',
      'locationEnabled',
      'showProfile',
      'crossAreaEnabled',
      'whatsappEnabled',
      'whatsappNumber',
      'quietHoursStart',
      'quietHoursEnd'
    ]

    if (!setting || !allowedSettings.includes(setting)) {
      return NextResponse.json({ error: 'Invalid setting' }, { status: 400 })
    }

    // Update the setting
    await db.user.update({
      where: { id: user.id },
      data: { [setting]: value }
    })

    // If cross-area enabled, create notification
    if (setting === 'crossAreaEnabled' && value === true) {
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM',
          title: '📍 Extended Range Enabled',
          message: 'You can now see problems within 30 KM radius instead of 20 KM.'
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `${setting} updated successfully`,
      setting,
      value
    })
  } catch (error) {
    console.error('Settings PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
