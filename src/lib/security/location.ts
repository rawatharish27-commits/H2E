// Location Validation Service for Community Help Network Marketplace
// GPS validation, distance calculations, and spoof detection

import { db } from '@/lib/db'

// Location validation configuration
export const LOCATION_CONFIG = {
  // Maximum allowed distance from problem location to check-in (in km)
  MAX_CHECKIN_DISTANCE: 0.5, // 500m
  // Maximum allowed distance for problem visibility (in km)
  MAX_VISIBILITY_DISTANCE: 10,
  // Minimum accuracy required for GPS (in meters)
  MIN_GPS_ACCURACY: 100,
  // Maximum speed for travel detection (in km/h)
  MAX_REASONABLE_SPEED: 200,
  // Time window for location history comparison (in seconds)
  LOCATION_HISTORY_WINDOW: 300, // 5 minutes
  // Maximum altitude change per second (in meters)
  MAX_ALTITUDE_CHANGE_RATE: 50,
} as const

// Location data interface
export interface LocationData {
  lat: number
  lng: number
  accuracy?: number
  altitude?: number
  altitudeAccuracy?: number
  heading?: number
  speed?: number
  timestamp: number
}

// Validation result interface
export interface ValidationResult {
  valid: boolean
  error?: string
  warnings?: string[]
  distance?: number
  confidence: number // 0-1
}

/**
 * Validate a location against requirements
 */
export async function validateLocation(
  userId: string,
  location: LocationData,
  options?: {
    requiredAccuracy?: number
    checkPreviousLocation?: boolean
    maxDistanceFromProblem?: number
    problemLocation?: { lat: number; lng: number }
  }
): Promise<ValidationResult> {
  const warnings: string[] = []

  // Check accuracy
  const requiredAccuracy = options?.requiredAccuracy ?? LOCATION_CONFIG.MIN_GPS_ACCURACY
  if (location.accuracy && location.accuracy > requiredAccuracy) {
    warnings.push(`GPS accuracy is low: ${location.accuracy.toFixed(0)}m`)
  }

  // Check if coordinates are valid
  if (!isValidCoordinates(location.lat, location.lng)) {
    return {
      valid: false,
      error: 'Invalid coordinates',
      confidence: 0
    }
  }

  // Check for obvious spoofing indicators
  const spoofCheck = await detectLocationSpoof(userId, location)
  if (!spoofCheck.valid) {
    return spoofCheck
  }
  if (spoofCheck.warnings) {
    warnings.push(...spoofCheck.warnings)
  }

  // Check distance from problem if specified
  let distance: number | undefined
  if (options?.problemLocation) {
    distance = calculateDistance(
      location.lat,
      location.lng,
      options.problemLocation.lat,
      options.problemLocation.lng
    )

    const maxDistance = options.maxDistanceFromProblem ?? LOCATION_CONFIG.MAX_CHECKIN_DISTANCE
    if (distance > maxDistance) {
      return {
        valid: false,
        error: `Too far from problem location (${distance.toFixed(2)}km)`,
        distance,
        confidence: 0.3,
        warnings
      }
    }
  }

  // Check previous location for consistency
  if (options?.checkPreviousLocation) {
    const previousCheck = await checkPreviousLocation(userId, location)
    if (!previousCheck.valid) {
      return previousCheck
    }
    if (previousCheck.warnings) {
      warnings.push(...previousCheck.warnings)
    }
  }

  // Calculate confidence based on accuracy and other factors
  let confidence = 1.0
  if (location.accuracy && location.accuracy > 50) {
    confidence -= 0.1
  }
  if (location.accuracy && location.accuracy > 100) {
    confidence -= 0.2
  }
  if (warnings.length > 0) {
    confidence -= 0.1 * warnings.length
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    distance,
    confidence: Math.max(0, confidence)
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Check if a point is within a radius of another point
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  pointLat: number,
  pointLng: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng)
  return distance <= radiusKm
}

/**
 * Detect location spoofing
 */
