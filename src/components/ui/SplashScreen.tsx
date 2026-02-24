'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Wallet, Zap, MapPin, Navigation, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store'

// Marketing Splash Screen with Hook - "20KM Radius Me Live Users"
function SplashScreen() {
  const { locationAddress } = useAppStore()
  const [animatedUsers, setAnimatedUsers] = useState(0)
  const [animatedEarnings, setAnimatedEarnings] = useState(0)

  // Animate counters
  useEffect(() => {
    const userInterval = setInterval(() => {
      setAnimatedUsers(prev => {
        if (prev >= 87) {
          clearInterval(userInterval)
          return 87
        }
        return prev + Math.floor(Math.random() * 5) + 1
      })
    }, 50)

    const earningsInterval = setInterval(() => {
      setAnimatedEarnings(prev => {
        if (prev >= 18340) {
          clearInterval(earningsInterval)
          return 18340
        }
        return prev + Math.floor(Math.random() * 500) + 100
      })
    }, 30)

    return () => {
      clearInterval(userInterval)
      clearInterval(earningsInterval)
    }
  }, [])

  // Get location display name
  const locationDisplayName = locationAddress?.displayName || locationAddress?.city || locationAddress?.village || ''

  return (
    <div className="h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex flex-col text-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Live Badge - Top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-6 pb-2 flex justify-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">LIVE - 20KM Radius</span>
        </div>
      </motion.div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-2 pb-28 overflow-y-auto">
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center mb-4"
        >
          {/* Round 3D Logo Container */}
          <div className="w-24 h-24 relative mb-3 rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
            {/* Glossy 3D Highlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-transparent z-20 pointer-events-none" />
            
            {/* Logo Image */}
            <Image
              src="/images/logo.png"
              alt="Community Help Network Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Brand Name */}
          <h1 className="text-3xl font-bold drop-shadow-lg">
            <span className="text-blue-200">Community</span>
            <span className="text-green-200"> Help </span>
            <span className="text-orange-200">Network</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-sm text-white/80">लोगों को जोड़ना</p>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-4"
        >
          {/* Animated Users Counter */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="w-5 h-5 text-white/80" />
            <span className="text-3xl font-bold">{animatedUsers}</span>
          </div>
          <p className="text-white/90 text-base font-medium">Users Online Near You</p>
          <p className="text-white/70 text-sm">20KM Radius Me Live Users</p>

          {/* Location Badge */}
          {locationDisplayName && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white/90 font-medium text-sm">{locationDisplayName}</span>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3 mb-4"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <div className="flex items-center gap-1">
              <Wallet className="w-4 h-4 text-white/70" />
              <span className="text-base font-bold">₹{animatedEarnings.toLocaleString()}</span>
            </div>
            <p className="text-white/70 text-xs">Earned Today</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-white/70" />
              <span className="text-base font-bold">7</span>
            </div>
            <p className="text-white/70 text-xs">Active Tasks</p>
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mb-4"
        >
          <p className="text-white text-lg font-bold">Connect. Trade. Earn.</p>
          <p className="text-white/80 text-sm">Apne Area Ke Logon Se Direct Kamai</p>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="w-8 h-8 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      </div>

      {/* Features Icons - Fixed at Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-black/20 to-transparent flex justify-center gap-6"
      >
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/70 text-xs">Auto Location</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/70 text-xs">20KM Network</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/70 text-xs">Instant Earn</span>
        </div>
      </motion.div>
    </div>
  )
}

export default SplashScreen
