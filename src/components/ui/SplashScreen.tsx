'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Wallet, Zap, MapPin, Navigation, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store'

// Large centered logo for splash screens - Round 3D look (No hydration issues)
function LogoLarge({ tagline = 'Connecting People', taglineHi = 'लोगों को जोड़ना' }: { tagline?: string; taglineHi?: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* Round 3D Logo Container */}
      <div 
        className="
          w-32 h-32 relative mb-6
          rounded-full overflow-hidden
          logo-3d
          animate-bounce-in
        "
      >
        {/* Glossy 3D Highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-transparent z-20 pointer-events-none" />
        
        {/* Logo Image */}
        <Image
          src="/images/logo.png"
          alt="Help2Earn Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Brand Name */}
      <h1 className="text-4xl font-bold mb-2 animate-fade-in-up drop-shadow-lg">
        <span className="text-blue-600">Help</span>
        <span className="text-green-600">2</span>
        <span className="text-orange-600">Earn</span>
      </h1>
      
      {/* Taglines */}
      <p className="text-lg opacity-90 text-white drop-shadow-md animate-fade-in-delay-1">
        {tagline}
      </p>
      
      <p className="text-sm opacity-70 mt-1 text-white/80 animate-fade-in-delay-2">
        {taglineHi}
      </p>
    </div>
  )
}

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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Live Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-8 z-50"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">LIVE - 20KM Radius</span>
        </div>
      </motion.div>

      {/* Logo */}
      <div className="relative z-10 mt-12">
        <LogoLarge />
      </div>

      {/* Live Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        {/* Animated Users Counter */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="w-6 h-6 text-white/80" />
          <span className="text-4xl font-bold">{animatedUsers}</span>
        </div>
        <p className="text-white/90 text-lg font-medium">Users Online Near You</p>
        <p className="text-white/70 text-sm">20KM Radius Me Live Users</p>

        {/* Location Badge */}
        {locationDisplayName && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <MapPin className="w-4 h-4 text-white/80" />
            <span className="text-white/90 font-medium">{locationDisplayName}</span>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 flex gap-4"
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
          <div className="flex items-center gap-1">
            <Wallet className="w-4 h-4 text-white/70" />
            <span className="text-lg font-bold">₹{animatedEarnings.toLocaleString()}</span>
          </div>
          <p className="text-white/70 text-xs">Earned Today</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-white/70" />
            <span className="text-lg font-bold">7</span>
          </div>
          <p className="text-white/70 text-xs">Active Tasks</p>
        </div>
      </motion.div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 text-center"
      >
        <p className="text-white text-lg font-bold">Connect. Trade. Earn.</p>
        <p className="text-white/80 text-sm">Apne Area Ke Logon Se Direct Kamai</p>
      </motion.div>

      {/* Loading Spinner */}
      <div className="mt-8 animate-fade-in-delay-3">
        <div className="w-10 h-10 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
      </div>

      {/* Features Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 z-50 flex justify-center gap-8"
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
