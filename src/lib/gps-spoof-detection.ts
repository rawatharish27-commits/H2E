// GPS Spoof Detection Utilities
// Based on RentforHelp.docx security framework

export interface LocationCheckResult {
  isValid: boolean
  isMocked: boolean
  confidence: number
  reasons: string[]
}

export interface LocationHistoryPoint {
  lat: number
  lng: number
  timestamp: number
  accuracy: number
}

// Check if location is likely spoofed
export function detectGPSSpoof(
  currentPosition: GeolocationPosition,
  previousPositions: LocationHistoryPoint[] = []
): LocationCheckResult {
  const reasons: string[] = []
  let confidence = 1.0
  let isMocked = false

  // 1. Check if position has mock location flag (Android)
  // @ts-expect-error - mocking property exists on Android
  if (currentPosition.coords.mocked || currentPosition.coords.isMock) {
    isMocked = true
    reasons.push('Mock location flag detected')
    confidence *= 0.1
  }

  // 2. Check accuracy (too perfect = fake)
  const accuracy = currentPosition.coords.accuracy
  if (accuracy < 3) {
    reasons.push('Accuracy too precise (likely fake)')
    confidence *= 0.5
  }

  // 3. Check for impossible speed (teleportation)
  if (previousPositions.length >= 2) {
    const lastPos = previousPositions[previousPositions.length - 1]
    const timeDiff = (Date.now() - lastPos.timestamp) / 1000 // seconds
    const distance = calculateDistance(
      lastPos.lat, lastPos.lng,
      currentPosition.coords.latitude, currentPosition.coords.longitude
    )
    
    // Speed in km/h
    const speed = (distance / timeDiff) * 3600
    
    // More than 500 km/h is impossible for ground travel
    if (speed > 500 && distance > 10) {
      reasons.push(`Impossible speed detected: ${Math.round(speed)} km/h`)
      confidence *= 0.2
      isMocked = true
    }
  }

  // 4. Check altitude (mock locations often have 0 or null altitude)
  const altitude = currentPosition.coords.altitude
  if (altitude === 0 || altitude === null) {
    // This alone isn't conclusive, but combined with other factors
    confidence *= 0.95
  }

  // 5. Check for coordinate patterns (mock apps often use round numbers)
  const lat = currentPosition.coords.latitude
  const lng = currentPosition.coords.longitude
  
  // Check for too many trailing zeros
  const latDecimals = (lat.toString().split('.')[1] || '').length
  const lngDecimals = (lng.toString().split('.')[1] || '').length
  
  if (latDecimals < 4 && lngDecimals < 4) {
    reasons.push('Coordinates have suspicious precision')
    confidence *= 0.7
  }

  // 6. Check for sudden location jumps that are physically impossible
  if (previousPositions.length >= 5) {
    const recentPositions = previousPositions.slice(-5)
    const avgDistance = recentPositions.reduce((sum, pos, idx) => {
      if (idx === 0) return 0
      return sum + calculateDistance(
        recentPositions[idx - 1].lat, recentPositions[idx - 1].lng,
        pos.lat, pos.lng
      )
    }, 0) / 4

    const lastDistance = calculateDistance(
      recentPositions[recentPositions.length - 1].lat,
      recentPositions[recentPositions.length - 1].lng,
      lat, lng
    )

    // If sudden distance is 10x the average recent distance
    if (lastDistance > avgDistance * 10 && avgDistance > 0.1) {
      reasons.push('Sudden location jump detected')
      confidence *= 0.3
    }
  }

  return {
    isValid: confidence > 0.5 && !isMocked,
    isMocked,
    confidence: Math.round(confidence * 100) / 100,
    reasons
  }
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Check if user is in a different city than expected
export function detectCityChange(
  currentLat: number,
  currentLng: number,
  homeLat: number,
  homeLng: number
): { isChanged: boolean; distance: number } {
  const distance = calculateDistance(homeLat, homeLng, currentLat, currentLng)
  
  // If more than 100km from home location
  return {
    isChanged: distance > 100,
    distance
  }
}

// Calculate location consistency score (0-100)
export function calculateLocationConsistency(
  positions: LocationHistoryPoint[]
): number {
  if (positions.length < 2) return 50

  let consistencyScore = 100

  // Check for jitter (rapid small movements)
  const jitterScores: number[] = []
  for (let i = 2; i < positions.length; i++) {
    const d1 = calculateDistance(
      positions[i - 2].lat, positions[i - 2].lng,
      positions[i - 1].lat, positions[i - 1].lng
    )
    const d2 = calculateDistance(
      positions[i - 1].lat, positions[i - 1].lng,
      positions[i].lat, positions[i].lng
    )
    
    // If distances are similar, less jitter
    if (d1 + d2 > 0) {
      const jitterRatio = Math.abs(d1 - d2) / Math.max(d1, d2)
      jitterScores.push(1 - jitterRatio)
    }
  }

  if (jitterScores.length > 0) {
    const avgJitter = jitterScores.reduce((a, b) => a + b, 0) / jitterScores.length
    consistencyScore *= avgJitter
  }

  // Check for impossible movements
  for (let i = 1; i < positions.length; i++) {
    const timeDiff = (positions[i].timestamp - positions[i - 1].timestamp) / 1000
    const distance = calculateDistance(
      positions[i - 1].lat, positions[i - 1].lng,
      positions[i].lat, positions[i].lng
    )
    
    if (timeDiff > 0) {
      const speed = (distance / timeDiff) * 3600 // km/h
      
      // Penalize impossible speeds
      if (speed > 300) {
        consistencyScore *= 0.5
      } else if (speed > 200) {
        consistencyScore *= 0.8
      }
    }
  }

  return Math.max(0, Math.min(100, Math.round(consistencyScore)))
}

// Store for location history (in-memory, per session)
const locationHistory: Map<string, LocationHistoryPoint[]> = new Map()

export function addLocationToHistory(
  userId: string,
  position: GeolocationPosition
): LocationHistoryPoint[] {
  const history = locationHistory.get(userId) || []
  
  const newPoint: LocationHistoryPoint = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    timestamp: Date.now(),
    accuracy: position.coords.accuracy
  }
  
  // Keep last 50 positions
  const updated = [...history, newPoint].slice(-50)
  locationHistory.set(userId, updated)
  
  return updated
}

