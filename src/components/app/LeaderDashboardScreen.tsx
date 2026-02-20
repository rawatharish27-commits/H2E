'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Crown, 
  Users, 
  Wallet, 
  TrendingUp, 
  Share2, 
  QrCode, 
  Copy, 
  CheckCircle,
  Trophy,
  Star,
  Gift,
  MapPin,
  Sparkles,
  Flame,
  Target,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { useAppStore } from '@/store'

// Leader level colors
const LEVEL_COLORS = {
  NONE: 'from-gray-400 to-gray-500',
  BRONZE: 'from-amber-600 to-orange-600',
  SILVER: 'from-gray-400 to-slate-500',
  GOLD: 'from-yellow-400 to-amber-500',
  AMBASSADOR: 'from-purple-500 to-pink-500',
}

// Area leaderboard mock data
const AREA_LEADERBOARD = [
  { rank: 1, name: 'Rohit S.', users: 234, commission: 4520, avatar: '👨‍💼' },
  { rank: 2, name: 'Priya M.', users: 189, commission: 3890, avatar: '👩‍💼' },
  { rank: 3, name: 'Amit K.', users: 156, commission: 3240, avatar: '👨‍🔧' },
  { rank: 4, name: 'Sunita R.', users: 134, commission: 2780, avatar: '👩‍🏫' },
  { rank: 5, name: 'Vikram T.', users: 98, commission: 1920, avatar: '👨‍🌾' },
]

// Rewards available
const REWARDS = [
  { id: 1, title: 'Monthly Top 3 Bonus', amount: '₹500', icon: Trophy, color: 'text-yellow-500' },
  { id: 2, title: 'Festival Bonus', amount: '₹200', icon: Gift, color: 'text-pink-500' },
  { id: 3, title: 'Referral Streak', amount: '₹50/user', icon: Flame, color: 'text-orange-500' },
]

export function LeaderDashboardScreen() {
  const { user, setScreen, darkMode, goBack } = useAppStore()
  
  const [copied, setCopied] = useState(false)
  const [leaderData, setLeaderData] = useState<{
    level: string
    connectedUsers: number
    totalCommission: number
    monthlyCommission: number
    areaCode: string
    areaName: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Generate referral link
  const referralLink = `https://help2earn.in/join/${user?.referralCode || 'LEADER123'}`

  // Fetch leader data
  useEffect(() => {
    const fetchLeaderData = async () => {
      if (!user?.id) return
      
      try {
        const res = await fetch(`/api/leader/stats?userId=${user.id}`)
        const data = await res.json()
        
        if (data.success) {
          setLeaderData(data.leader)
        }
      } catch (error) {
        console.error('Failed to fetch leader data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLeaderData()
  }, [user?.id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const message = `🔥 Join Help2Earn and start earning! 

I'm a verified Area Leader. Use my referral link:
${referralLink}

💰 Earn ₹100-500 per help in your area!`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-orange-100'} shadow-lg`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Leader Dashboard
              </h1>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Area Leader Panel
            </p>
          </div>
          <Badge className={`bg-gradient-to-r ${LEVEL_COLORS[leaderData?.level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.BRONZE} text-white`}>
            <Crown className="w-3 h-3 mr-1" />
            {leaderData?.level || 'BRONZE'}
          </Badge>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        {/* Top Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pt-4"
        >
          <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-yellow-900/50 via-orange-900/50 to-red-900/50' : 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500'} shadow-xl`}>
            <div className="p-5 text-white">
              {/* Area Name */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium opacity-90">
                  {leaderData?.areaName || 'Dehradun Central'} (20km Zone)
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-5 h-5 opacity-80" />
                    <span className="text-2xl font-bold">{leaderData?.connectedUsers || 27}</span>
                  </div>
                  <p className="text-xs opacity-80">Connected</p>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Wallet className="w-5 h-5 opacity-80" />
                    <span className="text-2xl font-bold">₹{leaderData?.monthlyCommission || 1240}</span>
                  </div>
                  <p className="text-xs opacity-80">Monthly</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-5 h-5 opacity-80" />
                    <span className="text-2xl font-bold">₹{leaderData?.totalCommission || 8500}</span>
                  </div>
                  <p className="text-xs opacity-80">Total Earned</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress to Next Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 mt-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-lg rounded-2xl`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Next Level Progress
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {leaderData?.level === 'BRONZE' ? 'SILVER' : leaderData?.level === 'SILVER' ? 'GOLD' : 'AMBASSADOR'}
                </Badge>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Connected Users</span>
                  <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {leaderData?.connectedUsers || 27} / 500
                  </span>
                </div>
                <div className={`h-2.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((leaderData?.connectedUsers || 27) / 500) * 100, 100)}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>

              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Connect 500 users to unlock Silver Leader level
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 mt-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-lg rounded-2xl`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-green-500" />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Share & Grow Network
                </h3>
              </div>

              {/* Referral Link */}
              <div className={`flex items-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-3`}>
                <Input
                  value={referralLink}
                  readOnly
                  className={`flex-1 bg-transparent border-none text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                />
                <Button 
                  size="sm" 
                  onClick={handleCopyLink}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              {/* Share Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleShareWhatsApp}
                  className="h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className={`h-11 rounded-xl font-medium ${darkMode ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300'}`}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Area Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 mt-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-lg rounded-2xl`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Area Leaderboard
                </h3>
                <Badge variant="outline" className="ml-auto text-xs">
                  Top 5
                </Badge>
              </div>

              <div className="space-y-2">
                {AREA_LEADERBOARD.map((leader, index) => (
                  <motion.div
                    key={leader.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      leader.name.startsWith(user?.name?.charAt(0) || 'X')
                        ? darkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-50 border border-orange-200'
                        : darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      leader.rank === 1 ? 'bg-yellow-500 text-white' :
                      leader.rank === 2 ? 'bg-gray-400 text-white' :
                      leader.rank === 3 ? 'bg-amber-600 text-white' :
                      darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {leader.rank <= 3 ? ['🥇', '🥈', '🥉'][leader.rank - 1] : leader.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-lg">
                      {leader.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {leader.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {leader.users} users
                      </p>
                    </div>

                    {/* Commission */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-500">
                        ₹{leader.commission.toLocaleString()}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        earned
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rewards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 mt-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-lg rounded-2xl`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-pink-500" />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Rewards Available
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {REWARDS.map((reward) => (
                  <div
                    key={reward.id}
                    className={`text-center p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <reward.icon className={`w-6 h-6 mx-auto mb-1 ${reward.color}`} />
                    <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {reward.title}
                    </p>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {reward.amount}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Commission Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 mt-4"
        >
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How Commission Works
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              When a help is completed in your area (20km zone), you earn{' '}
              <span className="font-bold text-green-500">0.5% commission</span>.
              No MLM chain - only single level referral. Transparent & safe!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
