'use client'

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store'
import { LoginScreen } from '@/components/app/LoginScreen'
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
import { UserDashboard } from '@/components/app/UserDashboard'
import { LeaderDashboardScreen } from '@/components/app/LeaderDashboardScreen'
import SplashScreen from '@/components/ui/SplashScreen'

export default function Home() {
  const { 
    currentScreen, 
    isAuthenticated, 
    setScreen, 
    user,
    darkMode,
    setDarkMode,
    goBack,
    requestLocation
  } = useAppStore()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  
  const hasNavigated = useRef(false)

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    // Small delay to ensure hydration completes
    const timer = setTimeout(() => {
      setIsHydrated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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
      
      // Request location immediately on app start
      requestLocation()
      
      // Splash delay - 2.5 seconds (reduced for mobile)
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      setIsLoading(false)
    }
    
    init()
  }, [setDarkMode, requestLocation])

  // Handle navigation after loading AND hydration
  useEffect(() => {
    // Wait for both loading to complete AND hydration to finish
    if (isLoading || !isHydrated || hasNavigated.current) return
    
    hasNavigated.current = true
    
    try {
      if (isAuthenticated && user) {
        // User is logged in
        if (user.darkMode !== undefined) {
          setDarkMode(user.darkMode)
        }
        
        // Check subscription status
        if (user.paymentActive && user.activeTill && new Date(user.activeTill) > new Date()) {
          // Check if user has seen the dashboard onboarding
          const hasSeenDashboard = localStorage.getItem('hasSeenDashboard')
          if (!hasSeenDashboard) {
            setScreen('dashboard')
          } else {
            setScreen('home')
          }
        } else {
          setScreen('subscription')
        }
      } else {
        // New user flow: Splash → Welcome → Referral → Login → Subscription → Home
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
        
        // Always show welcome screen for new users (hasSeenWelcome not set)
        if (!hasSeenWelcome) {
          // First time - show welcome screen
          setScreen('welcome')
        } else {
          // Returning user - go to login directly
          setScreen('login')
        }
      }
    } catch {
      setScreen('welcome')
    }
  }, [isLoading, isHydrated, isAuthenticated, user, setScreen, setDarkMode])

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
      case 'username':
        return <UsernameScreen onComplete={() => setScreen('home')} />
      case 'dashboard':
        return <UserDashboard />
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
      case 'leader-dashboard':
        return <LeaderDashboardScreen />
      case 'referral':
        return <PreLoginShareScreen />
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
