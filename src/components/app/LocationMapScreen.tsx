'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  Phone, 
  Navigation, 
  MapPin,
  Clock,
  Star,
  X,
  Loader2,
  AlertCircle,
  Filter,
  Layers,
  ExternalLink,
  Directions
} from 'lucide-react'
import { useAppStore } from '@/store'
import { Problem, ProblemType, formatDistance, formatPrice, formatDate, getTrustBadge, calculateDistance } from '@/types'
import { GoogleMapComponent } from './GoogleMapComponent'

export function LocationMapScreen() {
  const { user, location, setScreen, isSubscriptionActive, darkMode, goBack } = useAppStore()
  
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<ProblemType | 'ALL'>('ALL')
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const canView = isSubscriptionActive()

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
        // Add distance to each problem
        const problemsWithDistance = data.problems.map((p: Problem) => ({
          ...p,
          distance: calculateDistance(location.lat, location.lng, p.lat, p.lng)
        }))
        // Filter by trust score requirement
        const myTrustScore = user?.trustScore || 50
        const eligible = problemsWithDistance.filter((p: Problem) => myTrustScore >= p.minTrustRequired)
        setProblems(eligible)
      } else {
        setError(data.error || 'Failed to fetch requests')
      }
    } catch {
      setError('Something went wrong / कुछ गलत हो गया')
    } finally {
      setIsLoading(false)
    }
  }, [user, location])

  useEffect(() => {
    if (canView && location) {
      fetchProblems()
    }
  }, [canView, location, fetchProblems])

  // Filter problems
  const filteredProblems = problems.filter(p => 
    activeFilter === 'ALL' || p.type === activeFilter
  )

  // Handle marker click
  const handleMarkerClick = (problem: Problem) => {
    setSelectedProblem(problem)
  }

  // Open directions in Google Maps
  const openDirections = (problem: Problem) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${problem.lat},${problem.lng}&travelmode=driving`
    window.open(url, '_blank')
  }

  // Call the problem poster
  const callPoster = (problem: Problem) => {
    window.open(`tel:+91${problem.postedBy.phone}`, '_self')
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

  // Subscription check
  if (!canView) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
            </Button>
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Map View</h1>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className={`w-20 h-20 rounded-3xl ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'} flex items-center justify-center mb-4`}>
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Subscription Required</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
            Activate your subscription to view map
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
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-sm`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={goBack} className="rounded-xl">
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div className="flex-1">
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Map View</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredProblems.length} problems within 20 KM
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-xl"
          >
            <Filter className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
        </div>

        {/* Filter Pills */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
                {[
                  { id: 'ALL', label: 'All', icon: Layers },
                  { id: 'EMERGENCY', label: 'Emergency', icon: AlertCircle, color: 'red' },
                  { id: 'TIME_ACCESS', label: 'Time', icon: Clock, color: 'blue' },
                  { id: 'RESOURCE_RENT', label: 'Rent', icon: MapPin, color: 'green' },
                ].map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(filter.id as ProblemType | 'ALL')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                      activeFilter === filter.id
                        ? `bg-gradient-to-r ${
                            filter.color === 'red' ? 'from-red-500 to-orange-500' :
                            filter.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                            filter.color === 'green' ? 'from-green-500 to-emerald-500' :
                            'from-orange-500 to-red-500'
                          } text-white shadow-lg`
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                          : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    <filter.icon className="w-4 h-4" />
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Map load ho raha hai...</p>
            </div>
          </div>
        ) : error ? (
          <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="text-center p-6">
              <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
              <Button variant="outline" onClick={fetchProblems} className="mt-4 rounded-xl">
                Try Again
              </Button>
            </div>
          </div>
        ) : location ? (
          <GoogleMapComponent
            problems={filteredProblems}
            userLocation={location}
            onMarkerClick={handleMarkerClick}
            darkMode={darkMode}
            selectedProblem={selectedProblem}
            radiusKm={20}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="text-center p-6">
              <Navigation className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Location access needed
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Location access की जरूरत है
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Problem Detail Bottom Sheet */}
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
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full rounded-t-3xl max-h-[70vh] shadow-2xl`}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3">
                <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              </div>

              <ScrollArea className="max-h-[calc(70vh-24px)]">
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <Badge className={getTypeInfo(selectedProblem.type).bg}>
                      {getTypeInfo(selectedProblem.type).icon} {getTypeInfo(selectedProblem.type).label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProblem(null)}
                      className="rounded-xl -mr-2"
                    >
                      <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                    </Button>
                  </div>

                  {/* Title */}
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedProblem.title}
                  </h2>

                  {/* Description */}
                  {selectedProblem.description && (
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {selectedProblem.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className={`flex gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatDistance(selectedProblem.distance || 0)}
                        </span>
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distance</p>
                    </div>
                    <div className="flex-1 text-center border-x border-gray-600/30">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-lg font-bold text-green-500">
                          {formatPrice(selectedProblem.offerPrice)}
                        </span>
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Offer</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        OPEN
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => openDirections(selectedProblem)}
                      className={`flex-1 h-12 rounded-xl font-medium ${darkMode ? 'border-gray-600' : ''}`}
                    >
                      <Directions className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button
                      onClick={() => callPoster(selectedProblem)}
                      className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>

                  {/* Open in Maps Link */}
                  <button
                    onClick={() => openDirections(selectedProblem)}
                    className={`w-full flex items-center justify-center gap-2 text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Google Maps
                  </button>
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Problems List Drawer - Mini version at bottom */}
      {!selectedProblem && !isLoading && filteredProblems.length > 0 && (
        <div className={`absolute bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-t-2xl shadow-lg`}>
          <div className="flex justify-center pt-2">
            <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
          </div>
          <ScrollArea className="h-32">
            <div className="flex gap-3 p-4 overflow-x-auto">
              {filteredProblems.slice(0, 10).map((problem) => {
                const typeInfo = getTypeInfo(problem.type)
                return (
                  <motion.button
                    key={problem.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedProblem(problem)}
                    className={`flex-shrink-0 w-48 p-3 rounded-xl text-left ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{typeInfo.icon}</span>
                      <span className={`text-xs font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {problem.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDistance(problem.distance || 0)}
                      </span>
                      <span className="text-xs font-bold text-green-500">
                        {formatPrice(problem.offerPrice)}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
