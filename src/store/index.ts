import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, Problem, AppScreen, Location, TrustInfo, getTrustBadge, Notification } from '@/types'

// SOS Alert type
export interface SOSAlert {
  id: string
  userId: string
  problemId?: string
  lat: number
  lng: number
  message?: string
  status: 'ACTIVE' | 'RESOLVED' | 'FALSE_ALARM'
  createdAt: Date
  resolvedAt?: Date
}

// Location Address type
export interface LocationAddress {
  village: string
  city: string
  state: string
  pincode: string
  country: string
  displayName: string
}

// App visibility state for tracking when app is in foreground
let isAppVisible = true
let locationWatchId: number | null = null

// Setup visibility change listener (only on client)
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    isAppVisible = !document.hidden
    // Stop location tracking when app goes to background
    if (document.hidden && locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId)
      locationWatchId = null
    }
  })

  // Also listen for page unload
  window.addEventListener('beforeunload', () => {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId)
    }
  })
}

interface AppState {
  // Auth
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loginPhone: string | null // Phone during login flow
  loginName: string | null // Name during login flow
  
  // Navigation
  currentScreen: AppScreen
  previousScreen: AppScreen | null
  
  // Location
  location: Location | null
  locationError: string | null
  locationAddress: LocationAddress | null // Address details from reverse geocoding
  
  // Problems
  nearbyProblems: Problem[]
  myProblems: Problem[]
  selectedProblem: Problem | null
  
  // Notifications
  notifications: Notification[]
  unreadCount: number
  
  // SOS (Emergency)
  sosActive: boolean
  activeSOS: SOSAlert | null
  sosHistory: SOSAlert[]
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Theme
  darkMode: boolean
  
  // Referral
  tempReferralCode: string | null
  usedReferralCode: string | null // Code user entered to join
  
  // Admin Mode
  isAdmin: boolean
}

interface AppActions {
  // Auth
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoginPhone: (phone: string | null) => void
  setLoginName: (name: string | null) => void
  logout: () => void
  
  // Navigation
  setScreen: (screen: AppScreen) => void
  goBack: () => void
  
  // Location
  setLocation: (location: Location | null) => void
  setLocationError: (error: string | null) => void
  setLocationAddress: (address: LocationAddress | null) => void
  requestLocation: () => Promise<Location | null>
  fetchLocationAddress: (lat: number, lng: number) => Promise<LocationAddress | null>
  startLocationTracking: () => void
  stopLocationTracking: () => void
  
  // Problems
  setNearbyProblems: (problems: Problem[]) => void
  setMyProblems: (problems: Problem[]) => void
  setSelectedProblem: (problem: Problem | null) => void
  
  // Notifications
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
  
  // SOS (Emergency)
  triggerSOS: (alert: SOSAlert) => void
  resolveSOS: () => void
  cancelSOS: () => void
  setSOSHistory: (alerts: SOSAlert[]) => void
  addSOSToHistory: (alert: SOSAlert) => void
  
  // UI State
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Theme
  toggleDarkMode: () => void
  setDarkMode: (darkMode: boolean) => void
  
  // Referral
  setTempReferralCode: (code: string | null) => void
  setReferralCode: (code: string | null) => void
  
  // Admin
  setAdminMode: (isAdmin: boolean) => void
  
  // Computed
  getTrustInfo: () => TrustInfo | null
  isSubscriptionActive: () => boolean
  canPostProblem: () => boolean
  canViewProblems: () => boolean
  isSOSActive: () => boolean
}

