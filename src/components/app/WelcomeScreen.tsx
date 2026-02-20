'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/components/ui/logo'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, 
  AlertTriangle,
  Phone,
  Wallet,
  Share2,
  Users,
  MapPin,
  Clock,
  Star
} from 'lucide-react'
import { useAppStore } from '@/store'

// 5 Real Problem Examples - To Encourage Sharing
const PROBLEM_EXAMPLES = [
  {
    id: 1,
    emoji: '🏍️',
    titleEn: 'Bike Puncture on Highway',
    titleHi: 'हाईवे पर बाइक पंक्चर',
    descriptionEn: 'Need someone with puncture kit urgently! Stuck 5km from city.',
    descriptionHi: 'पंक्चर किट वाले की जल्दी जरूरत है! शहर से 5km फंसा हूं।',
    location: 'NH-48 Highway, 2km from toll',
    timeAgo: '5 min ago',
    offerPrice: '₹100',
    category: 'Emergency',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    id: 2,
    emoji: '🔋',
    titleEn: 'Phone Battery Died at Market',
    titleHi: 'बाजार में फोन की बैटरी खत्म',
    descriptionEn: 'Need charger or power bank urgently for important call!',
    descriptionHi: 'जरूरी कॉल के लिए चार्जर या पावर बैंक चाहिए!',
    location: 'Main Market, Sector 15',
    timeAgo: '10 min ago',
    offerPrice: '₹50',
    category: 'Urgent',
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    id: 3,
    emoji: '🏥',
    titleEn: 'Medicine Delivery Needed',
    titleHi: 'दवा डिलीवरी चाहिए',
    descriptionEn: 'Elderly patient needs medicines from medical store. Cannot go myself.',
    descriptionHi: 'बुजुर्ग मरीज को मेडिकल स्टोर से दवाइयां चाहिए। खुद नहीं जा सकता।',
    location: 'Vikas Nagar, Block B',
    timeAgo: '15 min ago',
    offerPrice: '₹150',
    category: 'Medical',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 4,
    emoji: '🏦',
    titleEn: 'Someone to Stand in Bank Queue',
    titleHi: 'बैंक लाइन में खड़े होने वाला चाहिए',
    descriptionEn: 'Long queue at SBI bank. Need someone to hold my spot for 2 hours.',
    descriptionHi: 'SBI बैंक में लंबी लाइन। 2 घंटे के लिए जगह पकड़ने वाला चाहिए।',
    location: 'SBI Bank, Main Branch',
    timeAgo: '20 min ago',
    offerPrice: '₹200',
    category: 'Time',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    id: 5,
    emoji: '👴',
    titleEn: 'Elderly Care for 3 Hours',
    titleHi: '3 घंटे के लिए बुजुर्ग देखभाल',
    descriptionEn: 'Need someone to stay with my father while I attend emergency work.',
    descriptionHi: 'मेरे पिताजी के साथ रहने वाला चाहिए जब तक मैं जरूरी काम करूं।',
    location: 'Rajendra Nagar, House 45',
    timeAgo: '25 min ago',
    offerPrice: '₹300',
    category: 'Care',
    gradient: 'from-purple-500 to-pink-500'
  }
]

// Pre-Login Explain Screens - Before any login
const EXPLAIN_SCREENS = [
  {
    id: 1,
    icon: AlertTriangle,
    iconBg: 'from-red-500 to-orange-500',
    titleEn: 'Problem: Nearby help needed',
    titleHi: 'समस्या: पास में मदद चाहिए',
    subtitleEn: 'Puncture? Charging? Queue? Errand?',
    subtitleHi: 'पंक्चर? चार्जिंग? लाइन? कोई काम?',
    descriptionEn: 'When you need help urgently, who do you call? Neighbors or professionals?',
    descriptionHi: 'जब जल्दी मदद चाहिए, किसे बुलाते हो? पड़ोसी या प्रोफेशनल?',
    points: [
      { en: 'Puncture on the road', hi: 'सड़क पर पंक्चर' },
      { en: 'Phone battery died', hi: 'फोन की बैटरी खत्म' },
      { en: 'Need to stand in queue', hi: 'लाइन में खड़ा होना है' },
      { en: 'Someone to pick/drop', hi: 'कोई पिक/ड्रॉप करे' },
    ]
  },
  {
    id: 2,
    icon: Wallet,
    iconBg: 'from-green-500 to-emerald-500',
    titleEn: 'Opportunity: Help = Earn',
    titleHi: 'मौका: मदद = कमाई',
    subtitleEn: 'Your time, skills, resources = Money',
    subtitleHi: 'आपका समय, हुनर, संसाधन = पैसा',
    descriptionEn: 'If you can help someone nearby, you can earn ₹100-₹500 per help!',
    descriptionHi: 'अगर पास के किसी की मदद कर सकते हो, तो ₹100-₹500 कमा सकते हो!',
    points: [
      { en: 'Fix a puncture - ₹50-100', hi: 'पंक्चर ठीक करो - ₹50-100' },
      { en: 'Stand in queue - ₹100-200', hi: 'लाइन में खड़े रहो - ₹100-200' },
      { en: 'Lend your bike - ₹200-500', hi: 'बाइक दे दो - ₹200-500' },
      { en: 'Local guidance - ₹50-100', hi: 'रास्ता बताओ - ₹50-100' },
    ]
  },
  {
    id: 3,
    icon: Phone,
    iconBg: 'from-blue-500 to-cyan-500',
    titleEn: 'Phone pe direct baat',
    titleHi: 'फोन पे डायरेक्ट बात',
    subtitleEn: 'No middleman, no commission',
    subtitleHi: 'कोई बिचौलिया नहीं, कोई कमीशन नहीं',
    descriptionEn: 'Talk directly to the person. Decide price yourself. All payment is yours.',
    descriptionHi: 'सीधे इंसान से बात करो। कीमत खुद तय करो। सारी कमाई आपकी।',
    points: [
      { en: 'Direct phone call', hi: 'सीधे फोन कॉल' },
      { en: 'Decide price yourself', hi: 'कीमत खुद तय करो' },
      { en: 'No platform commission', hi: 'प्लेटफॉर्म का कोई कमीशन नहीं' },
      { en: 'Cash or UPI - your choice', hi: 'कैश या UPI - आपकी मर्ज़ी' },
    ]
  },
  {
    id: 4,
    icon: Share2,
    iconBg: 'from-pink-500 to-rose-500',
    titleEn: 'Share & Build Network',
    titleHi: 'शेयर करो और नेटवर्क बनाओ',
    subtitleEn: 'More shares = More helpers nearby',
    subtitleHi: 'ज्यादा शेयर = ज्यादा मददगार पास',
    descriptionEn: 'Share app with friends. Build your helper network. Get help faster!',
    descriptionHi: 'दोस्तों को ऐप शेयर करो। मददगारों का नेटवर्क बनाओ। जल्दी मदद पाओ!',
    points: [
      { en: 'Share with 5 friends', hi: '5 दोस्तों को शेयर करो' },
      { en: 'Build local network', hi: 'लोकल नेटवर्क बनाओ' },
      { en: 'Get help in minutes', hi: 'मिनटों में मदद पाओ' },
      { en: 'Earn referral bonus', hi: 'रेफरल बोनस कमाओ' },
    ]
  }
]

