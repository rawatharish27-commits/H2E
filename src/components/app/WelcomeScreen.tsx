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
  Heart
} from 'lucide-react'
import { useAppStore } from '@/store'

// 20 Emotional Problem Examples with Images - Grid View
const EMOTIONAL_PROBLEMS = [
  {
    id: 1,
    image: '/images/problems/pregnant-hospital.png',
    titleEn: 'Pregnant Lady to Hospital',
    titleHi: 'प्रेगनेंट महिला को अस्पताल',
    descriptionEn: 'Emergency! Need someone to take pregnant wife to hospital immediately.',
    descriptionHi: 'आपातकालीन! गर्भवती पत्नी को तुरंत अस्पताल ले जाना है।',
    offerPrice: '₹200',
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
    offerPrice: '₹50',
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
    offerPrice: '₹300',
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
    offerPrice: '₹500',
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
    offerPrice: '₹500/day',
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
    offerPrice: '₹150',
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
    offerPrice: '₹200',
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
    offerPrice: '₹250',
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
    offerPrice: '₹100',
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
    offerPrice: '₹150',
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
    offerPrice: '₹300',
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
    offerPrice: '₹400',
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
    offerPrice: '₹3000/mo',
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
    offerPrice: '₹100/day',
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
    offerPrice: '₹50',
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
    offerPrice: '₹100',
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
    offerPrice: '₹150',
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
    offerPrice: '₹100/day',
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
    offerPrice: '₹100',
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
    offerPrice: '₹300/day',
    category: 'Care',
    gradient: 'from-purple-400 to-pink-400'
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
    const tempCode = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setTempReferralCode(tempCode)
    localStorage.setItem('hasSeenWelcome', 'true')
    setScreen('pre-login-share')
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
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
                <span className="text-blue-600">Help</span>
                <span className="text-green-600">2</span>
                <span className="text-orange-600">Earn</span>
              </span>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>लोगों को जोड़ना</p>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {EXPLAIN_SCREENS.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentScreen 
                    ? 'w-6 bg-gradient-to-r from-orange-500 to-red-500' 
                    : index < currentScreen 
                      ? 'w-1.5 bg-orange-400' 
                      : darkMode ? 'w-1.5 bg-gray-600' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* 20 Emotional Problems Grid - Images on TOP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-3 py-3"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              People Need Help Nearby
            </p>
          </div>
          <Badge className="bg-red-100 text-red-700 text-xs">
            20 Requests
          </Badge>
        </div>
        
        {/* Grid View - 2 columns, 10 rows = 20 cards */}
        <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pb-2">
          {EMOTIONAL_PROBLEMS.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md overflow-hidden`}>
                {/* Image on TOP */}
                <div className="relative">
                  <img 
                    src={problem.image} 
                    alt={problem.titleEn}
                    className="w-full h-24 object-cover"
                  />
                  {/* Price Badge */}
                  <Badge className={`absolute top-2 right-2 bg-gradient-to-r ${problem.gradient} text-white text-xs shadow-lg`}>
                    {problem.offerPrice}
                  </Badge>
                  {/* Category */}
                  <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/90 text-gray-700 text-xs">
                    {problem.category}
                  </Badge>
                </div>
                
                <CardContent className="p-2">
                  {/* Title */}
                  <p className={`font-bold text-xs truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {problem.titleEn}
                  </p>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {problem.titleHi}
                  </p>
                  
                  {/* Description */}
                  <p className={`text-xs line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {problem.descriptionEn}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Share CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 py-2"
      >
        <div className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30' : 'bg-gradient-to-r from-orange-100 to-red-100'} border ${darkMode ? 'border-orange-800' : 'border-orange-200'}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="w-5 h-5 text-orange-500" />
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Share & Build Your Network!
            </p>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            शेयर करो और अपना नेटवर्क बनाओ!
          </p>
        </div>
      </motion.div>
      
      {/* Explain Screens - Compact */}
      <AnimatePresence mode="wait">
        <motion.div
          key={screen.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="px-4 py-2"
        >
          <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
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
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Buttons */}
      <div className="px-4 pb-6 pt-2">
        <Button
          onClick={currentScreen < EXPLAIN_SCREENS.length - 1 ? handleNext : handleGetStarted}
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg"
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
    </div>
  )
}
