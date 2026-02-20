'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowRight, 
  CheckCircle, 
  HandHeart,
  Phone,
  MapPin,
  Clock,
  Star,
  Shield,
  Users,
  Zap,
  Loader2,
  AlertCircle,
  X,
  Crown,
  Timer,
  Navigation,
  Sparkles
} from 'lucide-react'
import { useAppStore } from '@/store'
import { Problem, ProblemType, formatDistance, formatPrice, formatDate, getTrustBadge } from '@/types'
import { SeededServicesGrid, SeededServiceModal } from './SeededServicesGrid'
import type { SeededService } from '@/data/seededServices'

interface HelperStatus {
  registered: boolean
  rank?: number
  hasPhoneAccess?: boolean
  clientPhone?: string | null
  clientName?: string | null
  status?: string
}

export function UserDashboard() {
  const { user, setScreen, darkMode, location, isSubscriptionActive, requestLocation, locationError } = useAppStore()
  
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [registeringId, setRegisteringId] = useState<string | null>(null)
  const [helperStatuses, setHelperStatuses] = useState<Record<string, HelperStatus>>({})
  
  // Seeded services state (addon for empty app feel)
  const [seededServices, setSeededServices] = useState<SeededService[]>([])
  const [selectedSeededService, setSelectedSeededService] = useState<SeededService | null>(null)
  const [showSeededServices, setShowSeededServices] = useState(false)

  const isActive = isSubscriptionActive()

  // Greeting functions
  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  function getGreetingHindi() {
    const hour = new Date().getHours()
    if (hour < 12) return 'सुप्रभात'
    if (hour < 17) return 'शुभ दोपहर'
    return 'शुभ संध्या'
  }

  // Fetch nearby problems
  const fetchProblems = useCallback(async () => {
    if (!user || !location) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch(
        `/api/problems/nearby?lat=${location.lat}&lng=${location.lng}&radius=20`
      )
      
      const data = await res.json()
      
      if (data.success) {
        setProblems(data.problems)
        
        // If no problems, fetch seeded services (addon for empty app feel)
        if (data.problems.length === 0) {
          fetchSeededServices()
        }
        
        // Fetch helper status for each problem if user is paid
        if (isActive) {
          data.problems.forEach((p: Problem) => {
            fetchHelperStatus(p.id)
          })
        }
      } else {
        setError(data.error || 'Failed to fetch requests')
        // Fetch seeded services on error too
        fetchSeededServices()
      }
    } catch {
      setError('Something went wrong / कुछ गलत हो गया')
      // Fetch seeded services on error
      fetchSeededServices()
    } finally {
      setIsLoading(false)
    }
  }, [user, location, isActive])

  // Fetch seeded services (addon for empty app feel)
  const fetchSeededServices = async () => {
    try {
      const res = await fetch('/api/seeded-services?action=services&count=20')
      const data = await res.json()
      if (data.success) {
        setSeededServices(data.services)
        setShowSeededServices(true)
      }
    } catch {
      // Ignore
    }
  }

  const fetchHelperStatus = async (problemId: string) => {
    if (!user) return
    
    try {
      const res = await fetch(
        `/api/problems/ready-to-help?problemId=${problemId}&helperId=${user.id}`
      )
      const data = await res.json()
      
      if (data.success) {
        setHelperStatuses(prev => ({
          ...prev,
          [problemId]: {
            registered: data.registered,
            rank: data.rank,
            hasPhoneAccess: data.hasPhoneAccess,
            clientPhone: data.clientPhone,
            clientName: data.clientName,
            status: data.status
          }
        }))
      }
    } catch {
      // Ignore
    }
  }

  useEffect(() => {
    if (location) {
      fetchProblems()
    }
  }, [location, fetchProblems])

  // Auto-request location if not available
  useEffect(() => {
    if (!location) {
      requestLocation()
    }
  }, [location, requestLocation])

  // Handle Ready to Help registration
  const handleReadyToHelp = async (problemId: string) => {
    if (!user || !isActive) return
    
    setRegisteringId(problemId)
    
    try {
      const res = await fetch('/api/problems/ready-to-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, helperId: user.id })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setHelperStatuses(prev => ({
          ...prev,
          [problemId]: {
            registered: true,
            rank: data.rank,
            hasPhoneAccess: data.hasPhoneAccess,
            clientPhone: data.clientPhone,
            clientName: data.clientName,
            status: 'REGISTERED'
          }
        }))
      } else {
        setError(data.error || 'Failed to register')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setRegisteringId(null)
    }
  }

  // Call the client
  const handleCall = (phone: string) => {
    window.open(`tel:+91${phone}`, '_self')
  }

  // Get type info
  const getTypeInfo = (type: ProblemType) => {
    switch (type) {
      case 'EMERGENCY': 
        return { 
          color: 'from-red-500 to-orange-500', 
          bg: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
          icon: '🆘',
          label: 'Emergency'
        }
      case 'TIME_ACCESS': 
        return { 
          color: 'from-blue-500 to-cyan-500', 
          bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
          icon: '⏰',
          label: 'Time/Access'
        }
      case 'RESOURCE_RENT': 
        return { 
          color: 'from-green-500 to-emerald-500', 
          bg: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
          icon: '📦',
          label: 'Resource'
        }
    }
  }

  const handleComplete = () => {
    localStorage.setItem('hasSeenDashboard', 'true')
    setScreen('home')
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-sky-50 via-white to-indigo-50'}`}>
      {/* User Profile Card */}
      <div className={`mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg ${darkMode ? 'bg-gradient-to-br from-sky-900/80 via-blue-900/80 to-indigo-900/80' : 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100'}`}>
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name || 'User'} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/50 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/50 shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {isActive && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getGreeting()}, {user?.name || 'User'}!
                </h2>
              </div>
              <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                {getGreetingHindi()}, {user?.name || 'User'}!
              </p>
              
              {/* Account Status */}
              <div className="flex items-center gap-2 mt-2">
                {isActive ? (
                  <Badge className="bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-300 border border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Account Active
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500/20 text-orange-600 dark:bg-orange-500/30 dark:text-orange-300 border border-orange-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Not Activated
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Trust Score & Ratings */}
          <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              {/* Trust Score */}
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  (user?.trustScore || 50) >= 70 ? 'bg-green-500/20' :
                  (user?.trustScore || 50) >= 40 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    (user?.trustScore || 50) >= 70 ? 'text-green-600' :
                    (user?.trustScore || 50) >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Trust Score</p>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.trustScore || 50}</p>
                </div>
              </div>
              
              {/* Divider */}
              <div className={`w-px h-10 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              
              {/* Ratings */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rating</p>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.ratingCount && user.ratingCount > 0 
                      ? `${(user.ratingSum / user.ratingCount).toFixed(1)} ⭐` 
                      : 'New User'}
                  </p>
                </div>
              </div>
              
              {/* Divider */}
              <div className={`w-px h-10 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              
              {/* Help Count */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <HandHeart className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Helps Done</p>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.helpfulCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`mx-4 mt-3 px-4 py-2.5 rounded-xl ${darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'} border`}>
        <div className="flex items-center gap-2 text-sm">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className={darkMode ? 'text-amber-300' : 'text-amber-700'}>
            <strong>First 5 helpers</strong> get client's phone number!
          </span>
          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>|</span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            पहले 5 को मिलेगा नंबर
          </span>
        </div>
      </div>

      {/* Location Status */}
      {location && (
        <div className={`mx-4 mt-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200'} border`}>
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span className={darkMode ? 'text-emerald-400' : 'text-emerald-700'}>
              Showing requests within 20 KM
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              • {problems.length} requests
            </span>
          </div>
        </div>
      )}

      {/* Location Error Banner */}
      {!location && locationError && (
        <div className={`mx-4 mt-3 px-4 py-3 rounded-xl ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                  Location Required
                </p>
                <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                  {locationError}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={requestLocation}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Enable
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading nearby requests...</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>पास के अनुरोध लोड हो रहे हैं...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <Button variant="outline" onClick={fetchProblems} className="mt-4 rounded-xl">
              Try Again / पुनः प्रयास
            </Button>
          </div>
        ) : problems.length === 0 ? (
          <div className="space-y-4">
            {showSeededServices && seededServices.length > 0 ? (
              // Show seeded services when no real problems exist
              <SeededServicesGrid 
                services={seededServices} 
                darkMode={darkMode}
                onSelectService={setSelectedSeededService}
              />
            ) : (
              // Original empty state
              <div className="text-center py-12">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                  <HandHeart className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No requests found nearby
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Be the first to post a help request
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  पास में कोई अनुरोध नहीं मिला
                </p>
              </div>
            )}
            
            {/* Post Request CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-700' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'} border`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-orange-800' : 'bg-orange-100'} flex items-center justify-center`}>
                  <Sparkles className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Want to post a help request?
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Get help from people nearby
                  </p>
                </div>
                <Button
                  onClick={() => setScreen('post-problem')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl"
                >
                  Post
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {problems.map((problem, index) => {
              const typeInfo = getTypeInfo(problem.type)
              const helperStatus = helperStatuses[problem.id]
              
              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card 
                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]`}
                    onClick={() => setSelectedProblem(problem)}
                  >
                    <div className={`h-1 bg-gradient-to-r ${typeInfo.color}`} />
                    <CardContent className="p-2">
                      {/* Photo or Icon */}
                      {problem.image ? (
                        <div className="relative rounded-lg overflow-hidden mb-2 h-16">
                          <img 
                            src={problem.image} 
                            alt="Problem" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-full h-16 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br ${typeInfo.color}`}>
                          <span className="text-2xl">{typeInfo.icon}</span>
                        </div>
                      )}
                      
                      {/* Title - truncated */}
                      <h3 className={`font-semibold text-xs mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {problem.title}
                      </h3>
                      
                      {/* Time & Distance */}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(problem.createdAt)}
                        </span>
                        <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDistance(problem.distance || 0)}
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="text-xs font-bold text-green-600 mb-2">
                        {formatPrice(problem.offerPrice)}
                      </div>
                      
                      {/* Action Button */}
                      {isActive ? (
                        helperStatus?.registered && helperStatus.hasPhoneAccess ? (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCall(helperStatus.clientPhone!)
                            }}
                            className="w-full h-7 text-[10px] bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call #{helperStatus.rank}
                          </Button>
                        ) : helperStatus?.registered ? (
                          <div className={`w-full text-center py-1 rounded-lg text-[10px] ${darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
                            #{helperStatus.rank} Waitlist
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReadyToHelp(problem.id)
                            }}
                            disabled={registeringId === problem.id}
                            className="w-full h-7 text-[10px] bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold"
                          >
                            {registeringId === problem.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <HandHeart className="w-3 h-3 mr-1" />
                                Ready to Help
                              </>
                            )}
                          </Button>
                        )
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setScreen('subscription')
                          }}
                          className="w-full h-7 text-[10px] bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold animate-pulse"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Activate
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

      {/* Problem Detail Modal */}
      <AnimatePresence>
        {selectedProblem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setSelectedProblem(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full rounded-t-3xl max-h-[80vh] shadow-2xl`}
            >
              <div className="flex justify-center pt-3">
                <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              </div>

              <ScrollArea className="max-h-[calc(80vh-24px)]">
                <div className="p-6 space-y-4">
                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedProblem(null)}
                    className="absolute top-4 right-4 rounded-xl"
                  >
                    <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                  </Button>

                  {/* Type Badge */}
                  <Badge className={getTypeInfo(selectedProblem.type).bg}>
                    {getTypeInfo(selectedProblem.type).icon} {getTypeInfo(selectedProblem.type).label}
                  </Badge>

                  {/* Title */}
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedProblem.title}
                  </h2>

                  {/* Problem Photo */}
                  {selectedProblem.image && (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-orange-200 dark:border-orange-800">
                      <img 
                        src={selectedProblem.image} 
                        alt="Problem photo" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-sm font-medium">📷 Problem Photo / समस्या की फोटो</p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedProblem.description && (
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {selectedProblem.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className={`flex gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex-1 text-center">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distance</p>
                      <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatDistance(selectedProblem.distance || 0)}
                      </p>
                    </div>
                    <div className="flex-1 text-center border-x border-gray-200">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Offer Price</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(selectedProblem.offerPrice)}
                      </p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                      <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>OPEN</p>
                    </div>
                  </div>

                  {/* Posted By */}
                  <Card className={darkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-gray-100'} flex items-center justify-center`}>
                          <span className="text-2xl">👤</span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedProblem.postedBy.name || 'User'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              const trustInfo = getTrustBadge(selectedProblem.postedBy.trustScore)
                              return (
                                <Badge className={`${trustInfo.color} text-xs`}>
                                  <Star className="w-3 h-3 mr-1" />
                                  {trustInfo.score} {trustInfo.label}
                                </Badge>
                              )
                            })()}
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(selectedProblem.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Helper Status or Activation Prompt */}
                  {isActive ? (
                    (() => {
                      const status = helperStatuses[selectedProblem.id]
                      if (status?.registered && status.hasPhoneAccess) {
                        return (
                          <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-bold">You're #{status.rank} - Phone Number Unlocked!</span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                              Call {status.clientName || 'the client'} now: {status.clientPhone}
                            </p>
                          </div>
                        )
                      } else if (status?.registered) {
                        return (
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border`}>
                            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mb-2">
                              <Timer className="w-5 h-5" />
                              <span className="font-bold">You're #{status.rank} on Waitlist</span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                              Only first 5 helpers get the phone number.
                            </p>
                          </div>
                        )
                      }
                      return null
                    })()
                  ) : (
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200'} border`}>
                      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-2">
                        <Zap className="w-5 h-5" />
                        <span className="font-bold">Activate to Help Others</span>
                      </div>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                        Activate your account to tap "Ready to Help" and connect with people nearby.
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-orange-400' : 'text-orange-500'}`}>
                        अपना अकाउंट एक्टिवेट करें और पास के लोगों की मदद करें।
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedProblem(null)}
                      className={`flex-1 h-12 rounded-xl font-medium ${darkMode ? 'border-gray-600' : ''}`}
                    >
                      Close
                    </Button>
                    
                    {isActive ? (
                      (() => {
                        const status = helperStatuses[selectedProblem.id]
                        
                        if (status?.registered && status.hasPhoneAccess) {
                          return (
                            <Button
                              onClick={() => handleCall(status.clientPhone!)}
                              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call Now
                            </Button>
                          )
                        } else if (status?.registered) {
                          return (
                            <Button
                              disabled
                              className="flex-1 h-12 rounded-xl font-bold"
                            >
                              <Timer className="w-4 h-4 mr-2" />
                              #{status.rank} Waitlist
                            </Button>
                          )
                        }
                        
                        return (
                          <Button
                            onClick={() => handleReadyToHelp(selectedProblem.id)}
                            disabled={registeringId === selectedProblem.id}
                            className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold"
                          >
                            {registeringId === selectedProblem.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <HandHeart className="w-4 h-4 mr-2" />
                                Ready to Help
                              </>
                            )}
                          </Button>
                        )
                      })()
                    ) : (
                      <Button
                        onClick={() => setScreen('subscription')}
                        className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold animate-pulse"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Activate Now - ₹49/month
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seeded Service Modal (addon for empty app feel) */}
      <SeededServiceModal 
        service={selectedSeededService}
        darkMode={darkMode}
        onClose={() => setSelectedSeededService(null)}
      />

      {/* Footer */}
      <footer className={`sticky bottom-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-4`}>
        <Button
          onClick={handleComplete}
          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Go to Home / होम पर जाएं
        </Button>
      </footer>
    </div>
  )
}
