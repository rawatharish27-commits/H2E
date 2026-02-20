'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Crown, 
  CheckCircle, 
  Users, 
  Wallet, 
  Star, 
  Gift,
  Share2,
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react'
import { useAppStore } from '@/store'

interface LeaderUnlockPopupProps {
  isOpen: boolean
  onClose: () => void
  areaName: string
  userName: string
}

// Leader benefits list
const LEADER_BENEFITS = [
  { icon: Wallet, text: '0.5% commission on completed helps in your zone', textHi: 'अपने जोन में पूर्ण मदद पर 0.5% कमीशन' },
  { icon: Crown, text: 'Leader badge on profile', textHi: 'प्रोफाइल पर लीडर बैज' },
  { icon: Star, text: 'Access to priority tasks', textHi: 'प्राथमिकता वाले कार्यों तक पहुंच' },
  { icon: Gift, text: 'Monthly leaderboard rewards', textHi: 'मासिक लीडरबोर्ड रिवार्ड्स' },
]

// Growth milestones
const GROWTH_MILESTONES = [
  { users: 50, level: 'Bronze Leader', icon: '🥉' },
  { users: 100, level: 'Commission Activated', icon: '💰' },
  { users: 500, level: 'Silver Leader', icon: '🥈' },
  { users: 1000, level: 'Area Ambassador', icon: '👑' },
]

export function LeaderUnlockPopup({ isOpen, onClose, areaName, userName }: LeaderUnlockPopupProps) {
  const { setScreen, darkMode } = useAppStore()

  const handleInviteNow = () => {
    onClose()
    setScreen('referral')
  }

  const handleOpenDashboard = () => {
    onClose()
    setScreen('leader-dashboard')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-orange-100'} border-2 shadow-2xl rounded-3xl overflow-hidden`}>
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-6 text-white text-center overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Crown Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Crown className="w-10 h-10 text-yellow-300" />
                </motion.div>

                {/* Congratulations Text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-yellow-200 text-sm mb-1">🎖 Congratulations!</p>
                  <h2 className="text-2xl font-bold mb-2">{userName}!</h2>
                  <p className="text-white/90">
                    You are now a <span className="font-bold">Verified Area Leader</span>
                  </p>
                  <Badge className="mt-2 bg-white/20 text-white border-white/30">
                    <MapPin className="w-3 h-3 mr-1" />
                    {areaName} (20km Zone)
                  </Badge>
                </motion.div>
              </div>

              <CardContent className="p-5">
                {/* Leader Benefits */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      🔓 Leader Benefits
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {LEADER_BENEFITS.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-orange-50'}`}
                      >
                        <benefit.icon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {benefit.text}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {benefit.textHi}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Growth Target */}
                <div className={`p-4 rounded-xl mb-5 ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-blue-500" />
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      📊 Growth Target
                    </h3>
                  </div>

                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Connect 100 active users to activate commission
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
                      <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>27 / 100</span>
                    </div>
                    <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '27%' }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>

                  <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    Connect 1000 users → Area Ambassador Level
                  </p>
                </div>

                {/* Milestones */}
                <div className="mb-5">
                  <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Milestones
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {GROWTH_MILESTONES.map((milestone, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`text-center p-2 rounded-xl ${
                          index === 0 
                            ? 'bg-orange-100 border-2 border-orange-300' 
                            : darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{milestone.icon}</span>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {milestone.users}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleInviteNow}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Invite Now
                  </Button>
                  <Button
                    onClick={handleOpenDashboard}
                    variant="outline"
                    className={`flex-1 h-12 rounded-xl font-medium ${darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300'}`}
                  >
                    Open Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Simple MapPin component for the badge
function MapPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  )
}