export async function detectLocationSpoof(
  userId: string,
  location: LocationData
): Promise<ValidationResult> {
  const warnings: string[] = []

  // Check for impossible coordinates
  if (!isValidCoordinates(location.lat, location.lng)) {
    return {
      valid: false,
      error: 'Invalid coordinates - outside Earth bounds',
      confidence: 0
    }
  }

  // Check for suspicious patterns
  // 1. Perfect coordinates (too many zeros)
  const latStr = location.lat.toFixed(6)
  const lngStr = location.lng.toFixed(6)
  const zerosLat = (latStr.match(/0/g) || []).length
  const zerosLng = (lngStr.match(/0/g) || []).length
  
  if (zerosLat > 4 || zerosLng > 4) {
    warnings.push('Suspicious coordinate pattern detected')
  }

  // 2. Check for mock location indicators (would need native API in real app)
  // For web, we can check if the position comes from a simulator
  if (location.accuracy === 0) {
    warnings.push('GPS accuracy is exactly 0 - possible mock location')
  }

  // 3. Check for impossible altitude
  if (location.altitude && (location.altitude < -500 || location.altitude > 9000)) {
    warnings.push(`Suspicious altitude: ${location.altitude.toFixed(0)}m`)
  }

  // 4. Check for impossible speed
  if (location.speed && location.speed > LOCATION_CONFIG.MAX_REASONABLE_SPEED / 3.6) {
    return {
      valid: false,
      error: `Impossible speed detected: ${(location.speed * 3.6).toFixed(0)} km/h`,
      confidence: 0
    }
  }

  // 5. Check user's recent location history for impossible travel
  const user = await db.user.findUnique({
    where: { id: userId }
  })

  if (user?.lat && user?.lng && user?.locationUpdatedAt) {
    const timeDiff = (Date.now() - user.locationUpdatedAt.getTime()) / 1000 // seconds
    const distance = calculateDistance(user.lat, user.lng, location.lat, location.lng)
    
    // Skip if it's been more than the window
    if (timeDiff < LOCATION_CONFIG.LOCATION_HISTORY_WINDOW && timeDiff > 0) {
      const speed = (distance / timeDiff) * 3600 // km/h
      
      if (speed > LOCATION_CONFIG.MAX_REASONABLE_SPEED) {
        return {
          valid: false,
          error: `Impossible travel detected: ${speed.toFixed(0)} km/h over ${(distance * 1000).toFixed(0)}m`,
          confidence: 0
        }
      }
    }
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    confidence: warnings.length > 0 ? 0.7 : 1.0
  }
}

/**
 * Check against previous location
 */
async function checkPreviousLocation(
  userId: string,
  location: LocationData
): Promise<ValidationResult> {
  const warnings: string[] = []

  const user = await db.user.findUnique({
    where: { id: userId }
  })

  if (!user?.lat || !user?.lng) {
    return { valid: true, confidence: 1.0 }
  }

  const distance = calculateDistance(user.lat, user.lng, location.lat, location.lng)
  const timeDiff = user.locationUpdatedAt 
    ? (Date.now() - user.locationUpdatedAt.getTime()) / 1000 
    : LOCATION_CONFIG.LOCATION_HISTORY_WINDOW

  // Check for teleportation (instant location change)
  if (distance > 1 && timeDiff < 1) {
    return {
      valid: false,
      error: 'Instant location change detected - possible spoofing',
      confidence: 0
    }
  }

  // Calculate speed if we have timing data
  if (timeDiff > 0 && distance > 0.1) {
    const speed = (distance / timeDiff) * 3600 // km/h
    
    if (speed > LOCATION_CONFIG.MAX_REASONABLE_SPEED * 0.5) {
      warnings.push(`High travel speed detected: ${speed.toFixed(0)} km/h`)
    }
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    distance,
    confidence: warnings.length > 0 ? 0.8 : 1.0
  }
}

/**
 * Check if coordinates are valid
 */
function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Update user's current location
 */
export async function updateUserLocation(
  userId: string,
  location: LocationData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate first
    const validation = await validateLocation(userId, location)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Update user's location
    await db.user.update({
      where: { id: userId },
      data: {
        lat: location.lat,
        lng: location.lng,
        locationUpdatedAt: new Date(),
        lastActiveAt: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update location' 
    }
  }
}

/**
 * Get nearby problems based on user location
 */
export async function getNearbyProblems(
  userId: string,
  location: LocationData,
  maxDistance?: number
): Promise<Array<{
  id: string
  title: string
  type: string
  distance: number
  lat: number
  lng: number
}>> {
  const distance = maxDistance ?? LOCATION_CONFIG.MAX_VISIBILITY_DISTANCE

  // Get all open problems and filter by distance
  // Note: SQLite doesn't support spatial queries, so we do it in memory
  const problems = await db.problem.findMany({
    where: {
      status: 'OPEN'
    },
    select: {
      id: true,
      title: true,
      type: true,
      lat: true,
      lng: true
    }
  })

  // Calculate distances and filter
  const nearby = problems
    .map(problem => ({
      ...problem,
      distance: calculateDistance(location.lat, location.lng, problem.lat, problem.lng)
    }))
    .filter(problem => problem.distance <= distance)
    .sort((a, b) => a.distance - b.distance)

  return nearby
}

/**
 * Calculate bearing between two points
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = toRad(lng2 - lng1)
  const lat1Rad = toRad(lat1)
  const lat2Rad = toRad(lat2)

  const y = Math.sin(dLng) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)

  let bearing = Math.atan2(y, x) * (180 / Math.PI)
  bearing = (bearing + 360) % 360

  return bearing
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 0.001) {
    return 'Here'
  }
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`
  }
  if (km < 10) {
    return `${km.toFixed(1)}km away`
  }
  return `${Math.round(km)}km away`
}

/**
 * Get direction description from bearing
 */
export function getDirectionDescription(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}
