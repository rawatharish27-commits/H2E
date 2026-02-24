import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Maximum helpers that get client phone number
const MAX_HELPERS_WITH_PHONE = 5

// Register as "Ready to Help" - First 5 helpers get client phone number
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, helperId } = body

    if (!problemId || !helperId) {
      return NextResponse.json(
        { error: 'Problem ID and Helper ID are required' },
        { status: 400 }
      )
    }

    // Check if problem exists and is open
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: {
        postedBy: {
          select: {
            id: true,
            phone: true,
            name: true,
            trustScore: true,
          }
        }
      }
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    if (problem.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'This request is no longer open', inWaitlist: false },
        { status: 400 }
      )
    }

    // Get helper info
    const helper = await db.user.findUnique({
      where: { id: helperId },
      select: { id: true, name: true, phone: true }
    })

    // Check if already registered
    const existingRegistration = await db.helperRegistration.findUnique({
      where: {
        problemId_helperId: {
          problemId,
          helperId
        }
      }
    })

    if (existingRegistration) {
      // Already registered - return their status
      const hasPhoneAccess = existingRegistration.rank <= MAX_HELPERS_WITH_PHONE
      
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        rank: existingRegistration.rank,
        hasPhoneAccess,
        clientPhone: hasPhoneAccess ? problem.postedBy.phone : null,
        clientName: hasPhoneAccess ? problem.postedBy.name : null,
        message: hasPhoneAccess 
          ? 'You have access to call the client'
          : `You are #${existingRegistration.rank} in the waitlist. Only first 5 helpers get the phone number.`
      })
    }

    // Count existing registrations for this problem
    const registrationCount = await db.helperRegistration.count({
      where: { problemId }
    })

    const newRank = registrationCount + 1
    const hasPhoneAccess = newRank <= MAX_HELPERS_WITH_PHONE

    // Create registration and notifications in a transaction
    await db.$transaction(async (tx) => {
      // 1. Create the registration
      await tx.helperRegistration.create({
        data: {
          problemId,
          helperId,
          rank: newRank,
          status: 'REGISTERED'
        }
      })

      // 2. Send notification to HELPER (if they got phone access)
      if (hasPhoneAccess) {
        await tx.notification.create({
          data: {
            userId: helperId,
            type: 'HELP',
            title: '🎉 Phone Number Unlocked!',
            message: `You're #${newRank} for "${problem.title}". Call ${problem.postedBy.name || 'the client'} at +91${problem.postedBy.phone}`,
            data: JSON.stringify({
              problemId,
              clientPhone: problem.postedBy.phone,
              clientName: problem.postedBy.name,
              rank: newRank
            })
          }
        })
      } else {
        // Waitlist notification
        await tx.notification.create({
          data: {
            userId: helperId,
            type: 'HELP',
            title: '⏳ Added to Waitlist',
            message: `You're #${newRank} for "${problem.title}". Only first 5 helpers get the phone number. Wait for your turn!`,
            data: JSON.stringify({
              problemId,
              rank: newRank
            })
          }
        })
      }

      // 3. Send notification to CLIENT (someone wants to help!)
      await tx.notification.create({
        data: {
          userId: problem.postedBy.id,
          type: 'HELP',
          title: '🤝 Someone wants to help!',
          message: `${helper?.name || 'A helper'} is ready to help with "${problem.title}". ${hasPhoneAccess ? 'They can call you now!' : `They're #${newRank} in queue.`}`,
          data: JSON.stringify({
            problemId,
            helperId,
            helperName: helper?.name,
            helperPhone: helper?.phone,
            rank: newRank,
            hasPhoneAccess
          })
        }
      })
    })

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
      rank: newRank,
      hasPhoneAccess,
      clientPhone: hasPhoneAccess ? problem.postedBy.phone : null,
      clientName: hasPhoneAccess ? problem.postedBy.name : null,
      totalRegistered: registrationCount + 1,
      message: hasPhoneAccess 
        ? `You are #${newRank}! Call the client now.`
        : `You are #${newRank} in the waitlist. First 5 helpers get the phone number.`
    })
  } catch (error) {
    console.error('Ready to help registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}

// Get helper registrations for a problem
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')
    const helperId = searchParams.get('helperId')

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      )
    }

    if (helperId) {
      // Get specific helper's registration status
      const registration = await db.helperRegistration.findUnique({
        where: {
          problemId_helperId: {
            problemId,
            helperId
          }
        }
      })

      const problem = await db.problem.findUnique({
        where: { id: problemId },
        include: {
          postedBy: {
            select: { phone: true, name: true }
          }
        }
      })

      if (!registration) {
        return NextResponse.json({
          success: true,
          registered: false,
          registrationCount: await db.helperRegistration.count({ where: { problemId } })
        })
      }

      const hasPhoneAccess = registration.rank <= MAX_HELPERS_WITH_PHONE

      return NextResponse.json({
        success: true,
        registered: true,
        rank: registration.rank,
        hasPhoneAccess,
        clientPhone: hasPhoneAccess && problem ? problem.postedBy.phone : null,
        clientName: hasPhoneAccess && problem ? problem.postedBy.name : null,
        status: registration.status
      })
    }

    // Get all registrations for the problem (for admin/client view)
    const registrations = await db.helperRegistration.findMany({
      where: { problemId },
      orderBy: { rank: 'asc' },
      take: 10,
      include: {
        helper: {
          select: {
            id: true,
            name: true,
            phone: true,
            trustScore: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      registrations,
      totalRegistered: registrations.length
    })
  } catch (error) {
    console.error('Get registrations error:', error)
    return NextResponse.json(
      { error: 'Failed to get registrations' },
      { status: 500 }
    )
  }
}
