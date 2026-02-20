'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Loader2, Shield, AlertCircle, CheckCircle, HandHeart, User, MapPin, Navigation, Building, Home, Map } from 'lucide-react'
import { useAppStore } from '@/store'

export function LoginScreen() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [village, setVillage] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [error, setError] = useState('')
  
  const { setScreen, setLoginPhone, setLoginName, darkMode, requestLocation, locationAddress, location } = useAppStore()

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation()
  }, [])

  // Update address fields when locationAddress changes
  useEffect(() => {
    if (locationAddress) {
      if (locationAddress.village) setVillage(locationAddress.village)
      if (locationAddress.city) setCity(locationAddress.city)
      if (locationAddress.state) setState(locationAddress.state)
      if (locationAddress.pincode) setPincode(locationAddress.pincode)
    }
  }, [locationAddress])

  const detectLocation = async () => {
    setIsDetectingLocation(true)
    await requestLocation()
    setIsDetectingLocation(false)
  }

  const handleSendOtp = async () => {
    setError('')
    
    // Validate name
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters) / कृपया अपना नाम दर्ज करें (कम से कम 2 अक्षर)')
      return
    }
    
    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number / कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें')
      return
    }

    // Validate at least city
    if (!city.trim()) {
      setError('Please enter your city / कृपया अपना शहर दर्ज करें')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Store name, phone and address
        sessionStorage.setItem('loginPhone', phone)
        sessionStorage.setItem('loginName', name.trim())
        sessionStorage.setItem('loginVillage', village.trim())
        sessionStorage.setItem('loginCity', city.trim())
        sessionStorage.setItem('loginState', state.trim())
        sessionStorage.setItem('loginPincode', pincode.trim())
        setLoginPhone(phone)
        setLoginName(name.trim())
        // Navigate to OTP screen
        setScreen('otp')
      } else {
        // Handle specific error messages
        if (data.error?.includes('Too many')) {
          setError(data.error)
        } else if (data.error?.includes('banned')) {
          setError('This number is not allowed on our platform / यह नंबर हमारे प्लेटफॉर्म पर अनुमत नहीं है')
        } else if (data.error?.includes('restricted')) {
          setError('Account temporarily restricted. Contact support. / खाता अस्थायी रूप से प्रतिबंधित।')
        } else {
          setError(data.error || 'Failed to send OTP. Please try again. / OTP भेजने में विफल।')
        }
      }
    } catch {
      setError('Network error. Please check your connection. / नेटवर्क त्रुटि।')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className="pt-4 px-4">
        <Button
          variant="ghost"
          onClick={() => setScreen('pre-login-share')}
          className={`p-2 ${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-700'}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 py-2 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center"
          >
            <HandHeart className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
            Login with Mobile
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            मोबाइल से लॉगिन करें
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-xl rounded-2xl overflow-hidden`}>
            <div className={`h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500`} />
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Name Input */}
                <div>
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        setError('')
                      }}
                      className={`pl-10 h-11 text-base rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                      maxLength={50}
                      disabled={isLoading}
                    />
                    {name.trim().length >= 2 && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                        setError('')
                      }}
                      className={`pl-12 h-11 text-base rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                      maxLength={10}
                      disabled={isLoading}
                    />
                    {phone.length === 10 && /^[6-9]\d{9}$/.test(phone) && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Location Detection */}
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-orange-50'} border ${darkMode ? 'border-gray-600' : 'border-orange-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Location</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                      className="h-8 px-3 text-xs"
                    >
                      {isDetectingLocation ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3 mr-1" />
                      )}
                      {isDetectingLocation ? 'Detecting...' : 'Detect'}
                    </Button>
                  </div>
                  
                  {location && (
                    <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} flex items-center gap-1`}>
                      <CheckCircle className="w-3 h-3" />
                      Location detected
                    </p>
                  )}
                </div>

                {/* Address Fields */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Village/Colony */}
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1 block`}>
                      Village/Colony
                    </label>
                    <div className="relative">
                      <Home className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <Input
                        placeholder="Village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className={`pl-8 h-9 text-sm rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900'}`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  {/* City */}
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1 block`}>
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <Input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`pl-8 h-9 text-sm rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900'}`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  {/* State */}
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1 block`}>
                      State
                    </label>
                    <div className="relative">
                      <Map className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <Input
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={`pl-8 h-9 text-sm rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900'}`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  {/* Pincode */}
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1 block`}>
                      Pin Code
                    </label>
                    <Input
                      placeholder="Pin code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className={`h-9 text-sm rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900'}`}
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-600 text-xs">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || phone.length !== 10 || name.trim().length < 2 || !city.trim()}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      <>
                        Get OTP <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-xs">Secure login with OTP verification</span>
        </motion.div>
      </div>
    </div>
  )
}
