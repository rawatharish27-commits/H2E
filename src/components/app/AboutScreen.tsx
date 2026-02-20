'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Heart, 
  Target, 
  Shield, 
  Users, 
  Sparkles,
  Award,
  Globe,
  Zap,
  TrendingUp,
  BadgeCheck
} from 'lucide-react'
import { useAppStore } from '@/store'

interface AboutScreenProps {
  onBack: () => void
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  const { darkMode } = useAppStore()
  
  const features = [
    {
      icon: Zap,
      title: 'Instant Help',
      titleHindi: 'तुरंत मदद',
      description: 'Get help within minutes from nearby verified helpers',
      descriptionHindi: 'पास के वेरिफाइड हेल्पर्स से मिनटों में मदद पाएं',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      titleHindi: 'विश्वसनीय समुदाय',
      description: 'Phone verified users with trust scores and reviews',
      descriptionHindi: 'ट्रस्ट स्कोर और रिव्यूज के साथ फोन वेरिफाइड यूजर्स',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      titleHindi: 'सुरक्षित और सुरक्षित',
      description: 'Location-based matching, SOS button, and 24/7 support',
      descriptionHindi: 'लोकेशन-बेस्ड मैचिंग, SOS बटन, और 24/7 सपोर्ट',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Earn & Grow',
      titleHindi: 'कमाएं और बढ़ें',
      description: 'Turn your time, skills, and resources into income',
      descriptionHindi: 'अपना समय, कौशल और संसाधन आय में बदलें',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const stats = [
    { value: '150+', label: 'Resources', labelHindi: 'संसाधन' },
    { value: '15', label: 'Categories', labelHindi: 'श्रेणियां' },
    { value: '20KM', label: 'Nearby', labelHindi: 'पास में' },
    { value: '24/7', label: 'Support', labelHindi: 'सहायता' }
  ]

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-orange-100'} shadow-lg`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div>
            <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>About Us</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>हमारे बारे में</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white flex items-center justify-center shadow-2xl overflow-hidden"
          >
            <img 
              src="/logo-handshake.png" 
              alt="Help2Earn Logo" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Help2Earn</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Connecting People</p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>लोगों को जोड़ना</p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-xl mb-4 overflow-hidden rounded-3xl`}>
            <div className="h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <Target className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Our Mission</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>हमारा मिशन</p>
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-3`}>
                We believe everyone has something valuable to offer - time, skills, or resources. 
                Help2Earn connects people who need help with those who can provide it, 
                creating opportunities for earning while building a supportive community.
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm leading-relaxed`}>
                हम मानते हैं कि हर किसी के पास देने के लिए कुछ मूल्यवान है - समय, कौशल, या संसाधन। 
                Help2Earn उन लोगों से जोड़ता है जिन्हें मदद चाहिए और जो मदद कर सकते हैं।
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-2 mb-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} p-4 rounded-2xl shadow-lg text-center border`}
            >
              <p className="text-xl font-bold text-orange-600">{stat.value}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{stat.labelHindi}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Why Help2Earn?</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Help2Earn क्यों?</p>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-lg rounded-2xl overflow-hidden`}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h4>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{feature.titleHindi}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{feature.description}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{feature.descriptionHindi}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden rounded-3xl">
            <CardContent className="p-6 text-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <Heart className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">Made with ❤️ in India</h3>
                <p className="text-white/90 text-sm mb-2">
                  A platform by the people, for the people. Together, we're building a 
                  more helpful and connected society.
                </p>
                <p className="text-white/70 text-xs">
                  लोगों द्वारा, लोगों के लिए एक प्लेटफॉर्म। साथ मिलकर, हम एक अधिक 
                  मददगार और जुड़े हुए समाज का निर्माण कर रहे हैं।
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs mt-8`}
        >
          Version 1.0.0 • © 2024 Help2Earn
        </motion.p>
      </main>
    </div>
  )
}