const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loginPhone: null,
  loginName: null,
  currentScreen: 'splash',
  previousScreen: null,
  location: null,
  locationError: null,
  locationAddress: null,
  nearbyProblems: [],
  myProblems: [],
  selectedProblem: null,
  notifications: [],
  unreadCount: 0,
  // SOS state
  sosActive: false,
  activeSOS: null,
  sosHistory: [],
  isLoading: false,
  error: null,
  darkMode: false,
  tempReferralCode: null,
  usedReferralCode: null,
  isAdmin: false,
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoginPhone: (phone) => set({ loginPhone: phone }),
      setLoginName: (name) => set({ loginName: name }),
      logout: () => set({ 
        ...initialState, 
        currentScreen: 'login',
        token: null,
        user: null,
        loginPhone: null,
        loginName: null,
        isAuthenticated: false,
        location: null,
        locationAddress: null
      }),

      // Navigation
      setScreen: (screen) => set((state) => ({ 
        previousScreen: state.currentScreen, 
        currentScreen: screen 
      })),
      goBack: () => set((state) => ({ 
        currentScreen: state.previousScreen || 'home',
        previousScreen: null 
      })),

      // Location
      setLocation: (location) => set({ location, locationError: null }),
      setLocationError: (error) => set({ locationError: error }),
      setLocationAddress: (address) => set({ locationAddress: address }),
      
      // Request location - only when user is actively using app
      requestLocation: async () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
          set({ locationError: 'Location not supported / स्थान समर्थित नहीं है' })
          return null
        }

        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 60000, // Cache for 1 minute
            })
          })

          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          set({
            location: newLocation,
            locationError: null,
          })
          
          // Fetch address details
          get().fetchLocationAddress(newLocation.lat, newLocation.lng)
          
          return newLocation
        } catch (error: unknown) {
          const geoError = error as GeolocationPositionError
          let errorMsg = 'Please enable location access / कृपया स्थान एक्सेस सक्षम करें'
          
          if (geoError?.code === 1) {
            errorMsg = 'Location permission denied. Please enable in browser settings. / स्थान अनुमति अस्वीकार की गई'
          } else if (geoError?.code === 2) {
            errorMsg = 'Location unavailable. Please check your device. / स्थान अनुपलब्ध'
          } else if (geoError?.code === 3) {
            errorMsg = 'Location request timed out. Please try again. / स्थान अनुरोध समय समाप्त'
          }
          
          set({ locationError: errorMsg })
          return null
        }
      },
      
      // Fetch address from coordinates using reverse geocoding
      fetchLocationAddress: async (lat: number, lng: number) => {
        try {
          const res = await fetch(`/api/location/reverse?lat=${lat}&lng=${lng}`)
          const data = await res.json()
          
          if (data.success && data.location) {
            set({ locationAddress: data.location })
            return data.location
          }
        } catch (error) {
          console.error('Failed to fetch location address:', error)
        }
        return null
      },

      // Start continuous location tracking (only when app is visible)
      startLocationTracking: () => {
        if (typeof window === 'undefined' || !navigator.geolocation) return
        
        // Don't start if app is not visible
        if (!isAppVisible) return

        // Clear any existing watch
        if (locationWatchId !== null) {
          navigator.geolocation.clearWatch(locationWatchId)
        }

        locationWatchId = navigator.geolocation.watchPosition(
          (position) => {
            // Only update if app is visible
            if (isAppVisible) {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              set({ location: newLocation, locationError: null })
              get().fetchLocationAddress(newLocation.lat, newLocation.lng)
            }
          },
          (error) => {
            console.error('Location tracking error:', error)
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 60000,
          }
        )
      },

      // Stop location tracking
      stopLocationTracking: () => {
        if (locationWatchId !== null) {
          navigator.geolocation.clearWatch(locationWatchId)
          locationWatchId = null
        }
      },

      // Problems
      setNearbyProblems: (problems) => set({ nearbyProblems: problems }),
      setMyProblems: (problems) => set({ myProblems: problems }),
      setSelectedProblem: (problem) => set({ selectedProblem: problem }),

      // Notifications
      setNotifications: (notifications) => set({ 
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }),
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      // SOS (Emergency)
      triggerSOS: (alert) => set((state) => ({
        sosActive: true,
        activeSOS: alert,
        sosHistory: [alert, ...state.sosHistory]
      })),
      resolveSOS: () => set((state) => {
        if (state.activeSOS) {
          const resolvedAlert = {
            ...state.activeSOS,
            status: 'RESOLVED' as const,
            resolvedAt: new Date()
          }
          return {
            sosActive: false,
            activeSOS: null,
            sosHistory: state.sosHistory.map(a => 
              a.id === resolvedAlert.id ? resolvedAlert : a
            )
          }
        }
        return { sosActive: false, activeSOS: null }
      }),
      cancelSOS: () => set((state) => {
        if (state.activeSOS) {
          const cancelledAlert = {
            ...state.activeSOS,
            status: 'FALSE_ALARM' as const,
            resolvedAt: new Date()
          }
          return {
            sosActive: false,
            activeSOS: null,
            sosHistory: state.sosHistory.map(a => 
              a.id === cancelledAlert.id ? cancelledAlert : a
            )
          }
        }
        return { sosActive: false, activeSOS: null }
      }),
      setSOSHistory: (alerts) => set({ sosHistory: alerts }),
      addSOSToHistory: (alert) => set((state) => ({
        sosHistory: [alert, ...state.sosHistory]
      })),

      // UI State
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Theme
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode
        set({ darkMode: newDarkMode })
        // Update document class
        if (newDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      setDarkMode: (darkMode) => {
        set({ darkMode })
        if (darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      // Referral
      setTempReferralCode: (code) => set({ tempReferralCode: code }),
      setReferralCode: (code) => set({ usedReferralCode: code }),

      // Admin
      setAdminMode: (isAdmin) => set({ isAdmin }),

      // Computed
      getTrustInfo: () => {
        const { user } = get()
        if (!user) return null
        return getTrustBadge(user.trustScore)
      },
      
      isSubscriptionActive: () => {
        const { user } = get()
        if (!user) return false
        if (!user.paymentActive) return false
        if (user.activeTill && new Date(user.activeTill) < new Date()) return false
        return true
      },
      
      canPostProblem: () => {
        const { user } = get()
        if (!user) return false
        if (!get().isSubscriptionActive()) return false
        if (user.isBlocked || user.isBanned) return false
        if (user.trustScore < 30) return false
        return true
      },
      
      canViewProblems: () => {
        const { user } = get()
        if (!user) return false
        if (!get().isSubscriptionActive()) return false
        if (user.isBlocked || user.isBanned) return false
        return true
      },
      
      isSOSActive: () => {
        return get().sosActive
      },
    }),
    {
      name: 'help2earn-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        darkMode: state.darkMode,
        tempReferralCode: state.tempReferralCode,
        usedReferralCode: state.usedReferralCode,
        loginPhone: state.loginPhone,
        loginName: state.loginName,
        location: state.location,
        locationAddress: state.locationAddress,
      }),
    }
  )
)
