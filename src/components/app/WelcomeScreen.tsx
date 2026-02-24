'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/components/ui/logo'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  HandHeart,
  Phone,
  Users,
  MapPin,
  CheckCircle,
  Gift,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react'
import { useAppStore } from '@/store'

export function WelcomeScreen() {
  const { setScreen, setTempReferralCode, darkMode, locationAddress } = useAppStore()
  
  // Calculate days left to April 1, 2026
  const freeAccessEndDate = new Date('2026-04-01T00:00:00')
  const now = new Date()
  const daysLeft = Math.max(0, Math.ceil((freeAccessEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  const handleGetStarted = () => {
    // Mark welcome as seen
    try {
      localStorage.setItem('hasSeenWelcome', 'true')
    } catch {
      // Ignore
    }
    
    const tempCode = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setTempReferralCode(tempCode)
    // Go directly to login - skip pre-login-share
    setScreen('login')
  }

  const handleLogin = () => {
    // Mark welcome as seen
    try {
      localStorage.setItem('hasSeenWelcome', 'true')
    } catch {
      // Ignore
    }
    setScreen('login')
  }
  
  // Get location display name
  const locationDisplayName = locationAddress?.city || locationAddress?.village || ''
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-red-50'}`}>
      {/* FREE ACCESS Banner - Very Prominent */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-3 px-4"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Gift className="w-5 h-5" />
          <span className="font-bold text-lg">🎉 सभी Services मुफ्त!</span>
        </div>
        <p className="text-sm text-white/90">
          <span className="font-bold">{daysLeft} days left</span> - 1 April 2026 तक सब कुछ FREE!
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl flex items-center justify-center">
            <LogoIcon size={64} />
          </div>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-orange-600">Community</span>{' '}
            <span className="text-red-600">Help</span>{' '}
            <span className="text-rose-600">Network</span>
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            पास के लोगों से मदद पाओ, कमाओ!
          </p>
        </motion.div>

        {/* Location Badge */}
        {locationDisplayName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <Badge className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 py-2 text-sm shadow-lg`}>
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              <span className={darkMode ? 'text-white' : 'text-gray-700'}>{locationDisplayName}</span>
            </Badge>
          </motion.div>
        )}

        {/* Value Proposition - Simple 3 Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm mb-6"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-0'} shadow-xl rounded-2xl`}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Point 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>मदद चाहिए? Post करो</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>पास के लोग आपकी मदद करेंगे</p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <HandHeart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>मदद करो, पैसे कमाओ</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>₹100-₹500 per help</p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Direct Phone Call</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No middleman, no commission</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">87+ Active Users</span>
          </div>
          <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">100% Secure</span>
          </div>
        </motion.div>

        {/* CTA Buttons - BIG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm space-y-3"
        >
          {/* Get Started / Register Button */}
          <Button
            onClick={handleGetStarted}
            className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started - It's FREE!
          </Button>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            variant="outline"
            className={`w-full h-12 rounded-2xl font-semibold text-base ${darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Already have an account? Login
            <span className="ml-2 text-orange-500">/ लॉगिन</span>
          </Button>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`mt-6 flex items-center gap-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs">No credit card required • 100% FREE until April 2026</span>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © 2026 Community Help Network • Made with ❤️ in India
        </p>
      </footer>
    </div>
  )
}
