/**
 * Distance Utility Functions
 * Haversine formula for calculating distances between coordinates
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lng1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lng2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convert degrees to radians
 */
function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Calculate distance in meters
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  return calculateDistance(lat1, lng1, lat2, lng2) * 1000
}

/**
 * Check if a point is within a given radius
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  pointLat: number,
  pointLng: number,
  radiusKm: number
): boolean {
  return calculateDistance(centerLat, centerLng, pointLat, pointLng) <= radiusKm
}

/**
 * Get bounding box for a given center and radius
 * Useful for database queries to filter by approximate distance first
 */
export function getBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  // Approximate degrees per km (varies by latitude)
  const latDegPerKm = 1 / 111.32 // 1 degree latitude ≈ 111.32 km
  const lngDegPerKm = 1 / (111.32 * Math.cos(toRad(lat)))
  
  const latDelta = radiusKm * latDegPerKm
  const lngDelta = radiusKm * lngDegPerKm
  
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta
  }
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`
  } else {
    return `${Math.round(distanceKm)}km`
  }
}

/**
 * Calculate estimated travel time (walking)
 * Average walking speed: 5 km/h
 */
export function estimateWalkingTime(distanceKm: number): number {
  const walkingSpeedKmh = 5
  return Math.ceil((distanceKm / walkingSpeedKmh) * 60) // minutes
}

/**
 * Calculate estimated travel time (driving)
 * Average city driving speed: 30 km/h
 */
export function estimateDrivingTime(distanceKm: number): number {
  const drivingSpeedKmh = 30
  return Math.ceil((distanceKm / drivingSpeedKmh) * 60) // minutes
}
