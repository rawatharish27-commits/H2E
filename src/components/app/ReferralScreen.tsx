'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight,
  Gift,
  AlertCircle,
  Loader2,
  Shield,
  Users,
  CheckCircle2,
  HandHeart
} from 'lucide-react'
import { useAppStore } from '@/store'

interface ReferralScreenProps {
  isMandatory?: boolean
}

export function ReferralScreen({ isMandatory = true }: ReferralScreenProps) {
  const { setScreen, setReferralCode } = useAppStore()
  const [referralInput, setReferralInput] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const handleVerifyReferral = async () => {
    setError('')
    
    // Validate referral code format
    const code = referralInput.trim().toUpperCase()
    
    if (!code) {
      setError('Please enter a referral code / कृपया रेफरल कोड दर्ज करें')
      return
    }
    
    if (code.length < 6) {
      setError('Invalid referral code / अमान्य रेफरल कोड')
      return
    }
    
    // Check format (H2E-XXXXX or TEMP-XXXXX)
    if (!code.startsWith('H2E-') && !code.startsWith('TEMP-')) {
      setError('Invalid code format. Code should start with H2E- / अमान्य कोड प्रारूप')
      return
    }
    
    setIsVerifying(true)
    
    try {
      // Verify referral code with backend
      const res = await fetch('/api/referral/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Store the referral code
        setReferralCode(code)
        setSuccess(true)
        
        // Save to localStorage
        localStorage.setItem('usedReferralCode', code)
        localStorage.setItem('hasSeenReferral', 'true')
        
        // Wait a moment to show success, then proceed
        setTimeout(() => {
          setScreen('login')
        }, 1500)
      } else {
        setError(data.error || 'Invalid referral code / अमान्य रेफरल कोड')
      }
    } catch (err) {
      console.error('Referral verify error:', err)
      setError('Something went wrong. Please try again. / कुछ गलत हो गया। पुनः प्रयास करें।')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${isMandatory ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className="pt-8 px-6">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center"
          >
            <HandHeart className="w-7 h-7 text-orange-500" />
          </motion.div>
          <div>
            <h1 className={`text-2xl font-bold ${isMandatory ? 'text-white' : 'text-gray-900'}`}>Help2Earn</h1>
            <p className={`text-sm ${isMandatory ? 'text-white/80' : 'text-gray-500'}`}>Connecting People / लोगों को जोड़ना</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`w-32 h-32 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
              success ? 'bg-green-100' : isMandatory ? 'bg-white/20' : 'bg-orange-100'
            }`}
          >
            {success ? (
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            ) : (
              <Gift className={`w-16 h-16 ${isMandatory ? 'text-white' : 'text-orange-500'}`} />
            )}
          </motion.div>

          <h2 className={`text-2xl font-bold ${isMandatory ? 'text-white' : 'text-gray-900'} mb-2`}>
            {success ? 'Referral Verified!' : 'Enter Referral Code'}
          </h2>
          <p className={`text-lg ${isMandatory ? 'text-white/90' : 'text-gray-600'}`}>
            {success ? 'रेफरल वेरिफाइड!' : 'रेफरल कोड दर्ज करें'}
          </p>
          
          {isMandatory && !success && (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm`}>
              <Shield className="w-4 h-4" />
              <span>Mandatory Step / अनिवार्य चरण</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <Card className={`${isMandatory ? 'bg-white border-0' : 'bg-white border-orange-100'} shadow-2xl rounded-3xl overflow-hidden`}>
            <div className={`h-1.5 ${success ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500'}`} />
            <CardContent className="p-6">
              {success ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-4"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="font-bold text-lg text-gray-900">Code Verified!</p>
                  <p className="text-sm text-gray-500">कोड वेरिफाइड हो गया!</p>
                  <p className="text-xs text-gray-400 mt-2">Redirecting to login...</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <Users className={`w-10 h-10 mx-auto mb-2 ${isMandatory ? 'text-orange-500' : 'text-orange-500'}`} />
                    <p className={`text-sm ${isMandatory ? 'text-gray-600' : 'text-gray-600'}`}>
                      Ask your friend for their referral code
                    </p>
                    <p className="text-xs text-gray-400">
                      अपने दोस्त से उनका रेफरल कोड मांगें
                    </p>
                  </div>

                  {/* Referral Code Input */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Referral Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="H2E-XXXXX"
                      value={referralInput}
                      onChange={(e) => {
                        setReferralInput(e.target.value.toUpperCase())
                        setError('')
                      }}
                      className="h-14 text-lg text-center uppercase font-mono tracking-wider rounded-2xl border-2 focus:border-orange-500"
                      maxLength={12}
                      disabled={isVerifying}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      Format: H2E-XXXXX or TEMP-XXXXX
                    </p>
                  </div>

                  {/* Error Message */}
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

                  {/* Info Box */}
                  <div className={`p-4 rounded-2xl ${isMandatory ? 'bg-orange-50' : 'bg-orange-50'}`}>
                    <p className="text-sm text-gray-700 font-medium mb-2">
                      Why referral is required?
                    </p>
                    <p className="text-xs text-gray-500">
                      Help2Earn is a community-based platform. Referral ensures trusted members in our network.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      रेफरल से हमारे नेटवर्क में विश्वसनीय सदस्य सुनिश्चित होते हैं।
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleVerifyReferral}
                    disabled={isVerifying || !referralInput.trim()}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <>
                        Verify & Continue <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  {isMandatory && (
                    <p className="text-center text-xs text-gray-400 mt-2">
                      This step is mandatory / यह चरण अनिवार्य है
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Section */}
        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-6 text-center ${isMandatory ? 'text-white/80' : 'text-gray-500'}`}
          >
            <p className="text-sm mb-2">
              Don't have a referral code?
            </p>
            <p className="text-xs">
              Ask any Help2Earn user or contact support
            </p>
            <p className="text-xs mt-1">
              कोई भी Help2Earn यूज़र से पूछें या सपोर्ट से संपर्क करें
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
