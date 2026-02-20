'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Star,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import type { SeededService } from '@/data/seededServices'

interface SeededServicesGridProps {
  services: SeededService[]
  darkMode: boolean
  onSelectService?: (service: SeededService) => void
}

export function SeededServicesGrid({ services, darkMode, onSelectService }: SeededServicesGridProps) {
  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  // Get category color
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'EMERGENCY':
        return {
          gradient: 'from-red-500 to-orange-500',
          bg: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
          icon: '🆘',
          label: 'Emergency'
        }
      case 'TIME_ACCESS':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
          icon: '⏰',
          label: 'Time/Access'
        }
      case 'RESOURCE_RENT':
        return {
          gradient: 'from-green-500 to-emerald-500',
          bg: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
          icon: '📦',
          label: 'Resource'
        }
      default:
        return {
          gradient: 'from-gray-500 to-slate-500',
          bg: 'bg-gray-100 text-gray-700',
          icon: '📋',
          label: 'Other'
        }
    }
  }

  return (
    <div className="space-y-3">
      {/* Seeded Services Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`px-4 py-3 rounded-xl ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'}`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <div>
            <p className={`font-medium text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Sample Services Available in Your Area
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              20 services • Price ranges visible • Real providers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-3 gap-2">
        {services.map((service, index) => {
          const style = getCategoryStyle(service.category)
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectService?.(service)}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all`}>
                <div className={`h-1 bg-gradient-to-r ${style.gradient}`} />
                <CardContent className="p-2">
                  {/* Provider Avatar */}
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={service.providerAvatar} 
                      alt={service.providerName}
                      className="w-8 h-8 rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.providerName}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {service.providerRating} ({service.providerHelps})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Icon */}
                  <div className={`w-full h-12 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br ${style.gradient}`}>
                    <span className="text-xl">{service.icon}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-semibold text-xs mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.title}
                  </h3>
                  
                  {/* Price Range */}
                  <div className="flex items-center gap-1 mb-1">
                    <IndianRupee className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-bold text-green-600">
                      {service.priceMin === service.priceMax 
                        ? service.priceMin 
                        : `${service.priceMin}-${service.priceMax}`}
                    </span>
                  </div>
                  
                  {/* Distance & Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.distance.toFixed(1)}km
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTimeAgo(service.postedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Service Detail Modal Component
interface SeededServiceModalProps {
  service: SeededService | null
  darkMode: boolean
  onClose: () => void
}

export function SeededServiceModal({ service, darkMode, onClose }: SeededServiceModalProps) {
  if (!service) return null

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'EMERGENCY':
        return {
          gradient: 'from-red-500 to-orange-500',
          bg: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
          icon: '🆘',
          label: 'Emergency'
        }
      case 'TIME_ACCESS':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
          icon: '⏰',
          label: 'Time/Access'
        }
      case 'RESOURCE_RENT':
        return {
          gradient: 'from-green-500 to-emerald-500',
          bg: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
          icon: '📦',
          label: 'Resource Rent'
        }
      default:
        return {
          gradient: 'from-gray-500 to-slate-500',
          bg: 'bg-gray-100 text-gray-700',
          icon: '📋',
          label: 'Other'
        }
    }
  }

  const style = getCategoryStyle(service.category)

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
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full rounded-t-3xl max-h-[80vh] shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className={`h-2 bg-gradient-to-r ${style.gradient}`} />
        
        <div className="p-6 space-y-4">
          {/* Handle */}
          <div className="flex justify-center">
            <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
          </div>

          {/* Provider Info */}
          <div className="flex items-center gap-4">
            <img 
              src={service.providerAvatar} 
              alt={service.providerName}
              className="w-16 h-16 rounded-2xl border-2 border-gray-200"
            />
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {service.providerName}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {service.providerNameHi}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.providerRating}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {service.providerHelps} helps done
                </Badge>
              </div>
            </div>
          </div>

          {/* Service Title */}
          <div>
            <Badge className={style.bg}>
              {style.icon} {style.label}
            </Badge>
            <h2 className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {service.title}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {service.titleHi}
            </p>
          </div>

          {/* Description */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {service.description}
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {service.descriptionHi}
            </p>
          </div>

          {/* Price */}
          <div className={`p-4 rounded-xl bg-gradient-to-r ${style.gradient} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Price Range</p>
                <p className="text-2xl font-bold">
                  ₹{service.priceMin === service.priceMax 
                    ? service.priceMin 
                    : `${service.priceMin} - ₹${service.priceMax}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-xs">{service.priceNote}</p>
                <p className="text-white/60 text-xs">{service.priceNoteHi}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`flex gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex-1 text-center">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distance</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {service.distance.toFixed(1)} km
              </p>
            </div>
            <div className="flex-1 text-center border-x border-gray-200">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Area</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {service.area}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
              <p className="text-lg font-bold text-green-600">Available</p>
            </div>
          </div>

          {/* Sample Service Notice */}
          <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Sample Service
              </span>
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This is a sample service to show app functionality. Post real tasks or activate your account to connect with real helpers.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-medium ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
