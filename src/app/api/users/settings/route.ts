import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Get user settings
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
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        locationEnabled: true,
        showProfile: true,
        notifications: true,
        darkMode: true,
        language: true
      }
    })
    
    return NextResponse.json({ success: true, settings: user })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 })
  }
}

// Update user settings
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
    const { locationEnabled, showProfile, notifications, darkMode, language } = body
    
    const updateData: Record<string, unknown> = {}
    
    if (typeof locationEnabled === 'boolean') updateData.locationEnabled = locationEnabled
    if (typeof showProfile === 'boolean') updateData.showProfile = showProfile
    if (typeof notifications === 'boolean') updateData.notifications = notifications
    if (typeof darkMode === 'boolean') updateData.darkMode = darkMode
    if (language && ['hi', 'en'].includes(language)) updateData.language = language
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid settings provided' }, { status: 400 })
    }
    
    await db.user.update({
      where: { id: userId },
      data: updateData
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
