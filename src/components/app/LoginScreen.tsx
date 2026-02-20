'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Loader2, Shield, AlertCircle, CheckCircle, HandHeart, User } from 'lucide-react'
import { useAppStore } from '@/store'

export function LoginScreen() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setScreen, setLoginPhone, setLoginName, darkMode } = useAppStore()

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

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Store both name and phone
        sessionStorage.setItem('loginPhone', phone)
        sessionStorage.setItem('loginName', name.trim())
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center"
          >
            <HandHeart className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
            Login with Mobile
          </h2>
          <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            मोबाइल से लॉगिन करें
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
            We'll send you an OTP to verify
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-2xl rounded-3xl overflow-hidden`}>
            <div className={`h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500`} />
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-2`}>आपका नाम</p>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        setError('')
                      }}
                      className={`pl-12 h-14 text-lg rounded-2xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                      maxLength={50}
                      disabled={isLoading}
                    />
                    {name.trim().length >= 2 && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-2`}>मोबाइल नंबर</p>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                        setError('')
                      }}
                      className={`pl-14 h-14 text-lg rounded-2xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                      maxLength={10}
                      disabled={isLoading}
                    />
                    {phone.length === 10 && /^[6-9]\d{9}$/.test(phone) && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                    We'll send you a 6-digit OTP / हम आपको 6 अंकों का OTP भेजेंगे
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-600 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || phone.length !== 10 || name.trim().length < 2}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50 transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      <>
                        Get OTP <ArrowRight className="w-5 h-5 ml-2" />
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
          className={`mt-6 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm">Secure login with OTP verification</span>
        </motion.div>
        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
          OTP वेरिफिकेशन के साथ सुरक्षित लॉगिन
        </p>
      </div>
    </div>
  )
}
