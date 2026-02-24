'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/components/ui/logo'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  Phone,
  Wallet,
  Share2,
  Users,
  MapPin,
  Clock,
  Heart,
  Zap,
  Flame,
  Target,
  TrendingUp,
  Navigation,
  Sparkles
} from 'lucide-react'
import { useAppStore } from '@/store'

// 20 Emotional Problem Examples with Images - User Friendly Prices
const EMOTIONAL_PROBLEMS = [
  {
    id: 1,
    image: '/images/problems/pregnant-hospital.png',
    titleEn: 'Pregnant Lady to Hospital',
    titleHi: 'प्रेगनेंट महिला को अस्पताल',
    descriptionEn: 'Emergency! Need someone to take pregnant wife to hospital immediately.',
    descriptionHi: 'आपातकालीन! गर्भवती पत्नी को तुरंत अस्पताल ले जाना है।',
    offerPrice: 'Starting at ₹150',
    earnText: 'Earn ₹150-₹300',
    category: 'Emergency',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    id: 2,
    image: '/images/problems/giving-lift.png',
    titleEn: 'Need a Lift/Ride',
    titleHi: 'लिफ्ट/सवारी चाहिए',
    descriptionEn: 'Stuck at bus stop, need lift to railway station urgently.',
    descriptionHi: 'बस स्टॉप पर फंसा हूं, जल्दी रेलवे स्टेशन लिफ्ट चाहिए।',
    offerPrice: 'Starting at ₹30',
    earnText: 'Earn ₹30-₹80',
    category: 'Transport',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    image: '/images/problems/accident-help.png',
    titleEn: 'Accident - Hospital Help',
    titleHi: 'हादसा - अस्पताल मदद',
    descriptionEn: 'Minor accident! Need someone to take injured person to hospital.',
    descriptionHi: 'छोटा हादसा! घायल को अस्पताल ले जाने वाला चाहिए।',
    offerPrice: 'Starting at ₹200',
    earnText: 'Earn ₹200-₹400',
    category: 'Emergency',
    gradient: 'from-red-600 to-orange-500'
  },
  {
    id: 4,
    image: '/images/problems/wedding-help.png',
    titleEn: 'Wedding Preparation Help',
    titleHi: 'शादी की तैयारी मदद',
    descriptionEn: 'Daughter wedding next week. Need helping hands for preparations.',
    descriptionHi: 'बेटी की शादी अगले हफ्ते। तैयारी के लिए मददगार चाहिए।',
    offerPrice: 'Starting at ₹300',
    earnText: 'Earn ₹300-₹800',
    category: 'Event',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 5,
    image: '/images/problems/house-construction.png',
    titleEn: 'Laborers for House',
    titleHi: 'घर बनाने के मजदूर',
    descriptionEn: 'Need 5 laborers for house construction. Daily wage payment.',
    descriptionHi: 'घर बनाने के लिए 5 मजदूर चाहिए। दैनिक मजदूरी।',
    offerPrice: 'Starting at ₹400/day',
    earnText: 'Earn ₹400-₹600/day',
    category: 'Labor',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 6,
    image: '/images/problems/plumber-needed.png',
    titleEn: 'Plumber Needed',
    titleHi: 'प्लंबर चाहिए',
    descriptionEn: 'Water pipe burst! Need plumber urgently to fix leakage.',
    descriptionHi: 'पानी की पाइप टूट गई! प्लंबर जल्दी चाहिए।',
    offerPrice: 'Starting at ₹100',
    earnText: 'Earn ₹100-₹250',
    category: 'Repair',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    id: 7,
    image: '/images/problems/washing-machine.png',
    titleEn: 'Washing Machine Repair',
    titleHi: 'वाशिंग मशीन रिपेयर',
    descriptionEn: 'Washing machine not working. Need technician to repair.',
    descriptionHi: 'वाशिंग मशीन काम नहीं कर रही। तकनीशियन चाहिए।',
    offerPrice: 'Starting at ₹150',
    earnText: 'Earn ₹150-₹350',
    category: 'Appliance',
    gradient: 'from-purple-500 to-violet-500'
  },
  {
    id: 8,
    image: '/images/problems/tv-broken.png',
    titleEn: 'TV Repair Needed',
    titleHi: 'TV रिपेयर चाहिए',
    descriptionEn: 'LED TV screen showing lines. Need TV repair person.',
    descriptionHi: 'LED TV स्क्रीन पर लाइनें आ रहीं। TV रिपेयर वाला चाहिए।',
    offerPrice: 'Starting at ₹200',
    earnText: 'Earn ₹200-₹400',
    category: 'Appliance',
    gradient: 'from-gray-500 to-slate-600'
  },
  {
    id: 9,
    image: '/images/problems/iron-broken.png',
    titleEn: 'Iron Box Repair',
    titleHi: 'इस्त्री रिपेयर',
    descriptionEn: 'Electric iron not heating. Need urgent repair before function.',
    descriptionHi: 'इलेक्ट्रिक इस्त्री गरम नहीं हो रही। फंक्शन से पहले रिपेयर चाहिए।',
    offerPrice: 'Starting at ₹50',
    earnText: 'Earn ₹50-₹150',
    category: 'Appliance',
    gradient: 'from-orange-400 to-red-400'
  },
  {
    id: 10,
    image: '/images/problems/electrician-needed.png',
    titleEn: 'Electrician Needed',
    titleHi: 'इलेक्ट्रीशियन चाहिए',
    descriptionEn: 'Power outage in house. Need electrician to check wiring.',
    descriptionHi: 'घर में बिजली गुल है। वायरिंग चेक करने इलेक्ट्रीशियन चाहिए।',
    offerPrice: 'Starting at ₹100',
    earnText: 'Earn ₹100-₹250',
    category: 'Repair',
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    id: 11,
    image: '/images/problems/ac-repair.png',
    titleEn: 'AC Repair Urgent',
    titleHi: 'AC रिपेयर जल्दी',
    descriptionEn: 'AC not cooling in this summer heat! Need urgent repair.',
    descriptionHi: 'गर्मी में AC ठंडा नहीं कर रहा! जल्दी रिपेयर चाहिए।',
    offerPrice: 'Starting at ₹250',
    earnText: 'Earn ₹250-₹500',
    category: 'Appliance',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 12,
    image: '/images/problems/carpenter-needed.png',
    titleEn: 'Carpenter for Furniture',
    titleHi: 'फर्नीचर के लिए कारपेंटर',
    descriptionEn: 'Need carpenter to repair broken chairs and make new table.',
    descriptionHi: 'टूटी कुर्सियां ठीक करने और नई मेज बनाने कारपेंटर चाहिए।',
    offerPrice: 'Starting at ₹300',
    earnText: 'Earn ₹300-₹600',
    category: 'Repair',
    gradient: 'from-amber-600 to-yellow-600'
  },
  {
    id: 13,
    image: '/images/problems/maid-needed.png',
    titleEn: 'Maid/Househelp Needed',
    titleHi: 'नौकरानी/घरेलू मदद',
    descriptionEn: 'Working couple needs maid for cooking and cleaning.',
    descriptionHi: 'वर्किंग कपल को खाना बनाने और सफाई के लिए नौकरानी चाहिए।',
    offerPrice: 'Starting at ₹2500/mo',
    earnText: 'Earn ₹2500-₹5000/mo',
    category: 'Household',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 14,
    image: '/images/problems/child-care.png',
    titleEn: 'Child Care/Babysitter',
    titleHi: 'बच्चे की देखभाल',
    descriptionEn: 'Need someone to pick kids from school and care for 2 hours.',
    descriptionHi: 'स्कूल से बच्चों को पिक करने और 2 घंटे देखभाल के लिए चाहिए।',
    offerPrice: 'Starting at ₹80/day',
    earnText: 'Earn ₹80-₹150/day',
    category: 'Care',
    gradient: 'from-pink-400 to-rose-400'
  },
  {
    id: 15,
    image: '/images/problems/grocery-help.png',
    titleEn: 'Grocery Pickup Help',
    titleHi: 'किराना पिकअप मदद',
    descriptionEn: 'Elderly person needs someone to get groceries from market.',
    descriptionHi: 'बुजुर्ग को बाजार से किराना लाने वाला चाहिए।',
    offerPrice: 'Starting at ₹30',
    earnText: 'Earn ₹30-₹80',
    category: 'Errand',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    id: 16,
    image: '/images/problems/water-delivery.png',
    titleEn: 'Water Can Delivery',
    titleHi: 'पानी कैन डिलीवरी',
    descriptionEn: 'Need 5 water cans delivered urgently. No water at home!',
    descriptionHi: '5 पानी कैन जल्दी चाहिए। घर में पानी नहीं है!',
    offerPrice: 'Starting at ₹50',
    earnText: 'Earn ₹50-₹100',
    category: 'Delivery',
    gradient: 'from-blue-400 to-cyan-400'
  },
  {
    id: 17,
    image: '/images/problems/gas-cylinder.png',
    titleEn: 'Gas Cylinder Needed',
    titleHi: 'गैस सिलेंडर चाहिए',
    descriptionEn: 'Gas cylinder empty! Need spare cylinder or refill urgently.',
    descriptionHi: 'गैस सिलेंडर खाली! स्पेयर सिलेंडर या रिफिल जल्दी चाहिए।',
    offerPrice: 'Starting at ₹100',
    earnText: 'Earn ₹100-₹200',
    category: 'Delivery',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    id: 18,
    image: '/images/problems/pet-care.png',
    titleEn: 'Pet Care/Walker',
    titleHi: 'पालतू देखभाल',
    descriptionEn: 'Need someone to walk dog and feed while at office.',
    descriptionHi: 'ऑफिस के दौरान कुत्ते को घुमाने और खिलाने वाला चाहिए।',
    offerPrice: 'Starting at ₹50/day',
    earnText: 'Earn ₹50-₹150/day',
    category: 'Care',
    gradient: 'from-amber-400 to-orange-400'
  },
  {
    id: 19,
    image: '/images/problems/bike-puncture.png',
    titleEn: 'Bike Puncture Help',
    titleHi: 'बाइक पंक्चर मदद',
    descriptionEn: 'Stuck on highway with puncture! Need someone with puncture kit.',
    descriptionHi: 'हाईवे पर पंक्चर से फंसा! पंक्चर किट वाले की जरूरत।',
    offerPrice: 'Starting at ₹50',
    earnText: 'Earn ₹50-₹150',
    category: 'Emergency',
    gradient: 'from-red-400 to-orange-400'
  },
  {
    id: 20,
    image: '/images/problems/elderly-care.png',
    titleEn: 'Elderly Care Help',
    titleHi: 'बुजुर्ग देखभाल मदद',
    descriptionEn: 'Need someone to stay with elderly parents while at work.',
    descriptionHi: 'काम के दौरान बुजुर्ग माता-पिता के साथ रहने वाला चाहिए।',
    offerPrice: 'Starting at ₹200/day',
    earnText: 'Earn ₹200-₹400/day',
    category: 'Care',
    gradient: 'from-purple-400 to-pink-400'
  }
]

