'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Problem, ProblemType, formatDistance, calculateDistance } from '@/types'

// Using Leaflet with OpenStreetMap (free, no API key required)
// This is a better alternative than Google Maps placeholder

interface GoogleMapComponentProps {
  problems: Problem[]
  userLocation: { lat: number; lng: number }
  onMarkerClick?: (problem: Problem) => void
  darkMode?: boolean
  selectedProblem?: Problem | null
  radiusKm?: number
}

interface MapMarker {
  problem: Problem
  element: HTMLDivElement
}

export function GoogleMapComponent({
  problems,
  userLocation,
  onMarkerClick,
  darkMode = false,
  selectedProblem,
  radiusKm = 20
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null)
  const markersRef = useRef<MapMarker[]>([])
  const userMarkerRef = useRef<L.CircleMarker | null>(null)
  const radiusCircleRef = useRef<L.Circle | null>(null)

  // Get marker color based on problem type
  const getMarkerColor = (type: ProblemType): string => {
    switch (type) {
      case 'EMERGENCY':
        return '#ef4444' // red
      case 'TIME_ACCESS':
        return '#3b82f6' // blue
      case 'RESOURCE_RENT':
        return '#22c55e' // green
      default:
        return '#f97316' // orange
    }
  }

  // Get marker icon emoji based on problem type
  const getMarkerIcon = (type: ProblemType): string => {
    switch (type) {
      case 'EMERGENCY':
        return '🆘'
      case 'TIME_ACCESS':
        return '⏰'
      case 'RESOURCE_RENT':
        return '📦'
      default:
        return '📍'
    }
  }

  // Create custom marker element
  const createMarkerElement = (problem: Problem, isSelected: boolean): HTMLDivElement => {
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${isSelected ? '44px' : '36px'};
      height: ${isSelected ? '44px' : '36px'};
      background: ${getMarkerColor(problem.type)};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: ${isSelected ? 1000 : 1};
    `
    
    const icon = document.createElement('span')
    icon.style.cssText = `
      transform: rotate(45deg);
      font-size: ${isSelected ? '18px' : '14px'};
    `
    icon.textContent = getMarkerIcon(problem.type)
    el.appendChild(icon)
    
    return el
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMap) return

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')

        // Create map
        const map = L.map(mapRef.current!, {
          center: [userLocation.lat, userLocation.lng],
          zoom: 13,
          zoomControl: true,
          attributionControl: true
        })

        // Add tile layer (OpenStreetMap)
        const tileUrl = darkMode
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

        L.tileLayer(tileUrl, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19
        }).addTo(map)

        // Add user location marker (blue dot)
        const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
          radius: 10,
          fillColor: '#3b82f6',
          color: '#fff',
          weight: 3,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map)

        userMarker.bindPopup('<b>Your Location</b><br/>आपका स्थान')
        userMarkerRef.current = userMarker

        // Add 20 KM radius circle
        const radiusCircle = L.circle([userLocation.lat, userLocation.lng], {
          radius: radiusKm * 1000, // Convert km to meters
          fillColor: '#3b82f6',
          color: '#3b82f6',
          weight: 2,
          opacity: 0.3,
          fillOpacity: 0.1
        }).addTo(map)

        radiusCircle.bindPopup(`<b>Search Area</b><br/>${radiusKm} KM radius`)
        radiusCircleRef.current = radiusCircle

        setLeafletMap(map)
        setMapLoaded(true)
      } catch (error) {
        console.error('Failed to load map:', error)
      }
    }

    initMap()

    return () => {
      if (leafletMap) {
        leafletMap.remove()
        setLeafletMap(null)
      }
    }
  }, [userLocation.lat, userLocation.lng, radiusKm])

  // Update map theme when darkMode changes
  useEffect(() => {
    if (!leafletMap) return

    const updateTiles = async () => {
      const L = await import('leaflet')
      
      // Remove existing tile layers
      leafletMap.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          leafletMap.removeLayer(layer)
        }
      })

      // Add new tile layer with correct theme
      const tileUrl = darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(leafletMap)
    }

    updateTiles()
  }, [darkMode, leafletMap])

  // Add problem markers
  useEffect(() => {
    if (!leafletMap || !mapLoaded) return

    const addMarkers = async () => {
      const L = await import('leaflet')

      // Clear existing markers
      markersRef.current.forEach(({ element }) => {
        element.remove()
      })
      markersRef.current = []

      // Add new markers
      problems.forEach((problem) => {
        const isSelected = selectedProblem?.id === problem.id
        const el = createMarkerElement(problem, isSelected)

        // Create custom icon
        const icon = L.divIcon({
          html: el.outerHTML,
          className: 'custom-marker-container',
          iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
          iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36]
        })

        const marker = L.marker([problem.lat, problem.lng], { icon })
          .addTo(leafletMap)

        // Calculate distance
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          problem.lat,
          problem.lng
        )

        // Popup content
        const popupContent = `
          <div style="min-width: 200px; padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${problem.title}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
              ${problem.description?.substring(0, 100) || ''}${problem.description && problem.description.length > 100 ? '...' : ''}
            </div>
            <div style="display: flex; gap: 8px; font-size: 12px;">
              <span>📍 ${formatDistance(distance)}</span>
              <span>💰 ${problem.offerPrice ? `₹${problem.offerPrice}` : 'Negotiable'}</span>
            </div>
          </div>
        `

        marker.bindPopup(popupContent)

        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(problem)
          }
        })

        markersRef.current.push({
          problem,
          element: el
        })
      })
    }

    addMarkers()
  }, [leafletMap, mapLoaded, problems, selectedProblem, onMarkerClick, userLocation])

  // Center map on user location
  const centerOnUser = useCallback(() => {
    if (leafletMap) {
      leafletMap.setView([userLocation.lat, userLocation.lng], 13)
    }
  }, [leafletMap, userLocation])

  // Center on selected problem
  useEffect(() => {
    if (leafletMap && selectedProblem) {
      leafletMap.setView([selectedProblem.lat, selectedProblem.lng], 15)
    }
  }, [leafletMap, selectedProblem])

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '300px', background: darkMode ? '#1f2937' : '#f3f4f6' }}
      />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Map load ho raha hai...</p>
          </div>
        </div>
      )}

      {/* Center Button */}
      {mapLoaded && (
        <button
          onClick={centerOnUser}
          className={`absolute bottom-4 right-4 p-3 rounded-xl shadow-lg transition-all ${
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}
          title="Center on your location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          </svg>
        </button>
      )}

      {/* Legend */}
      {mapLoaded && (
        <div className={`absolute top-4 left-4 p-3 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-gray-200'
        }`}>
          <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Problem Types
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Emergency</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Time/Access</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Resource</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-300" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your Location</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .custom-marker-container {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
        }
        .leaflet-popup-content {
          margin: 8px 12px !important;
        }
        .leaflet-container {
          font-family: inherit !important;
        }
      `}</style>
    </div>
  )
}
