'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
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
  Sparkles,
  Lock,
  Clock,
  Star,
  Zap
} from 'lucide-react'
import { useAppStore } from '@/store'

export function PreLoginShareScreen() {
  const { tempReferralCode, setScreen, darkMode } = useAppStore()
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [referralInput, setReferralInput] = useState('')
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [shareCount, setShareCount] = useState(0)
  const [shareProgress, setShareProgress] = useState(0)
  
  // Required shares before login unlocks
  const REQUIRED_SHARES = 1
  const REWARD_DAYS = 30 // 1 month free

  // Load share count from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem('shareCount')
    const savedProgress = localStorage.getItem('shareProgress')
    if (savedCount) {
      const count = parseInt(savedCount)
      setShareCount(count)
      setShared(count >= REQUIRED_SHARES)
    }
    if (savedProgress) {
      setShareProgress(parseInt(savedProgress))
    }
  }, [])
  
  const shareMessage = `🤝 Help2Earn - Madad karke kamaayein!
मदद करके कमाई करो!

📍 20 KM में मददगार खोजो
💰 ₹100-₹500 per help कमाओ
📞 डायरेक्ट फोन पे बात करो

🔗 Download: https://help2earn.app
📝 My Referral Code: ${tempReferralCode}

मदद करो, कमाई करो! 💰`
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    updateShareProgress('copy')
  }
  
  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
    window.open(url, '_blank')
    updateShareProgress('whatsapp')
  }
  
  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?text=${encodeURIComponent(shareMessage)}`
    window.open(url, '_blank')
    updateShareProgress('telegram')
  }

  const handleYouTubeShare = () => {
    navigator.clipboard.writeText(shareMessage)
    window.open('https://youtube.com', '_blank')
    updateShareProgress('youtube')
  }

  const updateShareProgress = (platform: string) => {
    const newCount = shareCount + 1
    const newProgress = Math.min(100, (newCount / REQUIRED_SHARES) * 100)
    
    setShareCount(newCount)
    setShareProgress(newProgress)
    localStorage.setItem('shareCount', newCount.toString())
    localStorage.setItem('shareProgress', newProgress.toString())
    localStorage.setItem('lastSharePlatform', platform)
    
    if (newCount >= REQUIRED_SHARES) {
      setShared(true)
    }
  }
  
  const handleContinue = async () => {
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
          localStorage.setItem('hasCompletedReferral', 'true')
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
      // No referral code entered, check if sharing is complete
      if (shared) {
        localStorage.setItem('hasCompletedReferral', 'true')
        setScreen('login')
      } else {
        setError('Please share with at least 1 friend to continue!')
      }
    }
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 to-white'}`}>
      {/* Header */}
      <header className="pt-6 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center"
          >
            <HandHeart className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help2Earn</span>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Share & Earn / शेयर करो और कमाओ</p>
          </div>
        </div>
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
          Step 1 of 3
        </Badge>
      </header>

      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-xl">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
            {shared ? '🎉 Great! Now Login!' : 'Refer & Get 1 Month Free!'}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {shared 
              ? 'Your referral reward is ready!'
              : 'Share with friends to unlock login + get 30 days free subscription!'
            }
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Card className={`overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border-0`}>
            <div className={`p-4 ${shared ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'} text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {shared ? <Check className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  <span className="font-bold">
                    {shared ? 'Unlocked!' : `${shareCount}/${REQUIRED_SHARES} Shares Required`}
                  </span>
                </div>
                <Badge className="bg-white/20 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {REWARD_DAYS} Days Free
                </Badge>
              </div>
              <Progress 
                value={shareProgress} 
                className="h-2 bg-white/30"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${shared ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {shared ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {shared ? 'Share Complete!' : 'Share to unlock login'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {shared 
                      ? 'You earned 30 days free subscription!'
                      : 'Login will be available after sharing'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your Referral Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-0`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Referral Code
                </p>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  <Users className="w-3 h-3 mr-1" />
                  Share to Earn
                </Badge>
              </div>
              <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-2xl font-bold tracking-wider text-orange-600">{tempReferralCode}</p>
              </div>
              <p className={`text-xs text-center mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Share this code - Each referral gives you +7 extra days!
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Share on any platform:
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button
              onClick={handleWhatsAppShare}
              className="h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              onClick={handleTelegramShare}
              className="h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold shadow-lg"
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
          className="mb-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-0`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Have a Friend's Code?
                </p>
              </div>
              <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter friend's referral code to get bonus days (skip sharing!)
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
              <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Zap className="w-4 h-4 text-yellow-500" />
                Why Share Before Login?
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Get 30 days FREE subscription
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Each referral = +7 extra days
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Help grow the community
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Your code becomes permanent after login
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
          disabled={isVerifying}
          className={`w-full h-14 rounded-2xl font-bold text-lg shadow-xl ${
            shared 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
          } ${!shared && 'opacity-90'}`}
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
              <Lock className="w-5 h-5 mr-2" />
              Share First to Unlock Login
            </>
          )}
        </Button>
        
        {!shared && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-orange-600 dark:text-orange-400 mt-2"
          >
            ⚠️ Share with at least 1 friend to continue
          </motion.p>
        )}
        
        {shared && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-green-600 dark:text-green-400 mt-2"
          >
            🎉 Great! Your 30 days free subscription is ready!
          </motion.p>
        )}
      </div>
    </div>
  )
}
