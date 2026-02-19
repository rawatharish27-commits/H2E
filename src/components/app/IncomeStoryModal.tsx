'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ArrowRight, Star, Clock, Users, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/store'

interface IncomeStoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: {
    id: string
    icon: string
    titleEn: string
    titleHi: string
    descriptionEn: string
    descriptionHi: string
    avgEarning: string
    timeRequired: string
    successRate: string
    isDailyNeed?: boolean
    gradient: string
  }
}

export function IncomeStoryModal({ isOpen, onClose, category }: IncomeStoryModalProps) {
  const { darkMode, isSubscriptionActive } = useAppStore()
  const isActive = isSubscriptionActive()

  return (
    <AnimatePresence>
      {isOpen && (
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
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full rounded-t-3xl p-6 max-h-[80vh] shadow-2xl overflow-y-auto`}
          >
            {/* Handle Bar */}
            <div className="flex justify-center mb-4">
              <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-4xl shadow-xl`}
                >
                  {category.icon}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {category.titleEn}
                    </h3>
                    {category.isDailyNeed && (
                      <Badge className="bg-orange-500 text-white text-xs font-bold">Daily</Badge>
                    )}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {category.titleHi}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
              </Button>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-base mb-2`}>
                {category.descriptionEn}
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                {category.descriptionHi}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-2xl text-center`}>
                <Star className={`w-5 h-5 mx-auto mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <p className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{category.avgEarning}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Earning</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-2xl text-center`}>
                <Clock className={`w-5 h-5 mx-auto mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{category.timeRequired}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} p-4 rounded-2xl text-center`}>
                <Users className={`w-5 h-5 mx-auto mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{category.successRate}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Success</p>
              </div>
            </div>

            {/* Benefits */}
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-2xl mb-5`}>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Why neighbors help with this?
              </h4>
              <div className="space-y-2">
                {[
                  category.isDailyNeed ? 'Regular daily income opportunity' : 'Flexible timing, earn when available',
                  'No special skills needed - just willingness to help',
                  'Build trust and reputation in your community'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {isActive ? (
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold h-14 rounded-2xl text-lg shadow-xl"
                onClick={onClose}
              >
                Get Started / शुरू करें
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <div className="text-center">
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Activate subscription to get help
                </p>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold"
                  onClick={onClose}
                >
                  Activate Now / अभी सक्रिय करें
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