export function WelcomeScreen() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const { setScreen, setTempReferralCode, darkMode } = useAppStore()
  const screen = EXPLAIN_SCREENS[currentScreen]
  const Icon = screen.icon
  
  const handleNext = () => {
    if (currentScreen < EXPLAIN_SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1)
    }
  }
  
  const handleGetStarted = () => {
    // Generate temp referral code before share screen
    const tempCode = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setTempReferralCode(tempCode)
    localStorage.setItem('hasSeenWelcome', 'true')
    setScreen('pre-login-share')
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className="pt-6 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden"
          >
            <LogoIcon size={40} />
          </motion.div>
          <div>
            <span className={`font-bold text-lg`}>
              <span className="text-blue-600">Help</span>
              <span className="text-green-600">2</span>
              <span className="text-orange-600">Earn</span>
            </span>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connecting People / लोगों को जोड़ना</p>
          </div>
        </div>
      </header>

      {/* Progress dots */}
      <div className="pt-4 px-6 flex justify-center gap-2">
        {EXPLAIN_SCREENS.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentScreen 
                ? 'w-8 bg-gradient-to-r from-orange-500 to-red-500' 
                : index < currentScreen 
                  ? 'w-2 bg-orange-400' 
                  : darkMode ? 'w-2 bg-gray-600' : 'w-2 bg-gray-300'
            }`}
            animate={{
              scale: index === currentScreen ? 1.2 : 1
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm w-full"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${screen.iconBg} flex items-center justify-center shadow-2xl`}
            >
              <Icon className="w-14 h-14 text-white" />
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}
            >
              {screen.titleEn}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}
            >
              {screen.titleHi}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-800' : 'bg-orange-50'}`}
            >
              <p className={`text-sm font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-600'} mb-1`}>
                {screen.subtitleEn}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {screen.subtitleHi}
              </p>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}
            >
              {screen.descriptionEn}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}
            >
              {screen.descriptionHi}
            </motion.p>

            {/* Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="space-y-2"
            >
              {screen.points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${screen.iconBg} flex items-center justify-center text-white text-xs font-bold`}>
                    ✓
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{point.en}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{point.hi}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Problem Examples - Scrollable Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="px-4 py-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Live Help Requests
            </p>
          </div>
          <Badge className="bg-red-100 text-red-700 text-xs animate-pulse">
            🔴 Real-time
          </Badge>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {PROBLEM_EXAMPLES.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex-shrink-0 w-64"
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl overflow-hidden`}>
                {/* Gradient top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${problem.gradient}`} />
                
                <CardContent className="p-3">
                  {/* Header */}
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {problem.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {problem.titleEn}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {problem.titleHi}
                      </p>
                    </div>
                    <Badge className={`bg-gradient-to-r ${problem.gradient} text-white text-xs`}>
                      {problem.offerPrice}
                    </Badge>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-xs mb-2 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {problem.descriptionEn}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs truncate max-w-24 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {problem.location.split(',')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {problem.timeAgo}
                      </span>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="mt-2">
                    <Badge variant="outline" className={`text-xs ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                      {problem.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Share CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className={`mt-3 p-3 rounded-xl text-center ${darkMode ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30' : 'bg-gradient-to-r from-orange-50 to-red-50'} border ${darkMode ? 'border-orange-800' : 'border-orange-200'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Share with friends to build your network!
            </p>
          </div>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            अपना नेटवर्क बनाने के लिए दोस्तों को शेयर करें!
          </p>
        </motion.div>
      </motion.div>
      
      {/* Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={currentScreen < EXPLAIN_SCREENS.length - 1 ? handleNext : handleGetStarted}
          className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl"
        >
          {currentScreen < EXPLAIN_SCREENS.length - 1 ? (
            <>
              Next / आगे बढ़ें <ChevronRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              Get Started / शुरू करें <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
