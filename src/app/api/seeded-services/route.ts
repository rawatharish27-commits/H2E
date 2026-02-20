import { NextResponse } from 'next/server'
import { 
  SEEDED_SERVICES, 
  getTodaysSeedTasks, 
  getRandomServices
} from '@/data/seededServices'

// App launch date - should be stored in database in production
const APP_LAUNCH_DATE = new Date('2024-01-01') // Adjust this to actual launch date

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'services'
  const count = parseInt(searchParams.get('count') || '10')
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')

  try {
    switch (action) {
      case 'services':
        // Get seeded services with distance calculation
        let services = getRandomServices(count)
        
        // If user location provided, sort by distance
        if (lat && lng) {
          services = services.map(service => ({
            ...service,
            distance: calculateDistance(lat, lng, 30.3165, 78.0322) + (Math.random() * 5 - 2.5) // Dehradun center + variation
          })).sort((a, b) => a.distance - b.distance)
        }
        
        return NextResponse.json({
          success: true,
          services,
          total: SEEDED_SERVICES.length,
          message: 'Seeded services fetched successfully',
          isSeeded: true
        })

      case 'activity-tasks':
        // Get today's activity seed tasks (for first 15 days)
        const todaysTasks = getTodaysSeedTasks(APP_LAUNCH_DATE)
        
        return NextResponse.json({
          success: true,
          tasks: todaysTasks,
          dayNumber: Math.floor((Date.now() - APP_LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1,
          totalDays: 15,
          isActive: todaysTasks.length > 0,
          message: todaysTasks.length > 0 
            ? 'Activity tasks for today' 
            : 'Activity seeding period completed'
        })

      case 'all-services':
        // Get all seeded services (for admin/testing)
        return NextResponse.json({
          success: true,
          services: SEEDED_SERVICES,
          total: SEEDED_SERVICES.length
        })

      case 'featured':
        // Get featured/popular services for home screen
        const featured = SEEDED_SERVICES
          .sort((a, b) => b.providerRating - a.providerRating)
          .slice(0, 5)
        
        return NextResponse.json({
          success: true,
          services: featured,
          message: 'Top rated services'
        })

      case 'stats':
        // Get seeding statistics
        const daysSinceLaunch = Math.floor((Date.now() - APP_LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        return NextResponse.json({
          success: true,
          stats: {
            totalServices: SEEDED_SERVICES.length,
            totalActivityTasks: 75,
            daysSinceLaunch,
            seedingActive: daysSinceLaunch <= 15,
            tasksToday: daysSinceLaunch <= 15 ? 5 : 0,
            categories: {
              emergency: SEEDED_SERVICES.filter(s => s.category === 'EMERGENCY').length,
              timeAccess: SEEDED_SERVICES.filter(s => s.category === 'TIME_ACCESS').length,
              resourceRent: SEEDED_SERVICES.filter(s => s.category === 'RESOURCE_RENT').length
            }
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Seeded services API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch seeded data'
    }, { status: 500 })
  }
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// POST endpoint for marking activity tasks as completed
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, taskId, userId } = body

    if (action === 'complete-task') {
      // In production, this would update the database
      // For now, just return success
      return NextResponse.json({
        success: true,
        message: 'Task marked as completed',
        taskId,
        userId
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
  } catch (error) {
    console.error('Seeded services POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 })
  }
}