// Split problems into groups of 5
const PROBLEM_GROUPS = Array.from({ length: 4 }, (_, i) => 
  EMOTIONAL_PROBLEMS.slice(i * 5, (i + 1) * 5)
)

// Pre-Login Explain Screens - Before any login (Psychological Flow)
const EXPLAIN_SCREENS = [
  {
    id: 1,
    icon: AlertTriangle,
    iconBg: 'from-red-500 to-orange-500',
    titleEn: 'Problem: Nearby help needed',
    titleHi: 'समस्या: पास में मदद चाहिए',
    subtitleEn: 'Puncture? Charging? Queue? Errand?',
    subtitleHi: 'पंकचर? चार्जिंग? लाइन? कोई काम?',
    descriptionEn: 'When you need help urgently, who do you call? Neighbors or professionals?',
    descriptionHi: 'जब जल्दी मदद चाहिए, किसे बुलाते हो? पड़ोसी या प्रोफेशनल?',
    points: [
      { en: 'Puncture on the road', hi: 'सड़क पर पंकचर' },
      { en: 'Phone battery died', hi: 'फोन की बैटरी खत्म' },
      { en: 'Need to stand in queue', hi: 'लाइन में खड़ा होना है' },
      { en: 'Someone to pick/drop', hi: 'कोई पिक/ड्रॉप करे' },
    ],
    // No urgency on first screen - keep it relatable
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
      { en: 'Fix a puncture - ₹50-100', hi: 'पंकचर ठीक करो - ₹50-100' },
      { en: 'Stand in queue - ₹100-200', hi: 'लाइन में खड़े रहो - ₹100-200' },
      { en: 'Lend your bike - ₹200-500', hi: 'बाइक दे दो - ₹200-500' },
      { en: 'Local guidance - ₹50-100', hi: 'रास्ता बताओ - ₹50-100' },
    ],
    // CURIOSITY & FOMO Elements
    urgencyBadge: '🔥 Limited Spots in Your Area!',
    urgencyBadgeHi: '🔥 आपके एरिया में लिमिटेड स्पॉट!',
    fomoText: '₹18,340 earned TODAY by people like you!',
    fomoTextHi: 'आप जैसे लोगों ने आज ₹18,340 कमाए!',
    gamification: { label: 'Active Earners Nearby', value: '87+', icon: 'users' },
    psychologyText: 'Your neighbor just earned ₹500 helping someone!',
    psychologyTextHi: 'आपके पड़ोसी ने अभी ₹500 कमाए मदद करके!',
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
    ],
    // URGENCY & GAMIFICATION
    urgencyBadge: '⚡ 5 Tasks Waiting NOW!',
    urgencyBadgeHi: '⚡ 5 काम अभी वेटिंग में!',
    fomoText: 'Don\'t miss out - others are earning RIGHT NOW!',
    fomoTextHi: 'मत छोड़ो - दूसरे अभी कमा रहे हैं!',
    gamification: { label: 'Your Potential Today', value: '₹200-₹300', icon: 'wallet' },
    psychologyText: 'Rahul from your area earned ₹250 today!',
    psychologyTextHi: 'राहुल ने आपके एरिया से आज ₹250 कमाए!',
    countdownText: 'Peak hours ending soon!',
    countdownTextHi: 'पीक आवर्स जल्दी खत्म!',
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
    ],
    // FINAL PUSH - MAXIMUM FOMO
    urgencyBadge: '🎉 First 100 users get FREE premium!',
    urgencyBadgeHi: '🎉 पहले 100 यूज़र्स को FREE प्रीमियम!',
    fomoText: '93 spots already taken! Only 7 left!',
    fomoTextHi: '93 स्पॉट पहले ही गए! सिर्फ 7 बचे!',
    gamification: { label: 'Your Early Bird Bonus', value: '₹20', icon: 'gift' },
    psychologyText: 'This opportunity won\'t come again!',
    psychologyTextHi: 'ये मौका दोबारा नहीं आएगा!',
    countdownText: 'Offer ends in 10 minutes!',
    countdownTextHi: 'ऑफर 10 मिनट में खत्म!',
    socialProof: '12 people joined in last 5 minutes!',
    socialProofHi: 'पिछले 5 मिनट में 12 लोग जुड़े!',
  }
]

