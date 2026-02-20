'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2, Shield, AlertCircle, CheckCircle, HandHeart, User, MapPin, Navigation, Building, Home, Map, Eye, EyeOff, Lock, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store'

export function LoginScreen() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [village, setVillage] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { setScreen, darkMode, requestLocation, locationAddress, location, login, setUser } = useAppStore()

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

  // Check if user exists when phone number changes
  const checkUserExists = async (phoneNumber: string) => {
    if (phoneNumber.length === 10 && /^[6-9]\d{9}$/.test(phoneNumber)) {
      try {
        const res = await fetch(`/api/auth/check-user?phone=${phoneNumber}`)
        const data = await res.json()
        setIsNewUser(!data.exists)
      } catch {
        setIsNewUser(true)
      }
    }
  }

  // Handle phone change
  const handlePhoneChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 10)
    setPhone(cleanValue)
    setError('')
    
    if (cleanValue.length === 10) {
      checkUserExists(cleanValue)
    } else {
      setIsNewUser(false)
    }
  }

  // Handle Login (existing user)
  const handleLogin = async () => {
    setError('')
    
    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number / कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें')
      return
    }

    // Validate password
    if (!password || password.length < 4) {
      setError('Please enter a valid password (min 4 characters) / कृपया वैध पासवर्ड दर्ज करें (न्यूनतम 4 अक्षर)')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Store user data
        login(data.user)
        setUser(data.user)
        
        // Check subscription status
        if (data.user.paymentActive && data.user.activeTill && new Date(data.user.activeTill) > new Date()) {
          const hasSeenDashboard = localStorage.getItem('hasSeenDashboard')
          setScreen(hasSeenDashboard ? 'home' : 'dashboard')
        } else {
          setScreen('subscription')
        }
      } else {
        setError(data.error || 'Login failed. Please try again. / लॉगिन विफल।')
      }
    } catch {
      setError('Network error. Please check your connection. / नेटवर्क त्रुटि।')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Register (new user)
  const handleRegister = async () => {
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

    // Validate password
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters / पासवर्ड कम से कम 4 अक्षर का होना चाहिए')
      return
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match / पासवर्ड मेल नहीं खा रहे')
      return
    }

    // Validate at least city
    if (!city.trim()) {
      setError('Please enter your city / कृपया अपना शहर दर्ज करें')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          password,
          name: name.trim(),
          village: village.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          lat: location?.lat,
          lng: location?.lng
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setSuccess('Account created successfully! / खाता सफलतापूर्वक बनाया गया!')
        
        // Store user data
        login(data.user)
        setUser(data.user)
        
        // Navigate to subscription
        setTimeout(() => {
          setScreen('subscription')
        }, 1000)
      } else {
        if (data.error?.includes('already exists')) {
          setError('This mobile number is already registered. Please login. / यह मोबाइल नंबर पहले से पंजीकृत है।')
          setIsNewUser(false)
        } else {
          setError(data.error || 'Registration failed. Please try again. / पंजीकरण विफल।')
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
            {isNewUser ? 'Create Account' : 'Login'}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isNewUser ? 'नया खाता बनाएं' : 'अपना खाता एक्सेस करें'}
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
                {/* Name Input - Only for new user */}
                {isNewUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
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
                  </motion.div>
                )}

                {/* Phone Input */}
                <div>
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                    Mobile Number (User ID) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`pl-12 h-11 text-base rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                      maxLength={10}
                      disabled={isLoading}
                    />
                    {phone.length === 10 && /^[6-9]\d{9}$/.test(phone) && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {phone.length === 10 && (
                    <p className={`text-xs mt-1 ${isNewUser ? 'text-orange-500' : 'text-green-500'}`}>
                      {isNewUser ? '📱 New user - Please register' : '✓ User found - Please login'}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError('')
                      }}
                      className={`pl-10 pr-10 h-11 text-base rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                      maxLength={30}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password - Only for new user */}
                {isNewUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setError('')
                        }}
                        className={`pl-10 h-11 text-base rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                        maxLength={30}
                        disabled={isLoading}
                      />
                      {confirmPassword && password === confirmPassword && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Location & Address Fields - Only for new user */}
                {isNewUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
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
                  </motion.div>
                )}

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
                  
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <p className="text-green-600 text-xs">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={isNewUser ? handleRegister : handleLogin}
                    disabled={isLoading || phone.length !== 10 || !password}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isNewUser ? 'Creating Account...' : 'Logging in...'}</span>
                      </div>
                    ) : (
                      <>
                        {isNewUser ? 'Create Account' : 'Login'} <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Toggle between Login/Register */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewUser(!isNewUser)
                      setError('')
                      setSuccess('')
                    }}
                    className={`text-sm ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}
                  >
                    {isNewUser ? 'Already have an account? Login / पहले से खाता है? लॉगिन करें' : "Don't have an account? Register / खाता नहीं है? पंजीकरण करें"}
                  </button>
                </div>
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
          <span className="text-xs">Secure login with mobile number & password</span>
        </motion.div>
      </div>
    </div>
  )
}