export function getLocationHistory(userId: string): LocationHistoryPoint[] {
  return locationHistory.get(userId) || []
}

// Flag types for security audit
export type GPSFlagType = 
  | 'MOCK_LOCATION'
  | 'IMPOSSIBLE_SPEED'
  | 'SUDDEN_JUMP'
  | 'SUSPICIOUS_PRECISION'
  | 'CITY_CHANGE'
  | 'INCONSISTENT_PATTERN'

export interface GPSFlag {
  type: GPSFlagType
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  metadata?: Record<string, unknown>
  timestamp: Date
}

// Determine if location should be flagged
export function shouldFlagLocation(
  position: GeolocationPosition,
  userId: string,
  homeLocation?: { lat: number; lng: number }
): GPSFlag[] {
  const flags: GPSFlag[] = []
  const history = getLocationHistory(userId)
  const result = detectGPSSpoof(position, history)

  if (result.isMocked) {
    flags.push({
      type: 'MOCK_LOCATION',
      severity: 'CRITICAL',
      description: 'Mock location detected',
      metadata: { confidence: result.confidence, reasons: result.reasons },
      timestamp: new Date()
    })
  }

  // Check city change if home location is set
  if (homeLocation) {
    const cityChange = detectCityChange(
      position.coords.latitude,
      position.coords.longitude,
      homeLocation.lat,
      homeLocation.lng
    )
    
    if (cityChange.isChanged) {
      flags.push({
        type: 'CITY_CHANGE',
        severity: 'MEDIUM',
        description: `User location changed by ${Math.round(cityChange.distance)} km`,
        metadata: { distance: cityChange.distance },
        timestamp: new Date()
      })
    }
  }

  // Check location consistency
  if (history.length >= 5) {
    const consistency = calculateLocationConsistency(history)
    if (consistency < 30) {
      flags.push({
        type: 'INCONSISTENT_PATTERN',
        severity: 'HIGH',
        description: 'Location pattern is inconsistent',
        metadata: { consistencyScore: consistency },
        timestamp: new Date()
      })
    }
  }

  return flags
}
