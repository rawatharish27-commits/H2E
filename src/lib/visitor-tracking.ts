'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@/store'

// Generate or get session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('h2e_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem('h2e_session_id', sessionId)
  }
  return sessionId
}

// Track visitor on app load
export function useVisitorTracking() {
  const user = useAppStore(state => state.user)
  const currentScreen = useAppStore(state => state.currentScreen)
  const userIdRef = useRef(user?.id)
  const screenRef = useRef(currentScreen)

  // Keep refs updated
  useEffect(() => {
    userIdRef.current = user?.id
    screenRef.current = currentScreen
  }, [user?.id, currentScreen])

  // Track visit
  const trackVisit = useCallback(async (action?: string) => {
    const sessionId = getSessionId()
    if (!sessionId) return

    try {
      await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: userIdRef.current,
          page: screenRef.current,
          action
        })
      })
    } catch (error) {
      console.error('Failed to track visit:', error)
    }
  }, [])

  // Track on mount
  useEffect(() => {
    trackVisit()
    
    // Track every 2 minutes to keep session alive
    const interval = setInterval(() => {
      trackVisit()
    }, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [trackVisit])

  // Track registration
  const trackRegistration = useCallback(() => {
    trackVisit('register')
  }, [trackVisit])

  // Track login
  const trackLogin = useCallback(() => {
    trackVisit('login')
  }, [trackVisit])

  return { trackRegistration, trackLogin }
}

// Standalone tracking function for manual tracking
export async function trackVisitorAction(action: 'register' | 'login') {
  const sessionId = getSessionId()
  if (!sessionId) return

  try {
    await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        action
      })
    })
  } catch (error) {
    console.error('Failed to track action:', error)
  }
}
