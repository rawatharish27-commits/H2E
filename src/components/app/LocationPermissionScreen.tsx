'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Loader2, CheckCircle, AlertCircle, Navigation, HandHeart, ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/store'

interface LocationPermissionScreenProps {
  onGranted: () => void
}

export function LocationPermissionScreen({ onGranted }: LocationPermissionScreenProps) {
  const [status, setStatus] = useState<'prompt' | 'requesting' | 'granted' | 'denied'>('prompt')
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const { darkMode, setLocation, goBack } = useAppStore()

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setStatus('denied')
      return
    }

    setStatus('requesting')

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords
      setCoordinates({ lat: latitude, lng: longitude })
      setLocation({ lat: latitude, lng: longitude })
      setStatus('granted')

      try {
        localStorage.setItem('locationGranted', 'true')
      } catch {
        // Ignore
      }

      setTimeout(() => {
        onGranted()
      }, 1500)
    } catch {
      setStatus('denied')
    }
  }, [setLocation, onGranted])

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className="pt-8 px-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center"
          >
            <HandHeart className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help2Earn</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connecting People / लोगों को जोड़ना</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 w-full max-w-sm"
        >
          {/* Location Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
              status === 'granted' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : status === 'denied' 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-orange-100 dark:bg-orange-900/30'
            }`}
          >
            {status === 'requesting' ? (
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
            ) : status === 'granted' ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : status === 'denied' ? (
              <AlertCircle className="w-16 h-16 text-red-500" />
            ) : (
              <Navigation className="w-16 h-16 text-orange-500" />
            )}
          </motion.div>

          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {status === 'granted' 
              ? 'Location Enabled!' 
              : status === 'denied' 
                ? 'Location Access Denied' 
                : 'Enable Location'}
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {status === 'granted' 
              ? 'स्थान सक्षम हो गया!' 
              : status === 'denied' 
                ? 'स्थान पहुंच अस्वीकृत' 
                : 'स्थान सक्षम करें'}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-2xl rounded-3xl overflow-hidden`}>
            <div className={`h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500`} />
            <CardContent className="p-6">
              {status === 'prompt' && (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <MapPin className="w-8 h-8 text-orange-500" />
                    <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Location Access Required</span>
                  </div>
                  
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    This app requires location access to show nearby helpers within 20 km radius.
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    यह ऐप 20 किमी त्रिज्या में नजदीकी मददगार दिखाने के लिए स्थान चाहिए।
                  </p>

                  <div className={`mt-4 p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <strong>Why location?</strong> / स्थान क्यों?
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      • Find helpers within 20 km / 20 किमी में मददगार खोजें<br/>
                      • Show problems near you / पास की समस्याएं देखें<br/>
                      • Connect with local community / स्थानीय समुदाय से जुड़ें
                    </p>
                  </div>

                  <Button
                    onClick={requestLocation}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Enable Location / स्थान सक्षम करें
                  </Button>
                </div>
              )}

              {status === 'requesting' && (
                <div className="text-center space-y-4 py-4">
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Requesting location...</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Please allow location access when prompted</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>जब पूछा जाए तो स्थान की अनुमति दें</p>
                </div>
              )}

              {status === 'granted' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Location Enabled!</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>स्थान सक्षम हो गया!</p>
                  
                  {coordinates && (
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Location Detected</span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  )}
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Continuing...</p>
                </div>
              )}

              {status === 'denied' && (
                <div className="text-center space-y-4">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                  <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Location Access Denied</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>स्थान पहुंच अस्वीकृत</p>
                  
                  <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Without location, you won't be able to find helpers nearby.
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                      स्थान के बिना आप नजदीकी मददगार नहीं खोज पाएंगे।
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={requestLocation}
                      className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={onGranted}
                      variant="outline"
                      className="flex-1 h-12 rounded-xl font-bold"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
