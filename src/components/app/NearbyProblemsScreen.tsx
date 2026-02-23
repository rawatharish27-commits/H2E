'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock,
  Star,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Package,
  Zap,
  Navigation,
  HandHeart,
  Users,
  CheckCircle,
  X,
  MessageCircle,
  Shield,
  Map,
  UserCheck,
  Timer,
  Crown
} from 'lucide-react'
import { useAppStore } from '@/store'
import { Problem, ProblemType, formatDistance, formatPrice, formatDate, getTrustBadge } from '@/types'

interface HelperStatus {
  registered: boolean
  rank?: number
  hasPhoneAccess?: boolean
  clientPhone?: string | null
  clientName?: string | null
  status?: string
}

export function NearbyProblemsScreen() {
  const { user, location, setScreen, isSubscriptionActive, canViewProblems, darkMode, trustScore, requestLocation, locationError } = useAppStore()
  
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<ProblemType | 'ALL'>('ALL')
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [registeringId, setRegisteringId] = useState<string | null>(null)
  const [helperStatuses, setHelperStatuses] = useState<Record<string, HelperStatus>>({})

  const canView = true
  const isActive = true
  //const canView = canViewProblems()
  //const isActive = isSubscriptionActive()
  const myTrustScore = trustScore || user?.trustScore || 50

  const fetchProblems = async () => {
    if (!user || !location) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch(
        `/api/problems?lat=${location.lat}&lng=${location.lng}&userId=${user.id}&status=OPEN`
      )
      
      const data = await res.json()
      
      if (data.success) {
        // Filter by trust score requirement
        const eligible = data.problems.filter((p: Problem) => myTrustScore >= p.minTrustRequired)
        setProblems(eligible)
        
        // Fetch helper status for each problem
        eligible.forEach((p: Problem) => {
          fetchHelperStatus(p.id)
        })
      } else {
        setError(data.error || 'Failed to fetch requests')
      }
    } catch {
      setError('Something went wrong / कुछ गलत हो गया')
    } finally {
      setIsLoading(false)
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
    if (canView && location) {
      fetchProblems()
    }
  }, [canView, location])
  
  // Auto-request location if not available
  useEffect(() => {
    if (!location && canView) {
      requestLocation()
    }
  }, [location, canView, requestLocation])

  const handleReadyToHelp = async (problemId: string) => {
    if (!user) return
    
    setRegisteringId(problemId)
    
    try {
      const res = await fetch('/api/problems/ready-to-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, helperId: user.id })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Update helper status
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
        
        // If has phone access, show in modal
        if (data.hasPhoneAccess) {
          // Auto-open call modal
        }
      } else {
        setError(data.error || 'Failed to register')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setRegisteringId(null)
    }
  }

  const handleCall = (phone: string) => {
    window.open(`tel:+91${phone}`, '_self')
  }

  const filteredProblems = problems.filter(p => {
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'ALL' || p.type === activeTab
    
    return matchesSearch && matchesTab
  })

  const getTypeInfo = (type: ProblemType) => {
    switch (type) {
      case 'EMERGENCY': 
        return { 
          color: 'from-red-500 to-orange-500', 
          bg: 'bg-red-100 text-red-700',
          icon: '🆘',
          label: 'Emergency'
        }
      case 'TIME_ACCESS': 
        return { 
          color: 'from-blue-500 to-cyan-500', 
          bg: 'bg-blue-100 text-blue-700',
          icon: '⏰',
          label: 'Time/Access'
        }
      case 'RESOURCE_RENT': 
        return { 
          color: 'from-green-500 to-emerald-500', 
          bg: 'bg-green-100 text-green-700',
          icon: '📦',
          label: 'Resource'
        }
    }
  }

  if (!isActive) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setScreen('home')}>
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
            </Button>
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nearby Requests</h1>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className={`w-20 h-20 rounded-3xl ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'} flex items-center justify-center mb-4`}>
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Subscription Required</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
            Activate your subscription to view nearby help requests
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
            पास के अनुरोध देखने के लिए सदस्यता लें
          </p>
          <Button
            onClick={() => setScreen('subscription')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white h-12 rounded-xl font-bold px-6"
          >
            Activate Now - ₹49/month
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
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help Requests Nearby</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {problems.length} requests within 20 KM
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setScreen('map')} 
            className="rounded-xl"
            title="Map View"
          >
            <Map className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchProblems} 
            disabled={isLoading}
            className="rounded-xl"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''} ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <Input
              placeholder="Search requests... / खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 h-11 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All', icon: Zap },
            { id: 'EMERGENCY', label: 'Emergency', icon: AlertCircle },
            { id: 'TIME_ACCESS', label: 'Time', icon: Clock },
            { id: 'RESOURCE_RENT', label: 'Rent', icon: Package },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as ProblemType | 'ALL')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                    : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Info Banner */}
      <div className={`px-4 py-3 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'} border-b`}>
        <div className="flex items-center gap-2 text-sm">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className={darkMode ? 'text-blue-300' : 'text-blue-700'}>
            <strong>First 5 helpers</strong> get the client's phone number!
          </span>
          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>|</span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            पहले 5 को मिलेगा नंबर
          </span>
        </div>
      </div>

      {/* Location Status */}
      {location && (
        <div className={`px-4 py-2 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'} border-b`}>
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-green-600" />
            <span className={darkMode ? 'text-green-400' : 'text-green-700'}>
              Showing requests within 20 KM
            </span>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>|</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              20 किमी के भीतर के अनुरोध
            </span>
          </div>
        </div>
      )}

      {/* Location Error Banner */}
      {!location && locationError && (
        <div className={`px-4 py-3 ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                  Location Required / स्थान आवश्यक
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

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading nearby requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <Button variant="outline" onClick={fetchProblems} className="mt-4 rounded-xl">
              Try Again / पुनः प्रयास
            </Button>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
              <HandHeart className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No requests found nearby
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Be the first to need help or check back later
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              पास में कोई अनुरोध नहीं मिला
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProblems.map((problem, index) => {
              const typeInfo = getTypeInfo(problem.type)
              const trustInfo = getTrustBadge(problem.postedBy.trustScore)
              const helperStatus = helperStatuses[problem.id]
              
              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} overflow-hidden shadow-lg`}>
                    <div className={`h-1.5 bg-gradient-to-r ${typeInfo.color}`} />
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={typeInfo.bg}>
                            {typeInfo.icon} {typeInfo.label}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            Trust: {problem.minTrustRequired}+
                          </Badge>
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDate(problem.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {problem.title}
                      </h3>
                      
                      {problem.description && (
                        <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {problem.description}
                        </p>
                      )}

                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {formatDistance(problem.distance || 0)}
                          </span>
                        </div>
                        <div className="font-bold text-green-600">
                          {formatPrice(problem.offerPrice)}
                        </div>
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Clock className="w-4 h-4" />
                          <span>OPEN</span>
                        </div>
                      </div>

                      {/* Posted By */}
                      <div className={`flex items-center justify-between pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                            <span className="text-lg">👤</span>
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {problem.postedBy.name || 'User'}
                            </p>
                            <Badge className={`${trustInfo.color} text-xs`}>
                              <Star className="w-3 h-3 mr-1" />
                              {trustInfo.score} {trustInfo.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProblem(problem)}
                            className="rounded-xl h-10"
                          >
                            Details
                          </Button>
                          
                          {helperStatus?.registered && helperStatus.hasPhoneAccess ? (
                            <Button
                              size="sm"
                              onClick={() => handleCall(helperStatus.clientPhone!)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl h-10"
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call #{helperStatus.rank}
                            </Button>
                          ) : helperStatus?.registered ? (
                            <div className={`flex items-center gap-1 px-3 py-2 rounded-xl ${darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
                              <Timer className="w-4 h-4" />
                              <span className="text-sm">#{helperStatus.rank} Waitlist</span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleReadyToHelp(problem.id)}
                              disabled={registeringId === problem.id}
                              className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl h-10"
                            >
                              {registeringId === problem.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <HandHeart className="w-4 h-4 mr-1" />
                                  Ready to Help
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

      {/* Detail Modal */}
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
              <div className="p-6">
                {/* Handle */}
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                </div>
                
                {/* Close */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProblem(null)}
                  className="absolute top-4 right-4 rounded-xl"
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                </Button>
                
                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <Badge className={getTypeInfo(selectedProblem.type).bg}>
                      {getTypeInfo(selectedProblem.type).icon} {getTypeInfo(selectedProblem.type).label}
                    </Badge>
                  </div>
                  
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
                  
                  {selectedProblem.description && (
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {selectedProblem.description}
                    </p>
                  )}
                  
                  {/* Price & Distance */}
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

                  {/* Helper Status Info */}
                  {(() => {
                    const status = helperStatuses[selectedProblem.id]
                    if (status?.registered && status.hasPhoneAccess) {
                      return (
                        <div className={`p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700`}>
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
                            Only first 5 helpers get the phone number. You'll be notified if a spot opens.
                          </p>
                        </div>
                      )
                    }
                    return null
                  })()}
                  
                  {/* How it works */}
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
                    <h4 className={`font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                      <MessageCircle className="w-4 h-4" />
                      How "Ready to Help" works?
                    </h4>
                    <ol className={`text-sm space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      <li>1. Tap "Ready to Help" to register</li>
                      <li>2. First 5 helpers get client's phone number</li>
                      <li>3. Call the client directly</li>
                      <li>4. Discuss problem & price</li>
                      <li>5. Go help & get paid!</li>
                    </ol>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedProblem(null)}
                      className="flex-1 h-12 rounded-xl"
                    >
                      Ignore
                    </Button>
                    
                    {(() => {
                      const status = helperStatuses[selectedProblem.id]
                      
                      if (status?.registered && status.hasPhoneAccess) {
                        return (
                          <Button
                            onClick={() => {
                              handleCall(status.clientPhone!)
                              setSelectedProblem(null)
                            }}
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
                            #{status.rank} on Waitlist
                          </Button>
                        )
                      }
                      
                      return (
                        <Button
                          onClick={() => {
                            handleReadyToHelp(selectedProblem.id)
                          }}
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
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Copyright Footer */}
      <footer className="fixed bottom-3 right-3 z-40">
        <p className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © Harish Rawat
        </p>
      </footer>
    </div>
  )
}
