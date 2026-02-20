'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  Users, 
  Star, 
  Calendar,
  MapPin,
  HandHeart,
  Trophy,
  Zap,
  Crown,
  Medal,
  Gift,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/store'

interface AreaStats {
  todayHelps: number
  yesterdayHelps: number
  weeklyHelps: number
  totalUsers: number
  topCategory: { name: string; count: number; icon: string }
  topResource: { name: string; count: number; icon: string }
  highDemandHelps: Array<{ name: string; count: number; icon: string }>
}

interface TopHelper {
  id: string
  name: string
  avatar?: string
  trustScore: number
  helpsDone: number
  rating: string
  badge: string
}

export function HistoryScreen() {
  const { user, setScreen, location, darkMode } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [areaStats, setAreaStats] = useState<AreaStats | null>(null)
  const [topHelpers, setTopHelpers] = useState<TopHelper[]>([])

  useEffect(() => {
    fetchAreaData()
  }, [location])

  const fetchAreaData = async () => {
    setIsLoading(true)
    try {
      if (location) {
        const res = await fetch(`/api/area/stats?lat=${location.lat}&lng=${location.lng}`)
        const data = await res.json()
        if (data.success) {
          setAreaStats(data.stats)
          setTopHelpers(data.topHelpers || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch area data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className={`w-5 h-5 flex items-center justify-center text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{rank}</span>
  }

  const getTrustColor = (score: number) => {
    if (score >= 70) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  // No data state
  if (!isLoading && !areaStats) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setScreen('home')} className="rounded-xl">
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
            </Button>
            <div className="flex-1">
              <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Area History</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Help activity in your area
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className={`w-20 h-20 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
            <AlertCircle className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Data Available</h2>
          <p className={`text-center mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Enable location to see area statistics
          </p>
          <Button
            onClick={() => setScreen('nearby')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            <HandHeart className="w-4 h-4 mr-2" />
            See Help Requests
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setScreen('home')} className="rounded-xl">
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div className="flex-1">
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Area History</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Help activity in your area / आपके क्षेत्र में मदद गतिविधि
            </p>
          </div>
          {location && (
            <Badge className="bg-green-100 text-green-700">
              <MapPin className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading area data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Cards - Today, Yesterday, Weekly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3"
            >
              {/* Today */}
              <Card className={`${darkMode ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} border`}>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-green-500 flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{areaStats?.todayHelps || 0}</p>
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>आज</p>
                </CardContent>
              </Card>

              {/* Yesterday */}
              <Card className={`${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} border`}>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500 flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{areaStats?.yesterdayHelps || 0}</p>
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Yesterday</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>कल</p>
                </CardContent>
              </Card>

              {/* Weekly */}
              <Card className={`${darkMode ? 'bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'} border`}>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500 flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{areaStats?.weeklyHelps || 0}</p>
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>This Week</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>इस हफ्ते</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Users in Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Users in Your Area</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>आपके क्षेत्र में उपयोगकर्ता</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-orange-600">{areaStats?.totalUsers || 0}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Most Used Category & Resource */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-3"
            >
              {/* Top Category */}
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}>
                <CardContent className="p-4">
                  <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Category</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{areaStats?.topCategory?.icon || '📦'}</span>
                    <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{areaStats?.topCategory?.name || 'N/A'}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    {areaStats?.topCategory?.count || 0} helps
                  </Badge>
                </CardContent>
              </Card>

              {/* Top Resource */}
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}>
                <CardContent className="p-4">
                  <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top Resource</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{areaStats?.topResource?.icon || '📦'}</span>
                    <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{areaStats?.topResource?.name || 'N/A'}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {areaStats?.topResource?.count || 0} helps
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* High Demanding Help */}
            {areaStats?.highDemandHelps && areaStats.highDemandHelps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>High Demand in Your Area</h3>
                    </div>
                    <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>आपके क्षेत्र में उच्च मांग</p>
                    
                    <div className="space-y-2">
                      {areaStats.highDemandHelps.map((help, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{help.icon}</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{help.name}</span>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700">
                            {help.count} requests
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Top 10 Helpers */}
            {topHelpers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top 10 Helpers</h3>
                    </div>
                    <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>आपके क्षेत्र के शीर्ष 10 मददगार</p>
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {topHelpers.map((helper, idx) => (
                        <motion.div
                          key={helper.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            idx < 3 
                              ? darkMode 
                                ? 'bg-gradient-to-r from-yellow-900/20 via-transparent to-transparent border border-yellow-800/30' 
                                : 'bg-gradient-to-r from-yellow-50 via-transparent to-transparent border border-yellow-100'
                              : darkMode 
                                ? 'bg-gray-700' 
                                : 'bg-gray-50'
                          }`}
                        >
                          {/* Rank */}
                          <div className="w-8 flex justify-center">
                            {getMedalIcon(idx + 1)}
                          </div>
                          
                          {/* Avatar */}
                          <Avatar className="w-10 h-10 border-2 border-white shadow">
                            <AvatarImage src={helper.avatar} alt={helper.name} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-sm">
                              {helper.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{helper.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${getTrustColor(helper.trustScore)}`}>
                                Trust: {helper.trustScore}
                              </span>
                              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                              <span className="flex items-center gap-1 text-xs text-yellow-500">
                                <Star className="w-3 h-3 fill-yellow-500" />
                                {helper.rating}
                              </span>
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div className="text-right">
                            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{helper.helpsDone}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>helps</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Motivational Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-xl">
                <CardContent className="p-5 text-center">
                  <Gift className="w-10 h-10 mx-auto mb-3 text-white/80" />
                  <h3 className="font-bold text-lg mb-2">Start Helping Today!</h3>
                  <p className="text-white/80 text-sm mb-4">आज ही मदद करना शुरू करें और टॉप हेल्पर्स में अपना नाम दर्ज कराएं!</p>
                  <Button
                    onClick={() => setScreen('nearby')}
                    className="bg-white text-orange-600 hover:bg-white/90 font-bold"
                  >
                    <HandHeart className="w-4 h-4 mr-2" />
                    See Help Requests
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
