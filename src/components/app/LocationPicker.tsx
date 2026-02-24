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
  Check, 
  X,
  Crosshair,
  Map,
  Search
} from 'lucide-react'
import { useAppStore } from '@/store'

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  initialLocation?: { lat: number; lng: number } | null
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const { darkMode } = useAppStore()
  const [isDetecting, setIsDetecting] = useState(false)
  const [address, setAddress] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation)
  const [showMap, setShowMap] = useState(false)
  const [error, setError] = useState('')
  
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Detect current location
  const detectCurrentLocation = useCallback(() => {
    setIsDetecting(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Location not supported / स्थान समर्थित नहीं है')
      setIsDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setSelectedLocation({ lat, lng })
        reverseGeocode(lat, lng)
        setIsDetecting(false)
        
        // Update map if open
        if (leafletMapRef.current && markerRef.current) {
          leafletMapRef.current.setView([lat, lng], 15)
          markerRef.current.setLatLng([lat, lng])
        }
      },
      (err) => {
        setError('Could not detect location. Please enable location permissions. / स्थान का पता नहीं लगाया जा सका')
        setIsDetecting(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [])

  // Reverse geocode to get address using Nominatim (free, no API key)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Help2Earn-App/1.0'
          }
        }
      )
      const data = await response.json()
      if (data.display_name) {
        setAddress(data.display_name)
      }
    } catch (e) {
      console.error('Geocoding error:', e)
    }
  }

  // Initialize map
  useEffect(() => {
    if (!showMap || !mapRef.current || leafletMapRef.current) return

    const initMap = async () => {
      try {
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')

        const center = selectedLocation || { lat: 28.6139, lng: 77.2090 } // Default: Delhi

        // Create map
        const map = L.map(mapRef.current!, {
          center: [center.lat, center.lng],
          zoom: 15,
          zoomControl: true
        })

        // Add tile layer
        const tileUrl = darkMode
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

        L.tileLayer(tileUrl, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19
        }).addTo(map)

        // Add draggable marker
        const marker = L.marker([center.lat, center.lng], {
          draggable: true
        }).addTo(map)

        marker.on('dragend', (e: any) => {
          const pos = e.target.getLatLng()
          setSelectedLocation({ lat: pos.lat, lng: pos.lng })
          reverseGeocode(pos.lat, pos.lng)
        })

        // Click on map to set location
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng
          setSelectedLocation({ lat, lng })
          marker.setLatLng([lat, lng])
          reverseGeocode(lat, lng)
        })

        leafletMapRef.current = map
        markerRef.current = marker

        // If we have initial location, get address
        if (selectedLocation) {
          reverseGeocode(selectedLocation.lat, selectedLocation.lng)
        }
      } catch (error) {
        console.error('Failed to load map:', error)
      }
    }

    initMap()

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        markerRef.current = null
      }
    }
  }, [showMap, darkMode])

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
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Location Selected / स्थान चुना गया
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
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Location Required / स्थान आवश्यक है
                </h3>
                <p className="text-sm text-red-500">
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
                Select Location / स्थान चुनें
              </h2>
            </div>

            {/* Instructions */}
            <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} px-4 py-2 border-b`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                👆 Tap on map or drag marker to set location
              </p>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <div 
                ref={mapRef} 
                className="w-full h-full"
                style={{ minHeight: '300px' }}
              />
              
              {/* Center Pin Indicator (shown before map loads) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none opacity-0">
                <MapPin className="w-10 h-10 text-orange-500 drop-shadow-lg" />
              </div>
            </div>

            {/* Selected Address & Actions */}
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {selectedLocation && (
                <div className={`p-3 rounded-xl mb-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    📍 {address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                  </p>
                </div>
              )}
              
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
                  disabled={!selectedLocation}
                  className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm / पुष्टि करें
                </Button>
              </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
              .leaflet-container {
                font-family: inherit !important;
              }
              .leaflet-popup-content-wrapper {
                border-radius: 12px !important;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
