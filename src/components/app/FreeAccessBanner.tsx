'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Clock, Sparkles } from 'lucide-react'

interface FreeAccessBannerProps {
  darkMode: boolean
}

export function FreeAccessBanner({ darkMode }: FreeAccessBannerProps) {
  const [daysLeft, setDaysLeft] = useState(0)
  const [hoursLeft, setHoursLeft] = useState(0)
  
  useEffect(() => {
    const freeAccessEndDate = new Date('2026-04-01T00:00:00')
    
    const updateCountdown = () => {
      const now = new Date()
      const diff = freeAccessEndDate.getTime() - now.getTime()
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        setDaysLeft(days)
        setHoursLeft(hours)
      } else {
        // After April 1, 2026 - payment required
        setDaysLeft(0)
        setHoursLeft(0)
      }
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])
  
  // After April 1, 2026, don't show this banner
  if (daysLeft === 0 && hoursLeft === 0) {
    return null
  }
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-2xl overflow-hidden shadow-lg ${
        darkMode 
          ? 'bg-gradient-to-r from-green-900/50 via-emerald-900/50 to-teal-900/50 border border-green-800' 
          : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <h3 className="font-bold text-white text-lg">
                FREE Access! 🎉
              </h3>
            </div>
            <p className="text-white/90 text-sm">
              सभी features मुफ्त - सभी के लिए खुला!
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 bg-white/20 rounded-lg px-3 py-1.5">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white font-bold">
                {daysLeft}d {hoursLeft}h
              </span>
            </div>
            <p className="text-white/70 text-xs mt-1">until 01 Apr 2026</p>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-white/10 rounded-xl">
          <p className="text-white/90 text-xs text-center">
            ✨ 01 April 2026 तक सभी users को <strong>FREE</strong> access! इसके बाद ₹49/month
          </p>
        </div>
      </div>
    </motion.div>
  )
}