export function WelcomeScreen() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [problemPage, setProblemPage] = useState(0) // 0, 1, 2, 3 for 4 pages of 5 images
  const { setScreen, setTempReferralCode, darkMode, locationAddress } = useAppStore()
  const screen = EXPLAIN_SCREENS[currentScreen]
  const Icon = screen.icon
  
  // Marketing Stats Animation
  const [animatedUsers, setAnimatedUsers] = useState(0)
  const [animatedEarnings, setAnimatedEarnings] = useState(0)
  const [currentBanner, setCurrentBanner] = useState(0)
  
  // Countdown Timer - 10 minutes
  const [countdown, setCountdown] = useState(10 * 60) // 10 minutes in seconds
  
  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
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

    // Rotate banners every 3 seconds
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % URGENCY_BANNERS.length)
    }, 3000)

    // Countdown timer - decrease every second
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) return 10 * 60 // Reset to 10 min if reaches 0
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(userInterval)
      clearInterval(earningsInterval)
      clearInterval(bannerInterval)
      clearInterval(countdownInterval)
      clearInterval(bannerInterval)
    }
  }, [])
  
  // Get location display name
  const locationDisplayName = locationAddress?.displayName || locationAddress?.city || locationAddress?.village || ''
  
  // Get current 5 problems
  const currentProblems = PROBLEM_GROUPS[problemPage]
  const totalProblemPages = PROBLEM_GROUPS.length
  
  const handleNextProblems = () => {
    if (problemPage < totalProblemPages - 1) {
      setProblemPage(problemPage + 1)
    }
  }
  
  const handlePrevProblems = () => {
    if (problemPage > 0) {
      setProblemPage(problemPage - 1)
    }
  }
  
  const handleNext = () => {
    if (currentScreen < EXPLAIN_SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1)
    }
  }
  
  const handleGetStarted = () => {
    const tempCode = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setTempReferralCode(tempCode)
    setScreen('pre-login-share')
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4 px-4 pb-2 bg-white/80 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring' }}
              className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden"
            >
              <LogoIcon size={32} />
            </motion.div>
            <div>
              <span className={`font-bold text-base`}>
                <span className="text-purple-600">Community</span>
                <span className="text-pink-500"> Help </span>
                <span className="text-rose-600">Network</span>
              </span>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>लोगों को जोड़ना</p>
            </div>
          </div>
          
          {/* Right Side - Login Option & Progress dots */}
          <div className="flex items-center gap-3">
            {/* Already Registered? Login Option - Top Right */}
            <button
              onClick={() => setScreen('login')}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border ${darkMode ? 'text-blue-400 border-blue-500 hover:bg-blue-900/30' : 'text-blue-600 border-blue-300 hover:bg-blue-50'}`}
            >
              Login / लॉगिन
            </button>
            
            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {EXPLAIN_SCREENS.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentScreen 
                      ? 'w-6 bg-gradient-to-r from-purple-500 to-pink-500' 
                      : index < currentScreen 
                        ? 'w-1.5 bg-purple-400' 
                        : darkMode ? 'w-1.5 bg-gray-600' : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Marketing Hooks Section - Before Problem Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3"
      >
        {/* Live Stats Section */}
        <div className={`rounded-2xl overflow-hidden shadow-lg mb-3 ${darkMode ? 'bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-rose-900/80' : 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500'}`}>
          <div className="p-3">
            {/* Live Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-xs font-medium">LIVE - 20KM Radius</span>
              </div>
              {locationDisplayName && (
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {locationDisplayName}
                </Badge>
              )}
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-xl font-bold text-white">{animatedUsers}</span>
                </div>
                <p className="text-white/70 text-[10px]">Users Online</p>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="flex items-center justify-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-xl font-bold text-white">₹{animatedEarnings.toLocaleString()}</span>
                </div>
                <p className="text-white/70 text-[10px]">Earned Today</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-xl font-bold text-white">7</span>
                </div>
                <p className="text-white/70 text-[10px]">Active Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Banner (Blinkit Style) - Rotating */}
        <div className={`rounded-xl overflow-hidden bg-gradient-to-r ${URGENCY_BANNERS[currentBanner].color} shadow-lg mb-3`}>
          <div className="px-3 py-2">
            <p className="text-white font-bold text-xs text-center">
              {URGENCY_BANNERS[currentBanner].text}
            </p>
            <p className="text-white/80 text-[10px] text-center">
              {URGENCY_BANNERS[currentBanner].textHi}
            </p>
          </div>
        </div>

        {/* Gamification Row */}
        <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'} border shadow-lg mb-3`}>
          <div className="grid grid-cols-4 gap-2">
            {/* Daily Streak */}
            <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-purple-500" />
                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</span>
              </div>
              <p className={`text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Streak</p>
            </div>
            {/* Area Rank */}
            <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className="flex items-center justify-center gap-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>#12</span>
              </div>
              <p className={`text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rank</p>
            </div>
            {/* Total Earned */}
            <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹850</span>
              </div>
              <p className={`text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Earned</p>
            </div>
            {/* Level */}
            <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
              <div className="flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>L2</span>
              </div>
              <p className={`text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Problem Cards - 5 at a time with full images */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-3 py-3"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {locationDisplayName ? `People Need Help in ${locationDisplayName}` : 'People Need Help Nearby'}
            </p>
          </div>
          <Badge className="bg-red-100 text-red-700 text-xs">
            {problemPage + 1}/{totalProblemPages}
          </Badge>
        </div>
        
        {/* 5 Cards Grid - Full Image Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={problemPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-3"
          >
            {currentProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md overflow-hidden`}>
                  <div className="flex">
                    {/* Full Image on Left */}
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <img 
                        src={problem.image} 
                        alt={problem.titleEn}
                        className="w-full h-full object-cover"
                      />
                      {/* Earn Badge on Image - Shows Income Potential */}
                      <Badge className={`absolute top-1 left-1 bg-green-500 text-white text-[9px] shadow-lg px-1.5 py-0.5 font-bold`}>
                        {problem.earnText}
                      </Badge>
                    </div>
                    
                    {/* Content on Right */}
                    <CardContent className="p-2 flex-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {problem.titleEn}
                        </p>
                        <Badge variant="outline" className="text-[10px] ml-1 flex-shrink-0">
                          {problem.category}
                        </Badge>
                      </div>
                      <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {problem.titleHi}
                      </p>
                      <p className={`text-xs line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {problem.descriptionEn}
                      </p>
                      {/* Price Section - Starting at for Clients */}
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                          {problem.offerPrice}
                        </p>
                        <p className={`text-[10px] line-clamp-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {problem.descriptionHi}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons for Problems */}
        <div className="flex items-center justify-between mt-3 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevProblems}
            disabled={problemPage === 0}
            className={`h-8 px-3 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600'} disabled:opacity-30`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          {/* Page dots */}
          <div className="flex items-center gap-1">
            {PROBLEM_GROUPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === problemPage 
                    ? 'w-4 bg-orange-500' 
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextProblems}
            disabled={problemPage === totalProblemPages - 1}
            className={`h-8 px-3 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600'} disabled:opacity-30`}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>

      {/* Share CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 py-2"
      >
        <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-r from-purple-100 to-pink-100'} border ${darkMode ? 'border-purple-800' : 'border-purple-200'}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-500" />
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Share & Build Your Network!
            </p>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            शेयर करो और अपना नेटवर्क बनाओ!
          </p>
        </div>
      </motion.div>
      
      {/* Explain Screens - Compact with Psychology */}
      <AnimatePresence mode="wait">
        <motion.div
          key={screen.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="px-4 py-2"
        >
          <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            {/* Urgency Badge - Screen 2,3,4 */}
            {screen.urgencyBadge && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mb-3 p-2 rounded-xl text-center ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}
              >
                <p className={`text-sm font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {screen.urgencyBadge}
                </p>
                <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
                  {screen.urgencyBadgeHi}
                </p>
              </motion.div>
            )}
            
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${screen.iconBg} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {screen.titleEn}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {screen.titleHi}
                </p>
              </div>
            </div>
            
            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {screen.descriptionEn}
            </p>
            
            <div className="grid grid-cols-2 gap-1">
              {screen.points.slice(0, 4).map((point, index) => (
                <div key={index} className={`flex items-center gap-1.5 p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${screen.iconBg} flex items-center justify-center text-white text-xs`}>
                    ✓
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{point.en}</span>
                </div>
              ))}
            </div>

            {/* FOMO Section - Screen 2,3,4 */}
            {screen.fomoText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`mt-3 p-2 rounded-xl ${darkMode ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}
              >
                <p className={`text-sm font-bold text-center ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  💰 {screen.fomoText}
                </p>
                <p className={`text-xs text-center ${darkMode ? 'text-purple-300' : 'text-purple-500'}`}>
                  {screen.fomoTextHi}
                </p>
              </motion.div>
            )}

            {/* Gamification Card - Screen 2,3,4 */}
            {screen.gamification && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`mt-3 p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-800' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'}`}
              >
                <div className="flex items-center gap-2">
                  {screen.gamification.icon === 'users' && <Users className="w-5 h-5 text-green-500" />}
                  {screen.gamification.icon === 'wallet' && <Wallet className="w-5 h-5 text-green-500" />}
                  {screen.gamification.icon === 'gift' && <span className="text-lg">🎁</span>}
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{screen.gamification.label}</span>
                </div>
                <span className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{screen.gamification.value}</span>
              </motion.div>
            )}

            {/* Psychology Text - Screen 2,3,4 */}
            {screen.psychologyText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`mt-2 p-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}
              >
                <span className="text-sm">💡</span>
                <div>
                  <p className={`text-xs font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{screen.psychologyText}</p>
                  <p className={`text-[10px] ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>{screen.psychologyTextHi}</p>
                </div>
              </motion.div>
            )}

            {/* Countdown - Screen 3,4 */}
            {screen.countdownText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`mt-2 p-2 rounded-lg text-center ${darkMode ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <p className={`text-sm font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {screen.countdownText}
                  </p>
                </div>
                <p className={`text-xs ${darkMode ? 'text-yellow-300' : 'text-yellow-500'}`}>
                  {screen.countdownTextHi}
                </p>
                {/* Live Countdown Timer */}
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`mt-1 px-3 py-1 rounded-full inline-block ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}
                >
                  <span className={`text-lg font-mono font-bold ${countdown < 60 ? 'text-red-500 animate-pulse' : darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    ⏱️ {formatCountdown(countdown)}
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* Social Proof - Screen 4 only */}
            {screen.socialProof && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className={`mt-2 p-2 rounded-lg text-center ${darkMode ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}
              >
                <p className={`text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  👥 {screen.socialProof}
                </p>
                <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-500'}`}>
                  {screen.socialProofHi}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Buttons */}
      <div className="px-4 pb-6 pt-2">
        <Button
          onClick={currentScreen < EXPLAIN_SCREENS.length - 1 ? handleNext : handleGetStarted}
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg"
        >
          {currentScreen < EXPLAIN_SCREENS.length - 1 ? (
            <>
              Next / आगे बढ़ें <ChevronRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Get Started / शुरू करें <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
      
      {/* Copyright Footer */}
      <footer className="fixed bottom-3 right-3 z-40">
        <p className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © Harish Rawat
        </p>
      </footer>
    </div>
  )
}
