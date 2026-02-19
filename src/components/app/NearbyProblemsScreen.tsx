'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  ExternalLink,
  Image as ImageIcon,
  Share2,
  User,
  Calendar
} from 'lucide-react'
import { useAppStore } from '@/store'
import { Problem, ProblemType, formatDistance, formatPrice, formatDate, getTrustBadge, EMERGENCY_CATEGORIES, TIME_ACCESS_CATEGORIES, RESOURCE_CATEGORIES } from '@/types'

export function NearbyProblemsScreen() {
  const { user, location, setScreen, isSubscriptionActive, canViewProblems, darkMode, trustScore } = useAppStore()
  
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<ProblemType | 'ALL'>('ALL')
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  const canView = canViewProblems()
  const isActive = isSubscriptionActive()
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
      } else {
        setError(data.error || 'Failed to fetch requests')
      }
    } catch {
      setError('Something went wrong / कुछ गलत हो गया')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (canView && location) {
      fetchProblems()
    }
  }, [canView, location])

  const handleReadyToHelp = async (problem: Problem) => {
    if (!user) return
    
    setAcceptingId(problem.id)
    
    try {
      const res = await fetch(`/api/problems/${problem.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helperId: user.id })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Open WhatsApp with pre-filled message
        const message = `🤝 Help2Earn - Help Request Accepted!

Hello ${problem.postedBy.name || 'User'},

I'm ready to help with your request:
📌 Category: ${getCategoryLabel(problem.type, problem.category)}
📝 Problem: ${problem.title}
${problem.description ? `📄 Details: ${problem.description}` : ''}

Let's discuss further details.

Best regards,
${user.name || 'Helper'}`
        
        const whatsappUrl = `https://wa.me/91${problem.postedBy.phone}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        
        // Refresh list
        fetchProblems()
      } else {
        setError(data.error || 'Failed to accept request')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setAcceptingId(null)
    }
  }

  const handleCallUser = (phone: string) => {
    window.open(`tel:+91${phone}`)
  }

  const handleShareViaMessage = (problem: Problem) => {
    const message = `🤝 Help Request from Help2Earn!

📌 Category: ${getCategoryLabel(problem.type, problem.category)}
📝 Problem: ${problem.title}
${problem.description ? `📄 Details: ${problem.description}` : ''}
💰 Offer: ${formatPrice(problem.offerPrice)}
📍 Distance: ${formatDistance(problem.distance || 0)}

Contact: +91 ${problem.postedBy.phone}`
    
    // Try native share first
    if (navigator.share) {
      navigator.share({
        title: 'Help Request - Help2Earn',
        text: message
      }).catch(() => {
        // Fallback to SMS
        window.open(`sms:+91${problem.postedBy.phone}?body=${encodeURIComponent(message)}`)
      })
    } else {
      // Fallback to SMS
      window.open(`sms:+91${problem.postedBy.phone}?body=${encodeURIComponent(message)}`)
    }
  }

  const getCategoryLabel = (type: ProblemType, categoryId: string | null) => {
    if (!categoryId) return type
    const allCategories = [...EMERGENCY_CATEGORIES, ...TIME_ACCESS_CATEGORIES, ...RESOURCE_CATEGORIES]
    const category = allCategories.find(c => c.id === categoryId)
    return category ? `${category.icon} ${category.label}` : type
  }

  const filteredProblems = problems.filter(p => {
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'ALL' || p.type === activeTab
    
    return matchesSearch && matchesTab
  })

  const getTypeInfo = (type: ProblemType) => {
    switch (type) {
      case 'EMERGENCY': 
        return { 
          color: 'from-red-500 to-orange-500', 
          bg: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
          icon: '🆘',
          label: 'Emergency'
        }
      case 'TIME_ACCESS': 
        return { 
          color: 'from-blue-500 to-cyan-500', 
          bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
          icon: '⏰',
          label: 'Time/Access'
        }
      case 'RESOURCE_RENT': 
        return { 
          color: 'from-green-500 to-emerald-500', 
          bg: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
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
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help Requests</h1>
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
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help Requested</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {problems.length} requests nearby • Tap to help
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

      {/* Location Status */}
      {location && (
        <div className={`px-4 py-2 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'} border-b`}>
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-green-600" />
            <span className={darkMode ? 'text-green-400' : 'text-green-700'}>
              Showing requests within 20 KM
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <Button variant="outline" onClick={fetchProblems} className="mt-4 rounded-xl">
              Try Again
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
              Check back later or expand your search
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((problem, index) => (
              <HelpRequestCard 
                key={problem.id}
                problem={problem}
                index={index}
                darkMode={darkMode}
                getTypeInfo={getTypeInfo}
                getCategoryLabel={getCategoryLabel}
                onSelect={() => setSelectedProblem(problem)}
                onHelp={() => handleReadyToHelp(problem)}
                onCall={() => handleCallUser(problem.postedBy.phone)}
                onMessage={() => handleShareViaMessage(problem)}
                isLoading={acceptingId === problem.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProblem && (
          <ProblemDetailModal 
            problem={selectedProblem}
            darkMode={darkMode}
            getTypeInfo={getTypeInfo}
            getCategoryLabel={getCategoryLabel}
            onClose={() => setSelectedProblem(null)}
            onHelp={() => {
              handleReadyToHelp(selectedProblem)
              setSelectedProblem(null)
            }}
            onCall={() => handleCallUser(selectedProblem.postedBy.phone)}
            onMessage={() => handleShareViaMessage(selectedProblem)}
            isLoading={acceptingId === selectedProblem.id}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Help Request Card Component
function HelpRequestCard({ 
  problem, 
  index, 
  darkMode,
  getTypeInfo,
  getCategoryLabel,
  onSelect,
  onHelp,
  onCall,
  onMessage,
  isLoading
}: {
  problem: Problem
  index: number
  darkMode: boolean
  getTypeInfo: (type: ProblemType) => { color: string; bg: string; icon: string; label: string }
  getCategoryLabel: (type: ProblemType, categoryId: string | null) => string
  onSelect: () => void
  onHelp: () => void
  onCall: () => void
  onMessage: () => void
  isLoading: boolean
}) {
  const typeInfo = getTypeInfo(problem.type)
  const trustInfo = getTrustBadge(problem.postedBy.trustScore)
  const clientName = problem.postedBy.name || 'User'
  const clientInitial = clientName.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} overflow-hidden shadow-lg`}>
        {/* Type indicator bar */}
        <div className={`h-1.5 bg-gradient-to-r ${typeInfo.color}`} />
        
        <CardContent className="p-4">
          {/* Header with client info */}
          <div className="flex items-start gap-3 mb-3">
            {/* Client Photo/Avatar */}
            <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
              <AvatarImage src={problem.postedBy.avatar || undefined} alt={clientName} />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-lg">
                {clientInitial}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              {/* Client Name */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {clientName}
                </h3>
                <Badge className={`${trustInfo.color} text-xs`}>
                  <Star className="w-3 h-3 mr-1" />
                  {trustInfo.score}
                </Badge>
              </div>
              
              {/* Category Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={typeInfo.bg}>
                  {typeInfo.icon} {typeInfo.label}
                </Badge>
                {problem.category && (
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getCategoryLabel(problem.type, problem.category)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Time */}
            <div className="text-right">
              <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Clock className="w-3 h-3" />
                {formatDate(problem.createdAt)}
              </div>
            </div>
          </div>
          
          {/* Problem Title */}
          <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {problem.title}
          </h4>
          
          {/* Problem Description */}
          {problem.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {problem.description}
            </p>
          )}
          
          {/* Problem Image */}
          {problem.primaryImage && (
            <div className="mb-3 rounded-xl overflow-hidden">
              <img 
                src={problem.primaryImage} 
                alt="Problem" 
                className="w-full h-32 object-cover"
              />
            </div>
          )}
          
          {/* Details Row */}
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
              <Shield className="w-4 h-4" />
              <span>Trust: {problem.minTrustRequired}+</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onSelect}
              className="flex-1 h-11 rounded-xl"
            >
              Details
            </Button>
            <Button
              size="sm"
              onClick={onHelp}
              disabled={isLoading}
              className="flex-1 h-11 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ready to Help
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCall}
              className="h-11 w-11 p-0 rounded-xl"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Problem Detail Modal
function ProblemDetailModal({
  problem,
  darkMode,
  getTypeInfo,
  getCategoryLabel,
  onClose,
  onHelp,
  onCall,
  onMessage,
  isLoading
}: {
  problem: Problem
  darkMode: boolean
  getTypeInfo: (type: ProblemType) => { color: string; bg: string; icon: string; label: string }
  getCategoryLabel: (type: ProblemType, categoryId: string | null) => string
  onClose: () => void
  onHelp: () => void
  onCall: () => void
  onMessage: () => void
  isLoading: boolean
}) {
  const typeInfo = getTypeInfo(problem.type)
  const trustInfo = getTrustBadge(problem.postedBy.trustScore)
  const clientName = problem.postedBy.name || 'User'
  const clientInitial = clientName.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full rounded-t-3xl max-h-[85vh] shadow-2xl`}
      >
        <div className="p-6 overflow-y-auto max-h-[85vh]">
          {/* Handle */}
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
          </div>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl"
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
          </Button>
          
          {/* Client Info Header */}
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
              <AvatarImage src={problem.postedBy.avatar || undefined} alt={clientName} />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-xl">
                {clientInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {clientName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${trustInfo.color}`}>
                  <Star className="w-3 h-3 mr-1" />
                  {trustInfo.score} {trustInfo.label}
                </Badge>
                <Badge className={typeInfo.bg}>
                  {typeInfo.icon} {typeInfo.label}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Problem Image */}
          {problem.primaryImage && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <img 
                src={problem.primaryImage} 
                alt="Problem" 
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          {/* Category */}
          <div className="mb-3">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Category</p>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {getCategoryLabel(problem.type, problem.category)}
            </p>
          </div>
          
          {/* Title */}
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {problem.title}
          </h3>
          
          {/* Description */}
          {problem.description && (
            <div className="mb-4">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Problem Details</p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {problem.description}
              </p>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-center">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distance</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatDistance(problem.distance || 0)}
              </p>
            </div>
            <div className="text-center border-x border-gray-200 dark:border-gray-600">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Offer</p>
              <p className="text-lg font-bold text-green-600">
                {formatPrice(problem.offerPrice)}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posted</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {formatDate(problem.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
            <h4 className={`font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
              <Phone className="w-4 h-4" />
              Contact Info
            </h4>
            <div className="space-y-2 text-sm">
              <p className={darkMode ? 'text-blue-300' : 'text-blue-600'}>
                <span className="font-medium">Phone:</span> +91 {problem.postedBy.phone}
              </p>
              {problem.address && (
                <p className={darkMode ? 'text-blue-300' : 'text-blue-600'}>
                  <span className="font-medium">Address:</span> {problem.address}
                </p>
              )}
            </div>
          </div>
          
          {/* How to Help */}
          <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'} border`}>
            <h4 className={`font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
              <MessageCircle className="w-4 h-4" />
              How to Help?
            </h4>
            <ol className={`text-sm space-y-1 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              <li>1. Tap "Ready to Help" button</li>
              <li>2. WhatsApp opens with your details</li>
              <li>3. Discuss problem & price</li>
              <li>4. Go & help them</li>
              <li>5. Take payment (Cash/UPI)</li>
            </ol>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Skip
            </Button>
            <Button
              onClick={onHelp}
              disabled={isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ready to Help
                </>
              )}
            </Button>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="ghost"
              onClick={onCall}
              className="flex-1 h-10 rounded-xl"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Direct
            </Button>
            <Button
              variant="ghost"
              onClick={onMessage}
              className="flex-1 h-10 rounded-xl"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
