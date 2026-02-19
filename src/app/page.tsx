'use client'

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store'
import { LoginScreen } from '@/components/app/LoginScreen'
import { OtpScreen } from '@/components/app/OtpScreen'
import { HomeScreen } from '@/components/app/HomeScreen'
import { SubscriptionScreen } from '@/components/app/SubscriptionScreen'
import { PostProblemScreen } from '@/components/app/PostProblemScreen'
import { NearbyProblemsScreen } from '@/components/app/NearbyProblemsScreen'
import { LocationMapScreen } from '@/components/app/LocationMapScreen'
import { ProfileScreen } from '@/components/app/ProfileScreen'
import { AdminPanel } from '@/components/app/AdminPanel'
import { WelcomeScreen } from '@/components/app/WelcomeScreen'
import { PreLoginShareScreen } from '@/components/app/PreLoginShareScreen'
import { PrivacySettingsScreen } from '@/components/app/PrivacySettingsScreen'
import { NotificationSettingsScreen } from '@/components/app/NotificationSettingsScreen'
import { TermsScreen } from '@/components/app/TermsScreen'
import { UsernameScreen } from '@/components/app/UsernameScreen'
import { AboutScreen } from '@/components/app/AboutScreen'
import { ContactScreen } from '@/components/app/ContactScreen'
import { PrivacyScreen } from '@/components/app/PrivacyScreen'
import { LegalScreen } from '@/components/app/LegalScreen'
import { HandHeart } from 'lucide-react'

// Simple splash screen - just branding
function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center mb-8 shadow-2xl">
        <HandHeart className="w-16 h-16 text-orange-500" />
      </div>
      
      <h1 className="text-4xl font-bold mb-3">Help2Earn</h1>
      <p className="text-white/90 text-center px-8 text-lg">Connecting People</p>
      <p className="text-white/70 text-center px-8 mt-2">लोगों को जोड़ना</p>
      
      <div className="mt-10">
        <div className="w-10 h-10 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  )
}

export default function Home() {
  const { 
    currentScreen, 
    isAuthenticated, 
    setScreen, 
    user,
    darkMode,
    setDarkMode,
    goBack,
    loginPhone
  } = useAppStore()
  
  const [mounted, setMounted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  
  const hasNavigated = useRef(false)

  // Initialize app
  useEffect(() => {
    const init = async () => {
      // Check dark mode preference
      try {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setDarkMode(true)
        }
      } catch {
        // Ignore
      }
      
      // Splash delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsLoading(false)
    }
    
    init()
  }, [setDarkMode])

  // Handle navigation after loading
  useEffect(() => {
    if (isLoading || !mounted || hasNavigated.current) return
    
    hasNavigated.current = true
    
    try {
      if (isAuthenticated && user) {
        // User is logged in
        if (user.darkMode !== undefined) {
          setDarkMode(user.darkMode)
        }
        
        // Check subscription status
        if (user.paymentActive && user.activeTill && new Date(user.activeTill) > new Date()) {
          setScreen('home')
        } else {
          setScreen('subscription')
        }
      } else {
        // New user flow: Explain → Share → Login → OTP → Subscription → Home
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
        
        if (!hasSeenWelcome) {
          // First time - show explain screens
          setScreen('welcome')
        } else {
          // Returning user - go to login
          if (loginPhone) {
            setScreen('otp')
          } else {
            setScreen('login')
          }
        }
      }
    } catch {
      setScreen('welcome')
    }
  }, [isLoading, mounted, isAuthenticated, user, loginPhone, setScreen, setDarkMode])

  // Render screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />
      case 'welcome':
        return <WelcomeScreen />
      case 'pre-login-share':
        return <PreLoginShareScreen />
      case 'login':
        return <LoginScreen />
      case 'otp':
        const phone = loginPhone || (typeof window !== 'undefined' ? sessionStorage.getItem('loginPhone') : null)
        return phone ? <OtpScreen phone={phone} /> : <LoginScreen />
      case 'username':
        return <UsernameScreen onComplete={() => setScreen('home')} />
      case 'home':
        return <HomeScreen />
      case 'subscription':
        return <SubscriptionScreen />
      case 'post-problem':
        return <PostProblemScreen />
      case 'nearby':
        return <NearbyProblemsScreen />
      case 'map':
        return <LocationMapScreen />
      case 'profile':
        return <ProfileScreen />
      case 'admin':
        return <AdminPanel />
      case 'privacy-settings':
        return <PrivacySettingsScreen onBack={goBack} />
      case 'notification-settings':
        return <NotificationSettingsScreen />
      case 'terms':
        return <TermsScreen onBack={goBack} />
      case 'about':
        return <AboutScreen onBack={goBack} />
      case 'contact':
        return <ContactScreen onBack={goBack} />
      case 'privacy':
        return <PrivacyScreen />
      case 'legal':
        return <LegalScreen />
      case 'history':
        return <ProfileScreen />
      default:
        return <HomeScreen />
    }
  }

  // Show splash while loading
  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <AnimatePresence mode="wait">
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
