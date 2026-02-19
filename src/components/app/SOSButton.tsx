'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, X, MapPin, Loader2 } from 'lucide-react'

interface SOSButtonProps {
  userId?: string
  onTrigger?: () => void
  darkMode?: boolean
}

export function SOSButton({ userId, onTrigger, darkMode = false }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [holdTime, setHoldTime] = useState(0)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleMouseDown = () => {
    setIsPressed(true)
    setHoldTime(0)
    
    // Start counting hold time
    const interval = setInterval(() => {
      setHoldTime(prev => {
        if (prev >= 3) {
          clearInterval(interval)
          return 3
        }
        return prev + 0.1
      })
    }, 100)
    
    // Store interval ID to clear on mouse up
    ;(window as unknown as { sosInterval?: NodeJS.Timeout }).sosInterval = interval
  }

  const handleMouseUp = async () => {
    const interval = (window as unknown as { sosInterval?: NodeJS.Timeout }).sosInterval
    if (interval) {
      clearInterval(interval)
    }
    
    setIsPressed(false)
    
    if (holdTime >= 3 && !isActivated) {
      await triggerSOS()
    }
    
    setHoldTime(0)
  }

  const triggerSOS = async () => {
    setIsActivated(true)
    setIsSending(true)
    
    try {
      // Get current location
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
          })
        })
        
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        
        // Send SOS to server
        const response = await fetch('/api/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            message: 'Emergency help needed'
          })
        })
        
        if (response.ok) {
          onTrigger?.()
        }
      }
    } catch (error) {
      console.error('SOS Error:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleCancel = () => {
    setIsActivated(false)
    setLocation(null)
  }

  if (isActivated) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        >
          <div className={`w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 text-center`}>
            {isSending ? (
              <>
                <Loader2 className="w-16 h-16 mx-auto text-red-500 animate-spin mb-4" />
                <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sending SOS...
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Please wait while we alert nearby users
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  SOS Activated!
                </h2>
                {location && (
                  <div className={`flex items-center justify-center gap-1 text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <MapPin className="w-4 h-4" />
                    <span>Location shared</span>
                  </div>
                )}
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Nearby trusted users have been notified. Help is on the way.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:100"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-500 text-white rounded-xl font-medium"
                  >
                    <Phone className="w-5 h-5" />
                    Call Police (100)
                  </a>
                  <button
                    onClick={handleCancel}
                    className={`w-full py-3 rounded-xl font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Cancel SOS
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="relative">
      <motion.button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        whileTap={{ scale: 0.95 }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPressed 
            ? 'bg-red-600 shadow-lg shadow-red-500/50' 
            : 'bg-gradient-to-br from-red-500 to-red-600 shadow-md'
        }`}
      >
        <AlertTriangle className="w-6 h-6 text-white" />
        
        {/* Hold progress ring */}
        {isPressed && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 56 56"
          >
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray={`${(holdTime / 3) * 163} 163`}
              className="transition-all duration-100"
            />
          </svg>
        )}
      </motion.button>
      
      {/* Hold instruction tooltip */}
      {isPressed && holdTime < 3 && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
            Hold for {Math.ceil(3 - holdTime)}s
          </div>
        </div>
      )}
    </div>
  )
}

interface SOSFloatingButtonProps {
  darkMode?: boolean
}

export function SOSFloatingButton({ darkMode = false }: SOSFloatingButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div 
      className="fixed bottom-24 right-4 z-50"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 right-0 whitespace-nowrap">
          <div className={`px-3 py-2 rounded-lg text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
            <div className="font-medium">Emergency SOS</div>
            <div className="opacity-70">Hold 3 sec to activate</div>
          </div>
        </div>
      )}
      
      <SOSButton darkMode={darkMode} />
    </div>
  )
}
