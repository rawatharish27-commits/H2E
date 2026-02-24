'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2, HandHeart } from 'lucide-react'
import { useAppStore } from '@/store'

interface OtpScreenProps {
  phone: string
}

export function OtpScreen({ phone }: OtpScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { setUser, setToken, setScreen, darkMode, tempReferralCode, usedReferralCode, loginName } = useAppStore()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Auto-submit when complete
    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      // Small delay for better UX
      setTimeout(() => handleVerify(newOtp.join('')), 300)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('')
    setError('')
    
    if (code.length !== 6) {
      setError('Please enter complete OTP / कृपया पूरा OTP दर्ज करें')
      return
    }

    setIsLoading(true)
    
    // Get name from store or sessionStorage
    const name = loginName || sessionStorage.getItem('loginName') || ''
    
    // Get referral codes
    const referralCode = usedReferralCode || localStorage.getItem('usedReferralCode') || null
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          otp: code, 
          name: name,
          referralCode,
          tempReferralCode
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setUser(data.user)
        setToken(data.token)
        
        // Clear temp data
        localStorage.removeItem('usedReferralCode')
        sessionStorage.removeItem('loginName')
        
        // Go to subscription screen (payment required)
        if (data.user.paymentActive && data.user.activeTill && new Date(data.user.activeTill) > new Date()) {
          setScreen('home')
        } else {
          setScreen('subscription')
        }
      } else {
        setError(data.error || 'Invalid OTP / अमान्य OTP')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Something went wrong. Please try again. / कुछ गलत हो गया।')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setCountdown(30)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    setError('')
    
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
    } catch {
      setError('Failed to resend OTP / OTP पुनः भेजने में विफल')
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 to-white'}`}>
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setScreen('login')}
          className={`p-2 ${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-700'}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-6"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center"
          >
            <HandHeart className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verify OTP</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            OTP सत्यापित करें
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter the code sent to <span className="font-semibold">+91 {phone}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-0'} shadow-xl rounded-2xl`}>
            <CardContent className="p-6">
              {/* OTP Inputs */}
              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-11 h-14 text-center text-xl font-bold rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200 text-gray-900'} focus:border-orange-500 focus:ring-orange-500`}
                    disabled={isLoading}
                  />
                ))}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-sm text-center mb-4"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                onClick={() => handleVerify()}
                disabled={isLoading || otp.some(d => !d)}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify & Continue / जारी रखें'
                )}
              </Button>

              {/* Resend */}
              <div className="mt-4 text-center">
                {canResend ? (
                  <Button
                    variant="link"
                    onClick={handleResend}
                    className="text-orange-600"
                  >
                    Resend OTP / OTP पुनः भेजें
                  </Button>
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Resend in <span className="font-semibold">{countdown}s</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
        >
          <p>Your referral code: <span className="font-bold text-orange-500">{tempReferralCode}</span></p>
          <p className="text-xs mt-1">Will become permanent after verification</p>
        </motion.div>
      </div>
    </div>
  )
}
