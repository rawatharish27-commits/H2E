'use client'

import { useState, useEffect } from 'react'
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
  Navigation
} from 'lucide-react'
import { useAppStore } from '@/store'
import { getTrustBadge } from '@/types'
import { allResourceCategories, type Resource, type ResourceCategory } from '@/data/resources'
import { TrustBadge } from './TrustBadge'
import { SOSFloatingButton } from './SOSButton'

export function HomeScreen() {
  const { user, setScreen, isSubscriptionActive, getTrustInfo, requestLocation, location, darkMode, toggleDarkMode } = useAppStore()
  const [showMenu, setShowMenu] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'emergency' | 'rent' | 'skill'>('all')

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

  // Pause Moment Cards - Situational Storytelling (English + Hindi only)
  const pauseMomentCards = [
    {
      id: 1,
      icon: '👰',
      situationEn: "Wedding coming up? Need a saree for just one day?",
      situationHi: "शादी है? सिर्फ़ एक दिन के लिए साड़ी चाहिए?",
      questionEn: "Is buying from market necessary?",
      questionHi: "क्या मार्केट से खरीदना ज़रूरी है?",
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      id: 2,
      icon: '🏦',
      situationEn: "The bank queue is long.",
      situationHi: "बैंक की लाइन लंबी है।",
      questionEn: "Can someone nearby help?",
      questionHi: "क्या कोई पास में मदद कर सकता है?",
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 3,
      icon: '🏍️',
      situationEn: "Your bike got punctured.",
      situationHi: "आपकी बाइक पंचर हो गई।",
      questionEn: "Could someone have the tools?",
      questionHi: "क्या किसी के पास टूल्स हो सकते हैं?",
      gradient: 'from-orange-400 to-amber-500'
    }
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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header - Premium Design */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-orange-100'} shadow-lg`}>
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
        {/* Core Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4"
        >
          <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white border-0 shadow-2xl overflow-hidden rounded-3xl">
            <CardContent className="p-6 relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-white/80 text-sm">{greeting}</p>
                  <span className="text-white/60">•</span>
                  <p className="text-white/80 text-sm">{getGreetingHindi()}</p>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {displayName}!
                </h2>
                
                {isActive ? (
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-3 bg-white/20 rounded-2xl p-4 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-lg">Account Active</span>
                      <p className="text-white/80 text-sm">खाता सक्रिय है</p>
                    </div>
                    <Badge className="bg-white text-green-600 font-bold px-3 py-1">✓ ACTIVE</Badge>
                  </motion.div>
                ) : (
                  <div>
                    <p className="text-white/90 text-sm mb-3">
                      Become part of this area's help network.
                    </p>
                    <p className="text-white/70 text-xs mb-4">
                      इस क्षेत्र के मदद नेटवर्क का हिस्सा बनें।
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setScreen('subscription')}
                        className="bg-white text-orange-600 hover:bg-white/90 font-bold shadow-xl h-14 rounded-2xl text-base px-6"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Join Community / समुदाय से जुड़ें
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pause Moment Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-4"
        >
          <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Think for a moment...
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            एक बार सोचो...
          </p>
          
          <div className="space-y-3">
            {pauseMomentCards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
              >
                <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
                <div className="p-4 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                      {card.situationEn}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`}>
                      {card.situationHi}
                    </p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      {card.questionEn}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {card.questionHi}
                    </p>
                  </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What nearby people can help with
            </h3>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            पास के लोग किस में मदद कर सकते हैं • 150+ types of help
          </p>

          {/* Category Cards */}
          <ScrollArea className="h-[500px] pr-2">
            <div className="space-y-4 pb-4">
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.03 }}
                >
                  <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-xl overflow-hidden rounded-2xl`}>
                    {/* Category Color Bar */}
                    <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
                    
                    <CardContent className="p-4">
                      {/* Category Header */}
                      <button
                        onClick={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-3xl shadow-lg`}
                          >
                            {category.imageEmoji}
                          </motion.div>
                          <div className="text-left">
                            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{category.name}</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{category.nameHindi}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: selectedCategory?.id === category.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                        </motion.div>
                      </button>

                      {/* Expanded Resources */}
                      <AnimatePresence>
                        {selectedCategory?.id === category.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} grid grid-cols-2 gap-3`}>
                              {category.resources.slice(0, 6).map((resource, idx) => (
                                <motion.button
                                  key={resource.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.03 }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => { setSelectedResource(resource); setShowResourceModal(true) }}
                                  className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : `${resource.imageColor} hover:shadow-md`} p-4 rounded-2xl text-left transition-all`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl">{resource.imageEmoji}</span>
                                    <Badge className="bg-green-100 text-green-700 font-bold text-xs">{resource.avgEarning}</Badge>
                                  </div>
                                  <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-1`}>{resource.name}</p>
                                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>{resource.nameHindi}</p>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
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
              <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nearby</span>
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
            onClick={() => setScreen('history')}
            className="flex flex-col items-center gap-1 p-2"
          >
            <div className={`w-11 h-11 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>History</span>
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

      {/* SOS Emergency Button */}
      <SOSFloatingButton darkMode={darkMode} />
    </div>
  )
}
