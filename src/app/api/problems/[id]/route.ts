import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createNotification } from '@/lib/notifications'

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
    const { 
      status, 
      userId,
      acceptedById,  // When a helper accepts
      noShow         // Report no-show
    } = body

    const problem = await db.problem.findUnique({
      where: { id },
      select: {
        id: true,
        postedById: true,
        status: true,
        acceptedById: true,
        postedBy: {
          select: { id: true, name: true, phone: true }
        }
      }
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Authorization check
    const isOwner = problem.postedById === userId
    const isHelper = acceptedById === userId

    if (!isOwner && !isHelper && status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Handle different status changes
    let updateData: Record<string, unknown> = { status }
    
    if (status === 'IN_PROGRESS' && acceptedById) {
      // Helper accepted the problem
      updateData.acceptedById = acceptedById
      updateData.acceptedAt = new Date()
      
      // Notify the problem poster
      await createNotification({
        userId: problem.postedById,
        type: 'HELP_ACCEPTED',
        title: '🎉 Someone is coming to help!',
        message: `A helper has accepted your request. They will contact you soon.`,
        data: { problemId: id, helperId: acceptedById },
        priority: 'HIGH'
      })
    }
    
    if (status === 'CLOSED') {
      updateData.closedAt = new Date()
    }
    
    if (status === 'CANCELLED') {
      updateData.closedAt = new Date()
    }

    if (noShow) {
      updateData.noShowReported = true
    }

    const updated = await db.problem.update({
      where: { id },
      data: updateData,
      include: {
        postedBy: {
          select: { id: true, name: true, phone: true, trustScore: true }
        }
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
