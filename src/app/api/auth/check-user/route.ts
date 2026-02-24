import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Check if user exists by phone number
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({
      success: false,
      error: 'Invalid phone number'
    }, { status: 400 })
  }

  try {
    const user = await db.user.findUnique({
      where: { phone }
    })

    return NextResponse.json({
      success: true,
      exists: !!user
    })
  } catch (error) {
    console.error('Check user error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database error'
    }, { status: 500 })
  }
}
