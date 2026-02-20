import { NextRequest, NextResponse } from 'next/server'

// GET /api/location/reverse - Get address from coordinates (reverse geocoding)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!lat || !lng) {
      return NextResponse.json({
        success: false,
        error: 'Latitude and longitude required'
      }, { status: 400 })
    }

    // Use OpenStreetMap Nominatim API (free, no API key needed)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en,hi`,
      {
        headers: {
          'User-Agent': 'Help2Earn-App/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Geocoding API failed')
    }

    const data = await response.json()

    // Extract address components
    const address = data.address || {}
    
    // Get village/colony/locality
    const village = address.village || address.hamlet || address.suburb || address.neighbourhood || address.city_district || address.town || ''
    
    // Get city
    const city = address.city || address.town || address.district || address.state_district || ''
    
    // Get state
    const state = address.state || ''
    
    // Get pin code
    const pincode = address.postcode || ''
    
    // Get country
    const country = address.country || 'India'
    
    // Full address
    const fullAddress = data.display_name || ''

    // Create a short location name for display
    const locationName = village || city || state || 'Unknown Location'

    return NextResponse.json({
      success: true,
      location: {
        village: village,
        city: city,
        state: state,
        pincode: pincode,
        country: country,
        fullAddress: fullAddress,
        displayName: locationName
      }
    })

  } catch (error) {
    console.error('Reverse geocoding error:', error)
    
    // Return fallback data
    return NextResponse.json({
      success: false,
      error: 'Failed to get location details',
      location: {
        village: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        fullAddress: '',
        displayName: ''
      }
    })
  }
}
