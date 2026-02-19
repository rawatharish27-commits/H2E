import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get user's problems
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const problems = await db.problem.findMany({
      where: { postedById: id },
      include: {
        postedBy: {
          select: {
            id: true,
            phone: true,
            name: true,
            trustScore: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      problems
    })
  } catch (error) {
    console.error('Get user problems error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}

// Update problem status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, userId } = body

    const problem = await db.problem.findUnique({
      where: { id }
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    if (problem.postedById !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updated = await db.problem.update({
      where: { id },
      data: {
        status,
        ...(status === 'CLOSED' && { closedAt: new Date() })
      }
    })

    return NextResponse.json({
      success: true,
      problem: updated
    })
  } catch (error) {
    console.error('Update problem error:', error)
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    )
  }
}
