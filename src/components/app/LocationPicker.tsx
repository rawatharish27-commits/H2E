'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  Search, 
  Check, 
  X,
  Crosshair,
  Map
} from 'lucide-react'
import { useAppStore } from '@/store'

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  initialLocation?: { lat: number; lng: number } | null
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const { darkMode } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [address, setAddress] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation)
  const [showMap, setShowMap] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState('')
  
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const autocompleteRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDemoKeyForTesting'}&libraries=places&callback=initGoogleMaps`
      script.async = true
      script.defer = true
      
      window.initGoogleMaps = () => {
        setMapLoaded(true)
      }
      
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  // Initialize map when shown
  useEffect(() => {
    if (showMap && mapLoaded && mapRef.current && !googleMapRef.current) {
      initMap()
    }
  }, [showMap, mapLoaded])

  // Initialize Google Map
  const initMap = useCallback(() => {
    if (!window.google || !mapRef.current) return

    const defaultCenter = selectedLocation || { lat: 28.6139, lng: 77.2090 } // Default: Delhi
    
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      styles: darkMode ? [
        { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
      ] : [],
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    // Add marker
    markerRef.current = new window.google.maps.Marker({
      position: defaultCenter,
      map: googleMapRef.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    })

    // Click on map to set location
    googleMapRef.current.addListener('click', (e: any) => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      updateLocation(lat, lng)
    })

    // Drag marker to set location
    markerRef.current.addListener('dragend', (e: any) => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      updateLocation(lat, lng)
    })

    // Initialize autocomplete
    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' }
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()
        if (place.geometry) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          updateLocation(lat, lng, place.formatted_address)
          googleMapRef.current.setCenter({ lat, lng })
          markerRef.current.setPosition({ lat, lng })
        }
      })
    }

    // If initial location, reverse geocode
    if (selectedLocation) {
      reverseGeocode(selectedLocation.lat, selectedLocation.lng)
    }
  }, [darkMode, selectedLocation])

  // Update location and reverse geocode
  const updateLocation = (lat: number, lng: number, addr?: string) => {
    setSelectedLocation({ lat, lng })
    if (addr) {
      setAddress(addr)
    } else {
      reverseGeocode(lat, lng)
    }
  }

  // Reverse geocode to get address
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return

    try {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address)
        }
      })
    } catch (e) {
      console.error('Geocoding error:', e)
    }
  }

  // Detect current location
  const detectCurrentLocation = () => {
    setIsDetecting(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Location not supported')
      setIsDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setSelectedLocation({ lat, lng })
        
        if (googleMapRef.current) {
          googleMapRef.current.setCenter({ lat, lng })
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng })
          }
        }
        
        reverseGeocode(lat, lng)
        setIsDetecting(false)
      },
      (error) => {
        setError('Could not detect location. Please enable location permissions.')
        setIsDetecting(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Confirm selection
  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng, address)
      setShowMap(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Current Location Display */}
      <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
        <CardContent className="p-4">
          {selectedLocation ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Location Selected
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
                <Check className="w-6 h-6 text-green-600" />
              </div>
              
              {address && (
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    📍 {address}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Location Required
                </h3>
                <p className={`text-sm text-red-500`}>
                  Please detect or select location
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          className={`h-12 rounded-xl ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {isDetecting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Crosshair className="w-4 h-4 mr-2" />
              Detect Location
            </>
          )}
        </Button>
        
        <Button
          onClick={() => setShowMap(true)}
          variant="outline"
          className="h-12 rounded-xl"
        >
          <Map className="w-4 h-4 mr-2" />
          Select on Map
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex flex-col"
          >
            {/* Header */}
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-4 flex items-center gap-3`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMap(false)}
                className="rounded-xl"
              >
                <X className={darkMode ? 'text-white' : 'text-gray-700'} />
              </Button>
              <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Select Location
              </h2>
            </div>

            {/* Search Bar */}
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} px-4 pb-4`}>
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <Input
                  ref={inputRef}
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              {!mapLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : (
                <div 
                  ref={mapRef} 
                  className="w-full h-full"
                  style={{ minHeight: '300px' }}
                />
              )}
              
              {/* Center Pin Indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
                <div className="relative">
                  <MapPin className="w-10 h-10 text-orange-500 drop-shadow-lg" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                </div>
              </div>
            </div>

            {/* Selected Address */}
            {selectedLocation && (
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`p-3 rounded-xl mb-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    📍 {address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={detectCurrentLocation}
                    disabled={isDetecting}
                    className="flex-1 h-12 rounded-xl"
                  >
                    {isDetecting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Crosshair className="w-4 h-4 mr-2" />
                        My Location
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleConfirm}
                    className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
