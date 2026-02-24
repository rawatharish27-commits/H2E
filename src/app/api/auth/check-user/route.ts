import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Check if user exists by phone number
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({
        exists: false,
        error: 'Invalid phone number'
      }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { phone }
    })

    return NextResponse.json({
      exists: !!user
    })
  } catch (error) {
    console.error('Check user error:', error)
    return NextResponse.json({
      exists: false,
      error: 'Failed to check user'
    }, { status: 500 })
  }
}
