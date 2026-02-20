'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  HelpCircle, 
  MapPin, 
  Shield, 
  Star,
  CheckCircle2,
  ArrowRight,
  Menu,
  User,
  Sparkles,
  Clock,
  Zap,
  FileText,
  Phone,
  Info,
  X,
  ChevronRight,
  Search,
  Sun,
  Moon,
  Home,
  Briefcase,
  Users,
  Gift,
  HandHeart,
  Navigation,
  Wallet,
  Flame,
  Trophy,
  Target,
  TrendingUp
} from 'lucide-react'
import { useAppStore } from '@/store'
import { getTrustBadge } from '@/types'
import { allResourceCategories, type Resource, type ResourceCategory } from '@/data/resources'
import { TrustBadge } from './TrustBadge'
import { SOSFloatingButton } from './SOSButton'
import { IncomeStoryModal } from './IncomeStoryModal'

export function HomeScreen() {
  const { user, setScreen, isSubscriptionActive, getTrustInfo, requestLocation, location, darkMode, toggleDarkMode, locationAddress } = useAppStore()
  const [showMenu, setShowMenu] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'emergency' | 'rent' | 'skill'>('all')
  
  // Story Modal State
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<{
    id: number
    icon: string
    title: string
    titleHi?: string
    gradient: string
    category: string
  } | null>(null)

  // Marketing Dashboard State
  const [animatedUsers, setAnimatedUsers] = useState(0)
  const [animatedEarnings, setAnimatedEarnings] = useState(0)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [dailyStreak, setDailyStreak] = useState(3) // Mock streak
  
  // Urgency Banners (Blinkit style)
  const URGENCY_BANNERS = [
    { id: 1, text: '⚡ Only 5 Tasks Left in Your Area!', textHi: 'आपके क्षेत्र में सिर्फ 5 काम बचे!', color: 'from-red-500 to-orange-500' },
    { id: 2, text: '🎁 First Task Bonus ₹50', textHi: 'पहले काम पर ₹50 बोनस!', color: 'from-green-500 to-emerald-500' },
    { id: 3, text: '🔥 Peak Time – Earnings 1.5x', textHi: 'पीक टाइम - 1.5x कमाई!', color: 'from-orange-500 to-red-500' },
    { id: 4, text: '👥 3 People Just Joined Nearby', textHi: '3 लोग अभी-अभी जुड़े!', color: 'from-blue-500 to-cyan-500' },
  ]

  // Animate counters on mount
  useEffect(() => {
    const userInterval = setInterval(() => {
      setAnimatedUsers(prev => {
        if (prev >= 124) {
          clearInterval(userInterval)
          return 124
        }
        return prev + Math.floor(Math.random() * 8) + 1
      })
    }, 40)

    const earningsInterval = setInterval(() => {
      setAnimatedEarnings(prev => {
        if (prev >= 18340) {
          clearInterval(earningsInterval)
          return 18340
        }
        return prev + Math.floor(Math.random() * 600) + 100
      })
    }, 30)

    // Rotate banners every 3 seconds
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % URGENCY_BANNERS.length)
    }, 3000)

    return () => {
      clearInterval(userInterval)
      clearInterval(earningsInterval)
      clearInterval(bannerInterval)
    }
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  const trustInfo = getTrustInfo()
  const isActive = isSubscriptionActive()
  const displayName = user?.name || 'Neighbor'
  const greeting = getGreeting()

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  function getGreetingHindi() {
    const hour = new Date().getHours()
    if (hour < 12) return 'सुप्रभात'
    if (hour < 17) return 'शुभ दोपहर'
    return 'शुभ संध्या'
  }

  // All Help Categories - 15 Daily Need + 30 Situational = 45 cards in 3-column grid
  // FIRST 15: Daily Need Help Categories (Foundation - helps users understand earning potential)
  // NEXT 30: Situational "Think for a moment" cards
  const allHelpCards = [
    // ========== ROW 1-5: DAILY NEED HELP CATEGORIES (15 cards) ==========
    // Row 1 - Critical & Emergency
    { id: 'dn-1', icon: '🆘', situationEn: "Critical / SOS Help?", situationHi: "SOS मदद?", questionEn: "Immediate support!", questionHi: "तत्काल सहायता!", gradient: 'from-red-500 to-rose-600', category: 'critical-sos', isDailyNeed: true },
    { id: 'dn-2', icon: '🚨', situationEn: "Emergency Road?", situationHi: "सड़क पर मदद?", questionEn: "Get help now!", questionHi: "अभी मदद लो!", gradient: 'from-red-400 to-orange-500', category: 'emergency-road', isDailyNeed: true },
    { id: 'dn-3', icon: '🛡️', situationEn: "Safety & Escort?", situationHi: "सुरक्षा चाहिए?", questionEn: "Find escort!", questionHi: "एस्कॉर्ट खोजो!", gradient: 'from-slate-400 to-gray-500', category: 'safety-escort', isDailyNeed: true },
    // Row 2 - Medical & Family
    { id: 'dn-4', icon: '🏥', situationEn: "Patient & Medical?", situationHi: "मरीज की मदद?", questionEn: "Get support!", questionHi: "सहायता लो!", gradient: 'from-rose-400 to-pink-500', category: 'patient-medical', isDailyNeed: true },
    { id: 'dn-5', icon: '👴', situationEn: "Elderly Assistance?", situationHi: "बुज़ुर्ग की मदद?", questionEn: "Be companion!", questionHi: "साथ दो!", gradient: 'from-purple-400 to-violet-500', category: 'elderly-assist', isDailyNeed: true },
    { id: 'dn-6', icon: '👶', situationEn: "Child & Family?", situationHi: "बच्चों की मदद?", questionEn: "Help needed!", questionHi: "मदद करो!", gradient: 'from-pink-400 to-fuchsia-500', category: 'child-family', isDailyNeed: true },
    // Row 3 - Daily Tasks
    { id: 'dn-7', icon: '🧍', situationEn: "Line & Queue?", situationHi: "लाइन में खड़े?", questionEn: "Stand for you!", questionHi: "कोई खड़ा होगा!", gradient: 'from-blue-400 to-cyan-500', category: 'line-presence', isDailyNeed: true },
    { id: 'dn-8', icon: '🛒', situationEn: "Shopping & Errands?", situationHi: "बाजार का काम?", questionEn: "Get it done!", questionHi: "हो जाएगा!", gradient: 'from-lime-400 to-green-500', category: 'shopping-errand', isDailyNeed: true },
    { id: 'dn-9', icon: '🏠', situationEn: "Household Help?", situationHi: "घर की मदद?", questionEn: "Quick fix!", questionHi: "जल्दी ठीक!", gradient: 'from-orange-400 to-amber-500', category: 'household-help', isDailyNeed: true },
    // Row 4 - Transport & Manpower
    { id: 'dn-10', icon: '🚗', situationEn: "Vehicle & Transport?", situationHi: "गाड़ी चाहिए?", questionEn: "Get lift/help!", questionHi: "लिफ्ट/मदद!", gradient: 'from-teal-400 to-cyan-500', category: 'vehicle-transport', isDailyNeed: true },
    { id: 'dn-11', icon: '💪', situationEn: "Manpower needed?", situationHi: "मजदूर चाहिए?", questionEn: "Find workers!", questionHi: "मजदूर मिलेंगे!", gradient: 'from-amber-400 to-yellow-500', category: 'temp-manpower', isDailyNeed: true },
    { id: 'dn-12', icon: '📦', situationEn: "Item & Sharing?", situationHi: "सामान चाहिए?", questionEn: "Rent nearby!", questionHi: "किराये पर!", gradient: 'from-indigo-400 to-blue-500', category: 'item-sharing', isDailyNeed: true },
    // Row 5 - Knowledge & Digital
    { id: 'dn-13', icon: '📱', situationEn: "Digital & Form?", situationHi: "फॉर्म भरना?", questionEn: "Get help!", questionHi: "मदद लो!", gradient: 'from-green-400 to-emerald-500', category: 'digital-form', isDailyNeed: true },
    { id: 'dn-14', icon: '🗺️', situationEn: "Local Knowledge?", situationHi: "रास्ता पता?", questionEn: "Get guidance!", questionHi: "रास्ता बताएं!", gradient: 'from-cyan-400 to-teal-500', category: 'local-knowledge', isDailyNeed: true },
    { id: 'dn-15', icon: '🐕', situationEn: "Pet & Animal?", situationHi: "पालतू की मदद?", questionEn: "Find helper!", questionHi: "मददगार खोजो!", gradient: 'from-amber-400 to-orange-500', category: 'pet-animal', isDailyNeed: true },

    // ========== ROW 6-15: SITUATIONAL CARDS (30 cards) ==========
    // Row 6 - Wedding & Events
    // Row 1 - Wedding & Events
    { id: 1, icon: '👰', situationEn: "Wedding saree needed?", situationHi: "शादी की साड़ी?", questionEn: "Rent nearby!", questionHi: "पास से किराये पर!", gradient: 'from-pink-400 to-rose-500', category: 'wedding-saree' },
    { id: 2, icon: '🤵', situationEn: "Sherwani for function?", situationHi: "शेरवानी चाहिए?", questionEn: "Borrow from neighbor!", questionHi: "पड़ोसी से लो!", gradient: 'from-purple-400 to-violet-500', category: 'sherwani' },
    { id: 3, icon: '💃', situationEn: "Dance costume needed?", situationHi: "डांस कॉस्ट्यूम?", questionEn: "Find nearby!", questionHi: "पास में खोजो!", gradient: 'from-fuchsia-400 to-pink-500', category: 'dance-costume' },
    // Row 2 - Vehicle Issues
    { id: 4, icon: '🏍️', situationEn: "Bike punctured?", situationHi: "बाइक पंचर?", questionEn: "Get help nearby!", questionHi: "पास से मदद लो!", gradient: 'from-orange-400 to-amber-500', category: 'bike-puncture' },
    { id: 5, icon: '⛽', situationEn: "Fuel finished?", situationHi: "पेट्रोल खत्म?", questionEn: "Someone can help!", questionHi: "कोई मदद करेगा!", gradient: 'from-red-400 to-orange-500', category: 'fuel-empty' },
    { id: 6, icon: '🚗', situationEn: "Car broke down?", situationHi: "गाड़ी खराब?", questionEn: "Find mechanic nearby!", questionHi: "मैकेनिक खोजो!", gradient: 'from-gray-400 to-slate-500', category: 'car-breakdown' },
    // Row 3 - Bank & Office
    { id: 7, icon: '🏦', situationEn: "Bank queue long?", situationHi: "बैंक में लाइन?", questionEn: "Someone can stand!", questionHi: "कोई खड़ा होगा!", gradient: 'from-blue-400 to-cyan-500', category: 'bank-queue' },
    { id: 8, icon: '🏛️', situationEn: "Govt office work?", situationHi: "सरकारी काम?", questionEn: "Get help nearby!", questionHi: "पास से मदद!", gradient: 'from-indigo-400 to-blue-500', category: 'govt-office' },
    { id: 9, icon: '📝', situationEn: "Form filling needed?", situationHi: "फॉर्म भरना है?", questionEn: "Find helper!", questionHi: "मददगार खोजो!", gradient: 'from-teal-400 to-cyan-500', category: 'form-filling' },
    // Row 4 - Phone & Tech
    { id: 10, icon: '📱', situationEn: "Phone battery low?", situationHi: "फोन की बैटरी?", questionEn: "Find charger nearby!", questionHi: "चार्जर खोजो!", gradient: 'from-green-400 to-emerald-500', category: 'phone-battery' },
    { id: 11, icon: '📶', situationEn: "No internet?", situationHi: "इंटरनेट नहीं?", questionEn: "Get hotspot!", questionHi: "हॉटस्पॉट लो!", gradient: 'from-cyan-400 to-teal-500', category: 'no-internet' },
    { id: 12, icon: '💻', situationEn: "Laptop issue?", situationHi: "लैपटॉप प्रॉब्लम?", questionEn: "Find tech help!", questionHi: "टेक मदद खोजो!", gradient: 'from-slate-400 to-gray-500', category: 'laptop-issue' },
    // Row 5 - Medical & Health
    { id: 13, icon: '💊', situationEn: "Medicine needed?", situationHi: "दवाई चाहिए?", questionEn: "Get delivery!", questionHi: "डिलीवरी पाओ!", gradient: 'from-red-400 to-rose-500', category: 'medicine-delivery' },
    { id: 14, icon: '🩹', situationEn: "First aid needed?", situationHi: "फर्स्ट एड?", questionEn: "Find help nearby!", questionHi: "पास मदद खोजो!", gradient: 'from-rose-400 to-red-500', category: 'first-aid' },
    { id: 15, icon: '🏥', situationEn: "Hospital route?", situationHi: "अस्पताल रास्ता?", questionEn: "Get guidance!", questionHi: "रास्ता जानो!", gradient: 'from-emerald-400 to-green-500', category: 'hospital-route' },
    // Row 6 - Home & Repairs
    { id: 16, icon: '🔧', situationEn: "Tools needed?", situationHi: "टूल्स चाहिए?", questionEn: "Borrow nearby!", questionHi: "पास से लो!", gradient: 'from-yellow-400 to-orange-500', category: 'tools-needed' },
    { id: 17, icon: '🪜', situationEn: "Ladder needed?", situationHi: "सीढ़ी चाहिए?", questionEn: "Find nearby!", questionHi: "पास खोजो!", gradient: 'from-amber-400 to-yellow-500', category: 'ladder-needed' },
    { id: 18, icon: '💡', situationEn: "Electric issue?", situationHi: "बिजली समस्या?", questionEn: "Get help!", questionHi: "मदद लो!", gradient: 'from-yellow-400 to-amber-500', category: 'electric-issue' },
    // Row 7 - Delivery & Pickup
    { id: 19, icon: '📦', situationEn: "Parcel pickup?", situationHi: "पार्सल पिकअप?", questionEn: "Find helper!", questionHi: "हेल्पर खोजो!", gradient: 'from-orange-400 to-red-500', category: 'parcel-pickup' },
    { id: 20, icon: '🛒', situationEn: "Grocery needed?", situationHi: "किराना चाहिए?", questionEn: "Get delivery!", questionHi: "डिलीवरी पाओ!", gradient: 'from-green-400 to-teal-500', category: 'grocery-needed' },
    { id: 21, icon: '📄', situationEn: "Document delivery?", situationHi: "डॉक्यूमेंट भेजना?", questionEn: "Find courier!", questionHi: "कूरियर खोजो!", gradient: 'from-blue-400 to-indigo-500', category: 'document-delivery' },
    // Row 8 - Events & Equipment
    { id: 22, icon: '⛺', situationEn: "Tent for event?", situationHi: "टेंट चाहिए?", questionEn: "Rent nearby!", questionHi: "पास से किराये!", gradient: 'from-cyan-400 to-blue-500', category: 'tent-event' },
    { id: 23, icon: '🪑', situationEn: "Chairs needed?", situationHi: "कुर्सियां चाहिए?", questionEn: "Rent from neighbor!", questionHi: "पड़ोसी से लो!", gradient: 'from-violet-400 to-purple-500', category: 'chairs-needed' },
    { id: 24, icon: '🔊', situationEn: "Sound system?", situationHi: "साउंड सिस्टम?", questionEn: "Find nearby!", questionHi: "पास खोजो!", gradient: 'from-pink-400 to-fuchsia-500', category: 'sound-system' },
    // Row 9 - Sports & Fitness
    { id: 25, icon: '⚽', situationEn: "Sports gear?", situationHi: "खेल का सामान?", questionEn: "Borrow nearby!", questionHi: "पास से लो!", gradient: 'from-green-400 to-lime-500', category: 'sports-gear' },
    { id: 26, icon: '🏋️', situationEn: "Gym equipment?", situationHi: "जिम का सामान?", questionEn: "Rent it!", questionHi: "किराये पर!", gradient: 'from-orange-400 to-yellow-500', category: 'gym-equipment' },
    { id: 27, icon: '🚴', situationEn: "Cycle needed?", situationHi: "साइकिल चाहिए?", questionEn: "Rent nearby!", questionHi: "पास से किराये!", gradient: 'from-teal-400 to-cyan-500', category: 'cycle-needed' },
    // Row 10 - Miscellaneous
    { id: 28, icon: '🐕', situationEn: "Pet care needed?", situationHi: "पालतू की देखभाल?", questionEn: "Find helper!", questionHi: "हेल्पर खोजो!", gradient: 'from-amber-400 to-orange-500', category: 'pet-care' },
    { id: 29, icon: '🌱', situationEn: "Plant care?", situationHi: "पौधों की देखभाल?", questionEn: "Get help!", questionHi: "मदद लो!", gradient: 'from-lime-400 to-green-500', category: 'plant-care' },
    { id: 30, icon: '📸', situationEn: "Photo needed?", situationHi: "फोटो चाहिए?", questionEn: "Find photographer!", questionHi: "फोटोग्राफर खोजो!", gradient: 'from-violet-400 to-indigo-500', category: 'photo-needed' },
  ]

  // Filter resources based on tab
  const filteredCategories = allResourceCategories.map(cat => ({
    ...cat,
    resources: cat.resources.filter(res => {
      if (activeTab === 'all') return true
      return res.category.toLowerCase().includes(activeTab)
    })
  })).filter(cat => cat.resources.length > 0)

  // Check if user can post problem (requires payment)
  const canPost = isActive

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-sky-50 via-white to-indigo-50'}`}>
      {/* Header - Premium Design */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-blue-100'} shadow-lg`}>
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center"
            >
              <HandHeart className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help2Earn</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connecting People / लोगों को जोड़ना</p>
            </div>
          </div>
          
          {/* Right Actions - Location + Trust + Dark Mode + Menu */}
          <div className="flex items-center gap-2">
            {/* Location Badge */}
            {location && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} border ${darkMode ? 'border-green-800' : 'border-green-200'}`}
              >
                <Navigation className="w-3.5 h-3.5 text-green-600" />
                <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Active</span>
              </motion.div>
            )}
            
            {/* Trust Badge */}
            {trustInfo && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className={`${trustInfo.color} font-semibold shadow-lg px-3 py-1`}>
                  <Star className="w-3 h-3 mr-1" />
                  {trustInfo.score}
                </Badge>
              </motion.div>
            )}
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={`rounded-xl ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-orange-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className={`rounded-xl ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-orange-100'}`}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Dropdown Menu - Premium Style */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute right-4 top-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-orange-100'} overflow-hidden z-50 w-64`}
            >
              <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-white'}`}>{displayName}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-white/80'}`}>{user?.phone}</p>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => { setScreen('profile'); setShowMenu(false) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-900'}`}
                >
                  <User className="w-5 h-5 text-orange-500" />
                  <div className="text-left">
                    <span className="font-medium">My Profile / मेरी प्रोफ़ाइल</span>
                  </div>
                </button>
                
                <button
                  onClick={() => { setScreen('referral'); setShowMenu(false) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-900'}`}
                >
                  <Gift className="w-5 h-5 text-green-500" />
                  <div className="text-left">
                    <span className="font-medium">Referral Program / रेफ़रल प्रोग्राम</span>
                  </div>
                </button>
                
                <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`} />
                
                <button
                  onClick={() => { setScreen('terms'); setShowMenu(false) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-900'}`}
                >
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span>Terms & Conditions / नियम और शर्तें</span>
                </button>
                
                <button
                  onClick={() => { setScreen('about'); setShowMenu(false) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-900'}`}
                >
                  <Info className="w-5 h-5 text-gray-500" />
                  <span>About Us / हमारे बारे में</span>
                </button>
                
                <button
                  onClick={() => { setScreen('contact'); setShowMenu(false) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-900'}`}
                >
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>Contact Us / संपर्क करें</span>
                </button>
                
                <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`} />
                
                <button
                  onClick={() => { setScreen('admin'); setShowMenu(false) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-900'}`}
                >
                  <Shield className="w-5 h-5 text-gray-500" />
                  <span>Admin Panel / एडमिन पैनल</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content - Added extra bottom padding for footer */}
      <main className="flex-1 pb-32">
        {/* Marketing Dashboard - Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4"
        >
          <div className={`rounded-2xl overflow-hidden shadow-lg ${darkMode ? 'bg-gradient-to-br from-orange-900/80 via-red-900/80 to-pink-900/80' : 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500'}`}>
            <div className="p-4">
              {/* Live Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/90 text-xs font-medium">LIVE - 20KM Radius</span>
                </div>
                {locationAddress?.displayName && (
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {locationAddress.displayName}
                  </Badge>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="w-4 h-4 text-white/70" />
                    <span className="text-2xl font-bold text-white">{animatedUsers}</span>
                  </div>
                  <p className="text-white/70 text-xs">Users Online</p>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="flex items-center justify-center gap-1">
                    <Wallet className="w-4 h-4 text-white/70" />
                    <span className="text-2xl font-bold text-white">₹{animatedEarnings.toLocaleString()}</span>
                  </div>
                  <p className="text-white/70 text-xs">Earned Today</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 text-white/70" />
                    <span className="text-2xl font-bold text-white">7</span>
                  </div>
                  <p className="text-white/70 text-xs">Active Tasks</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Urgency Banner (Blinkit Style) - Rotating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-4 mt-3"
        >
          <div className={`rounded-xl overflow-hidden bg-gradient-to-r ${URGENCY_BANNERS[currentBanner].color} shadow-lg`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-3"
              >
                <p className="text-white font-bold text-sm text-center">
                  {URGENCY_BANNERS[currentBanner].text}
                </p>
                <p className="text-white/80 text-xs text-center">
                  {URGENCY_BANNERS[currentBanner].textHi}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Banner Dots */}
          <div className="flex justify-center gap-1 mt-2">
            {URGENCY_BANNERS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentBanner 
                    ? 'w-4 bg-orange-500' 
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Gamification Section - Streak & Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-4 mt-4"
        >
          <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Progress</span>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                Level 2
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Daily Streak */}
              <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dailyStreak}</span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Day Streak</p>
              </div>

              {/* Area Rank */}
              <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>#12</span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Area Rank</p>
              </div>

              {/* Total Earned */}
              <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹850</span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Earned</p>
              </div>
            </div>

            {/* Streak Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Next Level Progress</span>
                <span className={`text-xs font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>650/1000 XP</span>
              </div>
              <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4"
        >
          <div className={`rounded-2xl overflow-hidden shadow-lg ${darkMode ? 'bg-gradient-to-br from-sky-900/80 via-blue-900/80 to-indigo-900/80' : 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100'}`}>
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name || 'User'} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/50 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/50 shadow-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {greeting}, {displayName}!
                    </h2>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    {getGreetingHindi()}, {displayName}!
                  </p>
                  
                  {/* Account Status */}
                  <div className="flex items-center gap-2 mt-2">
                    {isActive ? (
                      <Badge className="bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-300 border border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Account Active
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500/20 text-orange-600 dark:bg-orange-500/30 dark:text-orange-300 border border-orange-500/30">
                        <Zap className="w-3 h-3 mr-1" />
                        Not Activated
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Trust Score & Ratings */}
              <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  {/* Trust Score */}
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      (user?.trustScore || 50) >= 70 ? 'bg-green-500/20' :
                      (user?.trustScore || 50) >= 40 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                    }`}>
                      <Shield className={`w-5 h-5 ${
                        (user?.trustScore || 50) >= 70 ? 'text-green-600' :
                        (user?.trustScore || 50) >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Trust Score</p>
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.trustScore || 50}</p>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className={`w-px h-10 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  
                  {/* Ratings */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rating</p>
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.ratingCount && user.ratingCount > 0 
                          ? `${(user.ratingSum / user.ratingCount).toFixed(1)} ⭐` 
                          : 'New User'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className={`w-px h-10 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  
                  {/* Help Count */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <HandHeart className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Helps Done</p>
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.helpfulCount || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activate CTA for non-active users */}
              {!isActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Button
                    onClick={() => setScreen('subscription')}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold shadow-xl h-12 rounded-xl"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Activate Account / अकाउंट एक्टिवेट करें
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Featured Services Section (addon for empty app feel) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mx-4 mt-4"
        >
          <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-xl">🏪</span>
                  Available Services Nearby
                </h3>
                <p className={`text-xs ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  20 services • Price ranges visible • Real providers
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-300">
                View All →
              </Badge>
            </div>
            
            {/* Services Carousel */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {[
                { icon: '🏍️', name: 'Bike Repair', price: '₹50-150', rating: 4.8, provider: 'Raju' },
                { icon: '⛽', name: 'Fuel Delivery', price: '₹100-500', rating: 4.6, provider: 'Vikram' },
                { icon: '💊', name: 'Medicine', price: '₹30-100', rating: 4.9, provider: 'Priya' },
                { icon: '🔧', name: 'Tools Rent', price: '₹100-200', rating: 4.6, provider: 'Suresh' },
                { icon: '🪜', name: 'Ladder Rent', price: '₹50-100', rating: 4.5, provider: 'Harish' },
              ].map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className={`flex-shrink-0 w-28 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{service.icon}</div>
                    <p className={`text-xs font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {service.name}
                    </p>
                    <p className="text-xs font-bold text-green-600">{service.price}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-2.5 h-2.5 text-yellow-500" />
                      <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.rating}
                      </span>
                    </div>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      by {service.provider}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* All Help Cards - Unified Grid (15 Daily Need + 30 Situational = 45 cards) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="px-4 py-4"
        >
          <div className={`rounded-2xl p-4 mb-3 ${darkMode ? 'bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-800' : 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200'}`}>
            <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-2xl">🎯</span>
              Help Categories - मदद की श्रेणियां
            </h3>
            <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'} mb-1`}>
              45 ways to earn by helping others!
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Tap any card to see income potential! <span className="text-orange-500 font-medium">⭐ First 15 = Daily Needs</span>
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {allHelpCards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.015 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedCard({
                    id: typeof card.id === 'string' ? idx : card.id,
                    icon: card.icon,
                    title: card.situationEn,
                    titleHi: card.situationHi,
                    gradient: card.gradient,
                    category: card.category
                  })
                  setShowStoryModal(true)
                }}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden border ${card.isDailyNeed ? (darkMode ? 'border-orange-500/50 ring-1 ring-orange-500/30' : 'border-orange-300 ring-1 ring-orange-200') : (darkMode ? 'border-gray-700' : 'border-gray-100')} cursor-pointer relative`}
              >
                {/* Daily Need Badge for first 15 cards */}
                {card.isDailyNeed && (
                  <div className="absolute top-0 right-0 z-10">
                    <Badge className="text-[8px] bg-orange-500 text-white rounded-tl-none rounded-br-none rounded-bl-lg px-1.5 py-0.5">
                      Daily
                    </Badge>
                  </div>
                )}
                <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
                <div className="p-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-xl shadow-md mx-auto mb-2`}>
                    {card.icon}
                  </div>
                  <p className={`font-medium text-xs text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-0.5 line-clamp-2`}>
                    {card.situationEn}
                  </p>
                  <p className={`text-[10px] text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-1 line-clamp-1`}>
                    {card.situationHi}
                  </p>
                  <p className={`text-[10px] font-medium text-center ${darkMode ? 'text-orange-400' : 'text-orange-600'} line-clamp-1`}>
                    {card.questionEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-4"
        >
          <Card className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'} border rounded-2xl shadow-lg`}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Today in this area</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>आज इस क्षेत्र में</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <motion.p 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-green-600"
                  >
                    12
                  </motion.p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Helps done</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>मदद पूरी हुई</p>
                </div>
                <div className="text-center">
                  <motion.p 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-blue-600"
                  >
                    3
                  </motion.p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>People connected</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>लोग जुड़े</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions - Only show if subscription active */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="px-4 py-2 grid grid-cols-2 gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setScreen('post-problem')}
              className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5 rounded-2xl text-left shadow-xl"
            >
              <HelpCircle className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg">Want Help?</h3>
              <p className="text-sm text-white/80">कोई काम है?</p>
              <p className="text-xs text-white/60 mt-1">Tell nearby people / पास के लोगों को बताएं</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setScreen('nearby')}
              className="bg-gradient-to-br from-green-400 to-green-600 text-white p-5 rounded-2xl text-left shadow-xl"
            >
              <HandHeart className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg">Want to help?</h3>
              <p className="text-sm text-white/80">मदद करें?</p>
              <p className="text-xs text-white/60 mt-1">See nearby needs / पास की ज़रूरतें देखें</p>
            </motion.button>
          </motion.div>
        )}

        {/* Payment Required Notice */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-4"
          >
            <Card className={`${darkMode ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200'} border rounded-2xl`}>
              <CardContent className="p-4 text-center">
                <Shield className={`w-10 h-10 mx-auto mb-3 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activate to Post Requests</h3>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Subscribe to post help requests and connect with nearby helpers
                </p>
                <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  मदद अनुरोध पोस्ट करने और पास के मददगारों से जुड़ने के लिए सदस्यता लें
                </p>
                <Button
                  onClick={() => setScreen('subscription')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold"
                >
                  Activate Now / अभी सक्रिय करें
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-4"
        >
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <Input
              placeholder="What do you need? / आपको क्या चाहिए?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-12 h-14 rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-orange-200 text-gray-900 placeholder:text-gray-400'} shadow-lg`}
            />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-4 pb-2"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', labelEn: 'All', labelHi: 'सभी', icon: Sparkles },
              { id: 'emergency', labelEn: 'Urgent', labelHi: 'जल्दी', icon: Zap },
              { id: 'rent', labelEn: 'Rent', labelHi: 'किराया', icon: Home },
              { id: 'skill', labelEn: 'Skills', labelHi: 'हुनर', icon: Briefcase },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : darkMode 
                      ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                      : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.labelEn}
                <span className="text-xs opacity-70">({tab.labelHi})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Resource Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 py-2"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What nearby people can help with
            </h3>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
            पास के लोग किस में मदद कर सकते हैं • 150+ types <span className="text-orange-500">Tap to earn!</span>
          </p>

          {/* Category Cards - 3 Column Grid */}
          <ScrollArea className="h-[400px] pr-1">
            <div className="grid grid-cols-3 gap-2 pb-4">
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: catIndex * 0.02 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedCard({
                      id: catIndex,
                      icon: category.imageEmoji,
                      title: category.name,
                      titleHi: category.nameHindi,
                      gradient: category.gradient,
                      category: category.id.toLowerCase()
                    })
                    setShowStoryModal(true)
                  }}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-md overflow-hidden rounded-xl cursor-pointer`}
                >
                  <div className={`h-1 bg-gradient-to-r ${category.gradient}`} />
                  <div className="p-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-xl shadow-md mx-auto mb-2`}>
                      {category.imageEmoji}
                    </div>
                    <p className={`font-medium text-xs text-center ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-1`}>
                      {category.name}
                    </p>
                    <p className={`text-[10px] text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                      {category.nameHindi}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Trust & Safety */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 py-4"
        >
          <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Shield className="w-5 h-5 text-green-600" />
            Here, not professionals, but humans help
          </h3>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            यहाँ प्रोफेशनल नहीं, बल्कि इंसान मदद करते हैं
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${darkMode ? 'from-green-900/30 to-emerald-900/30' : 'from-green-50 to-emerald-50'} p-4 rounded-2xl border ${darkMode ? 'border-green-800' : 'border-green-100'}`}
            >
              <CheckCircle2 className="w-7 h-7 text-green-600 mb-2" />
              <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nearby Neighbors</h4>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>पास के पड़ोसी</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Phone verified / फ़ोन वेरिफ़ाइड</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${darkMode ? 'from-blue-900/30 to-cyan-900/30' : 'from-blue-50 to-cyan-50'} p-4 rounded-2xl border ${darkMode ? 'border-blue-800' : 'border-blue-100'}`}
            >
              <Star className="w-7 h-7 text-blue-600 mb-2" />
              <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>People Like You</h4>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>आप जैसे लोग</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Community trust / समुदाय विश्वास</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Location Status */}
        {location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-4 py-2"
          >
            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50'} p-4 rounded-2xl border ${darkMode ? 'border-green-800' : 'border-green-100'}`}>
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Active in this area</span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>• इस क्षेत्र में सक्रिय</span>
            </div>
          </motion.div>
        )}
      </main>

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {showResourceModal && selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowResourceModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full rounded-t-3xl p-6 max-h-[75vh] shadow-2xl`}
            >
              {/* Handle Bar */}
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              </div>
              
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className={`w-16 h-16 ${selectedResource.imageColor} rounded-2xl flex items-center justify-center text-4xl shadow-xl`}
                  >
                    {selectedResource.imageEmoji}
                  </motion.div>
                  <div>
                    <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedResource.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedResource.nameHindi}</p>
                    <Badge className="bg-green-100 text-green-700 mt-2 font-semibold">{selectedResource.avgEarning}</Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowResourceModal(false)}
                  className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                </Button>
              </div>
              
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-5 text-base`}>{selectedResource.description}</p>
              
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <Badge className={
                  selectedResource.category === 'EMERGENCY' ? 'bg-red-100 text-red-700' :
                  selectedResource.category === 'TIME_ACCESS' ? 'bg-blue-100 text-blue-700' :
                  selectedResource.category === 'RESOURCE_RENT' ? 'bg-green-100 text-green-700' :
                  selectedResource.category === 'SKILL' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }>
                  {selectedResource.category === 'EMERGENCY' ? '🆘 Urgent / जल्दी' :
                   selectedResource.category === 'TIME_ACCESS' ? '⏰ Time Based / समय आधारित' :
                   selectedResource.category === 'RESOURCE_RENT' ? '📦 On Rent / किराये पर' :
                   selectedResource.category === 'SKILL' ? '💡 Skill / हुनर' :
                   '🏢 Space / जगह'}
                </Badge>
              </div>
              
              {isActive && (
                <Button
                  onClick={() => { setScreen('post-problem'); setShowResourceModal(false) }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold h-14 rounded-2xl text-lg shadow-xl"
                >
                  Send Notification / नोटिफिकेशन भेजें
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              
              {!isActive && (
                <div className="text-center">
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Activate subscription to post requests
                  </p>
                  <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    अनुरोध पोस्ट करने के लिए सदस्यता सक्रिय करें
                  </p>
                  <Button
                    onClick={() => { setScreen('subscription'); setShowResourceModal(false) }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold"
                  >
                    Activate Now / अभी सक्रिय करें
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - Fixed Footer */}
      <nav className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-t ${darkMode ? 'border-gray-700' : 'border-orange-100'} shadow-2xl z-40`}>
        <div className="flex items-center justify-around py-2 px-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('home')}
            className="flex flex-col items-center gap-1 p-2"
          >
            <div className={`w-11 h-11 rounded-2xl ${darkMode ? 'bg-orange-500/20' : 'bg-orange-100'} flex items-center justify-center`}>
              <Home className="w-5 h-5 text-orange-600" />
            </div>
            <span className={`text-xs font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Home</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('nearby')}
            className="flex flex-col items-center gap-1 p-2"
          >
            <div className={`w-11 h-11 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <HandHeart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Help Requested</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => canPost ? setScreen('post-problem') : setScreen('subscription')}
            className="flex flex-col items-center gap-1 p-2 -mt-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="text-white text-3xl font-light">+</span>
            </div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Post</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('profile')}
            className="flex flex-col items-center gap-1 p-2"
          >
            <div className={`w-11 h-11 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <User className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profile</span>
          </motion.button>
        </div>
      </nav>

      {/* Income Story Modal */}
      {selectedCard && (
        <IncomeStoryModal
          isOpen={showStoryModal}
          onClose={() => setShowStoryModal(false)}
          card={selectedCard}
          darkMode={darkMode}
          onPostProblem={() => { setShowStoryModal(false); setScreen('post-problem') }}
          onNearby={() => { setShowStoryModal(false); setScreen('nearby') }}
        />
      )}

      {/* SOS Emergency Button */}
      <SOSFloatingButton darkMode={darkMode} />
    </div>
  )
}
