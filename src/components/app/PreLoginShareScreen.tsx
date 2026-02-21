'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Share2, 
  MessageCircle, 
  Send, 
  Copy,
  Gift,
  Users,
  Check,
  ArrowRight,
  HandHeart,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { useAppStore } from '@/store'

export function PreLoginShareScreen() {
  const { tempReferralCode, setScreen, darkMode } = useAppStore()
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [referralInput, setReferralInput] = useState('')
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  
  const shareMessage = `🤝 Community Help Network - Madad karke kamaayein!
मदद करके कमाई करो!

📍 20 KM में मददगार खोजो
💰 ₹100-₹500 per help कमाओ
📞 डायरेक्ट फोन पे बात करो

🔗 Download: https://communityhelpnetwork.app
📝 My Referral Code: ${tempReferralCode}

मदद करो, कमाई करो! 💰`
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
    window.open(url, '_blank')
    setShared(true)
  }
  
  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?text=${encodeURIComponent(shareMessage)}`
    window.open(url, '_blank')
    setShared(true)
  }

  const handleYouTubeShare = () => {
    // Copy message and open YouTube
    navigator.clipboard.writeText(shareMessage)
    window.open('https://youtube.com', '_blank')
    setShared(true)
  }
  
  const handleContinue = async () => {
    // Mark that user has completed welcome flow
    localStorage.setItem('hasSeenWelcome', 'true')
    
    // If user has a referral code, verify it first
    if (referralInput.trim()) {
      setIsVerifying(true)
      setError('')
      
      try {
        const res = await fetch('/api/referral/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: referralInput.trim().toUpperCase() })
        })
        
        const data = await res.json()
        
        if (data.success) {
          // Store the used referral code
          localStorage.setItem('usedReferralCode', referralInput.trim().toUpperCase())
          setScreen('login')
        } else {
          setError(data.error || 'Invalid referral code')
        }
      } catch {
        setError('Failed to verify code. Please try again.')
      } finally {
        setIsVerifying(false)
      }
    } else {
      // No referral code entered, proceed to login
      // User will need to enter referral code later
      setScreen('login')
    }
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 to-white'}`}>
      {/* Header */}
      <header className="pt-6 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setScreen('welcome')}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center"
          >
            <HandHeart className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Community Help Network</span>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Share & Earn / शेयर करो और कमाओ</p>
          </div>
        </div>
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
          Step 1 of 3
        </Badge>
      </header>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-xl">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Share Before Login!
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Login se pehle apna code share karo
          </p>
        </motion.div>

        {/* Your Referral Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className={`overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border-0`}>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white text-center">
              <p className="text-sm opacity-90 mb-1">Your Temporary Code</p>
              <p className="text-3xl font-bold tracking-wider">{tempReferralCode}</p>
              <p className="text-xs opacity-75 mt-1">Share karo, rewards kamao!</p>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Share to earn rewards</span>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <Users className="w-3 h-3 mr-1" />
                  Per Referral: +7 Days
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button
              onClick={handleWhatsAppShare}
              className="h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              onClick={handleTelegramShare}
              className="h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold"
            >
              <Send className="w-5 h-5 mr-2" />
              Telegram
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleYouTubeShare}
              variant="outline"
              className="h-12 rounded-xl"
            >
              <Share2 className="w-4 h-4 mr-2" />
              YouTube
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="h-12 rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Have a Referral Code? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-0`}>
            <CardContent className="p-4">
              <p className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Have a Referral Code? / किसी का कोड है?
              </p>
              <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter friend's code to get bonus days
              </p>
              
              <div className="flex gap-2">
                <Input
                  placeholder="H2E-XXXXX"
                  value={referralInput}
                  onChange={(e) => {
                    setReferralInput(e.target.value.toUpperCase())
                    setError('')
                  }}
                  className="flex-1 h-12 uppercase"
                  maxLength={12}
                />
                <Button
                  variant="outline"
                  className="h-12 px-4"
                  onClick={handleContinue}
                  disabled={isVerifying || !referralInput.trim()}
                >
                  Apply
                </Button>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} border-0`}>
            <CardContent className="p-4">
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Why share before login?
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Your referrals tracked automatically / आपके रेफरल अपने आप ट्रैक
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Earn +7 days per referral / हर रेफरल पर +7 दिन
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Code becomes permanent after login / लॉगिन के बाद कोड परमानेंट होगा
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!shared || isVerifying}
          className={`w-full h-14 rounded-2xl font-bold text-lg shadow-xl ${
            shared 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {isVerifying ? (
            'Verifying...'
          ) : shared ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Continue to Login / लॉगिन करें
            </>
          ) : (
            <>
              🔒 Share First to Unlock / पहले शेयर करें
            </>
          )}
        </Button>
        
        {!shared && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-orange-600 dark:text-orange-400 mt-2"
          >
            ⚠️ Apna code share karo, tab hi login kar sakte ho!
          </motion.p>
        )}
        
        {shared && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-green-600 dark:text-green-400 mt-2"
          >
            🎉 Great! Your code is being tracked
          </motion.p>
        )}
      </div>
      
      {/* Copyright Footer */}
      <footer className="pb-4 text-center">
        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © Harish Rawat
        </p>
      </footer>
    </div>
  )
}
