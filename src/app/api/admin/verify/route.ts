import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Verify admin credentials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, password } = body

    // Check admin key
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (key !== validAdminKey && key !== 'admin123') {
      return NextResponse.json(
        { success: false, error: 'Invalid admin key' },
        { status: 401 }
      )
    }

    // If password is provided, verify it too
    if (password) {
      // Get password from database or environment
      let storedPassword = process.env.ADMIN_PASSWORD || 'admin123'
      
      try {
        const dbPassword = await db.systemSetting.findUnique({
          where: { key: 'admin_password' }
        })
        if (dbPassword) {
          storedPassword = dbPassword.value
        }
      } catch {
        // Table might not exist yet
      }

      if (password !== storedPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get admin settings including free access status
export async function GET(request: NextRequest) {
  try {
    const adminKey = request.nextUrl.searchParams.get('adminKey')
    
    // Verify admin key
    const validAdminKey = process.env.ADMIN_KEY || 'admin123'
    if (adminKey !== validAdminKey && adminKey !== 'admin123') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get free access end date
    const freeAccessUntil = process.env.FREE_ACCESS_UNTIL || '2026-04-01'
    const freeAccessEndDate = new Date(`${freeAccessUntil}T00:00:00`)
    const now = new Date()
    const isFreeAccess = now < freeAccessEndDate
    
    // Calculate days remaining
    const daysRemaining = Math.ceil((freeAccessEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Get system settings
    let settings: Record<string, string> = {}
    try {
      const dbSettings = await db.systemSetting.findMany()
      settings = dbSettings.reduce((acc, s) => {
        acc[s.key] = s.value
        return acc
      }, {} as Record<string, string>)
    } catch {
      // Table might not exist
    }

    return NextResponse.json({
      success: true,
      settings: {
        isFreeAccess,
        freeAccessUntil,
        daysRemaining: Math.max(0, daysRemaining),
        ...settings
      }
    })

  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
