import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authMiddleware } from '@/lib/auth'

// Available Skills
const AVAILABLE_SKILLS = [
  // Technical
  { id: 'electrician', name: 'Electrician', category: 'TECHNICAL' },
  { id: 'plumber', name: 'Plumber', category: 'TECHNICAL' },
  { id: 'carpenter', name: 'Carpenter', category: 'TECHNICAL' },
  { id: 'mechanic', name: 'Mechanic', category: 'TECHNICAL' },
  { id: 'ac_repair', name: 'AC Repair', category: 'TECHNICAL' },
  { id: 'electronics', name: 'Electronics Repair', category: 'TECHNICAL' },
  
  // Services
  { id: 'delivery', name: 'Delivery', category: 'SERVICES' },
  { id: 'cleaning', name: 'Cleaning', category: 'SERVICES' },
  { id: 'cooking', name: 'Cooking', category: 'SERVICES' },
  { id: 'driving', name: 'Driving', category: 'SERVICES' },
  { id: 'photography', name: 'Photography', category: 'SERVICES' },
  { id: 'event_helper', name: 'Event Helper', category: 'SERVICES' },
  
  // Teaching
  { id: 'tutor', name: 'Tutor', category: 'TEACHING' },
  { id: 'music_teacher', name: 'Music Teacher', category: 'TEACHING' },
  { id: 'fitness_trainer', name: 'Fitness Trainer', category: 'TEACHING' },
  { id: 'language_teacher', name: 'Language Teacher', category: 'TEACHING' },
  
  // Creative
  { id: 'designer', name: 'Designer', category: 'CREATIVE' },
  { id: 'video_editor', name: 'Video Editor', category: 'CREATIVE' },
  { id: 'content_writer', name: 'Content Writer', category: 'CREATIVE' },
  { id: 'artist', name: 'Artist', category: 'CREATIVE' }
]

// GET - Get user skills or available skills
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'my-skills'

    if (action === 'available') {
      return NextResponse.json({
        success: true,
        skills: AVAILABLE_SKILLS
      })
    }

    if (action === 'my-skills') {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const skills = await db.userSkill.findMany({
        where: { userId: user.id }
      })

      return NextResponse.json({
        success: true,
        skills: skills.map(s => ({
          id: s.id,
          skillId: s.skillId,
          name: s.skillName,
          category: s.category,
          level: s.level,
          yearsExperience: s.yearsExperience,
          isVerified: s.isVerified,
          totalJobs: s.totalJobs,
          avgRating: s.avgRating,
          isAvailable: s.isAvailable,
          hourlyRate: s.hourlyRate
        }))
      })
    }

    if (action === 'find-helpers') {
      const skillId = searchParams.get('skillId')
      const lat = searchParams.get('lat')
      const lng = searchParams.get('lng')

      if (!skillId) {
        return NextResponse.json({ error: 'Skill ID required' }, { status: 400 })
      }

      const skills = await db.userSkill.findMany({
        where: {
          skillId,
          isAvailable: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              avgRating: true,
              lat: true,
              lng: true,
              areaCode: true,
              trustScore: true
            }
          }
        },
        take: 20
      })

      // Calculate distance if location provided
      let helpers = skills.map(s => {
        let distance = null
        if (lat && lng && s.user.lat && s.user.lng) {
          distance = calculateDistance(
            parseFloat(lat), parseFloat(lng),
            s.user.lat, s.user.lng
          )
        }
        return {
          ...s,
          user: s.user,
          distance
        }
      })

      // Sort by distance if available
      if (lat && lng) {
        helpers = helpers.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
      }

      return NextResponse.json({
        success: true,
        helpers: helpers.map(h => ({
          id: h.id,
          skillId: h.skillId,
          name: h.skillName,
          level: h.level,
          avgRating: h.avgRating,
          totalJobs: h.totalJobs,
          hourlyRate: h.hourlyRate,
          user: h.user,
          distance: h.distance ? Math.round(h.distance * 10) / 10 : null
        }))
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Skills GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add/update user skill
export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, skillId, level, yearsExperience, hourlyRate, isAvailable } = body

    if (action === 'add') {
      if (!skillId) {
        return NextResponse.json({ error: 'Skill ID required' }, { status: 400 })
      }

      const skillInfo = AVAILABLE_SKILLS.find(s => s.id === skillId)
      if (!skillInfo) {
        return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 })
      }

      const skill = await db.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId
          }
        },
        create: {
          userId: user.id,
          skillId,
          skillName: skillInfo.name,
          category: skillInfo.category,
          level: level || 'BEGINNER',
          yearsExperience: yearsExperience || 0,
          hourlyRate,
          isAvailable: isAvailable ?? true
        },
        update: {
          level: level || undefined,
          yearsExperience: yearsExperience ?? undefined,
          hourlyRate,
          isAvailable: isAvailable ?? undefined
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Skill added successfully',
        skill
      })
    }

    if (action === 'toggle-availability') {
      const currentSkill = await db.userSkill.findFirst({
        where: { userId: user.id, skillId }
      })

      if (!currentSkill) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
      }

      await db.userSkill.update({
        where: { id: currentSkill.id },
        data: { isAvailable: !currentSkill.isAvailable }
      })

      return NextResponse.json({
        success: true,
        message: `Availability ${!currentSkill.isAvailable ? 'enabled' : 'disabled'}`
      })
    }

    if (action === 'remove') {
      await db.userSkill.deleteMany({
        where: { userId: user.id, skillId }
      })

      return NextResponse.json({
        success: true,
        message: 'Skill removed'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Skills POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper: Calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
