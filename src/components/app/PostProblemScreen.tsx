'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  MapPin, 
  Loader2,
  AlertCircle,
  Clock,
  Package,
  HandHeart,
  Zap,
  Users,
  CheckCircle,
  Phone,
  Navigation,
  Shield,
  Camera,
  X,
  Image as ImageIcon
} from 'lucide-react'
import { useAppStore } from '@/store'
import { 
  ProblemType, 
  EMERGENCY_CATEGORIES, 
  TIME_ACCESS_CATEGORIES, 
  RESOURCE_CATEGORIES,
  MIN_TRUST_REQUIRED
} from '@/types'
import { LocationPicker } from './LocationPicker'

export function PostProblemScreen() {
  const { user, setScreen, location, setLocation, requestLocation, isSubscriptionActive, canPostProblem, darkMode } = useAppStore()
  
  const [step, setStep] = useState(1)
  const [type, setType] = useState<ProblemType | null>(null)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [image, setImage] = useState<string | null>(null)  // Base64 image
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(location)
  const [selectedAddress, setSelectedAddress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canPost = canPostProblem()
  const isActive = isSubscriptionActive()

  const typeOptions = [
    { 
      type: 'EMERGENCY' as ProblemType, 
      labelEn: 'Emergency Help',
      labelHi: 'आपातकालीन मदद',
      icon: '🆘', 
      gradient: 'from-red-500 to-orange-500',
      descEn: 'Puncture, Charging, Jump Start, Tow',
      descHi: 'पंक्चर, चार्जिंग, जंप स्टार्ट, टो',
      trustLevel: 40
    },
    { 
      type: 'TIME_ACCESS' as ProblemType, 
      labelEn: 'Time / Access',
      labelHi: 'समय / पहुंच',
      icon: '⏰', 
      gradient: 'from-blue-500 to-cyan-500',
      descEn: 'Queue, Errands, Guide, Watch',
      descHi: 'लाइन, दौड़-धूप, गाइड, निगरानी',
      trustLevel: 50
    },
    { 
      type: 'RESOURCE_RENT' as ProblemType, 
      labelEn: 'Resource / Rent',
      labelHi: 'संसाधन / किराया',
      icon: '📦', 
      gradient: 'from-green-500 to-emerald-500',
      descEn: 'Bike, Tools, Electronics, Items',
      descHi: 'बाइक, टूल्स, इलेक्ट्रॉनिक्स, सामान',
      trustLevel: 70
    },
  ]

  const getCategories = () => {
    switch (type) {
      case 'EMERGENCY':
        return EMERGENCY_CATEGORIES
      case 'TIME_ACCESS':
        return TIME_ACCESS_CATEGORIES
      case 'RESOURCE_RENT':
        return RESOURCE_CATEGORIES
      default:
        return []
    }
  }

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng })
    setLocation({ lat, lng })
    if (address) setSelectedAddress(address)
  }

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB / फोटो 5MB से कम होनी चाहिए')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setImage(base64)
    }
    reader.readAsDataURL(file)
  }

  // Remove image
  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    setError('')
    
    if (!user || !type || !title || !selectedLocation) {
      setError('Please fill all required fields / कृपया सभी जानकारी भरें')
      return
    }

    setIsLoading(true)
    
    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type,
          category,
          title,
          description,
          offerPrice: offerPrice ? parseFloat(offerPrice) : null,
          image,  // Include image
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          minTrustRequired: MIN_TRUST_REQUIRED[type === 'EMERGENCY' ? 'LOW' : type === 'TIME_ACCESS' ? 'MEDIUM' : 'HIGH']
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to post request')
      }
    } catch {
      setError('Something went wrong / कुछ गलत हो गया')
    } finally {
      setIsLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-green-50 to-white'}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Request Submitted!
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            आपका अनुरोध भेज दिया गया है!
          </p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center`}>
            Status: OPEN • Nearby helpers will see this
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
            स्थिति: खुला • पास के मददगार इसे देखेंगे
          </p>
          
          <div className={`p-4 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-green-600" />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>What happens next?</span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Helpers will call you directly. Decide price yourself.
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
              मददगार सीधे आपको कॉल करेंगे। कीमत खुद तय करें।
            </p>
          </div>
          
          <Button
            onClick={() => setScreen('home')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white h-14 rounded-2xl font-bold text-lg px-8"
          >
            <HandHeart className="w-5 h-5 mr-2" />
            Theek hai / OK
          </Button>
        </motion.div>
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setScreen('home')}>
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
            </Button>
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Post Request</h1>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className={`w-20 h-20 rounded-3xl ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'} flex items-center justify-center mb-4`}>
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Subscription Required</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
            Activate your subscription to post requests
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
            अनुरोध पोस्ट करने के लिए सदस्यता लें
          </p>
          <Button
            onClick={() => setScreen('subscription')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white h-12 rounded-xl font-bold px-6"
          >
            Activate Now - ₹49/month
          </Button>
        </main>
      </div>
    )
  }

  if (!canPost) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setScreen('home')}>
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
            </Button>
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Post Request</h1>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className={`w-20 h-20 rounded-3xl ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} flex items-center justify-center mb-4`}>
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Account Restricted</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
            Your account is currently restricted. Please contact support.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => step === 1 ? setScreen('home') : setStep(step - 1)}
            className="rounded-xl"
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div className="flex-1">
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Post Help Request</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Step {step} of 3 / चरण {step} / 3</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className={`h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Type Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <div className="mb-4">
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What type of help do you need?
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                आपको किस तरह की मदद चाहिए?
              </p>
            </div>
            
            {typeOptions.map((option, idx) => (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    type === option.type 
                      ? 'border-2 border-orange-500 shadow-lg ring-2 ring-orange-200' 
                      : darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                        : 'border hover:border-gray-300'
                  }`}
                  onClick={() => { setType(option.type); setCategory('') }}
                >
                  <div className={`h-1 bg-gradient-to-r ${option.gradient}`} />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{option.labelEn}</h3>
                          {type === option.type && (
                            <Badge className="bg-orange-500 text-white">Selected</Badge>
                          )}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{option.labelHi}</p>
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{option.descEn}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>{option.descHi}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Shield className="w-3 h-3 text-blue-500" />
                          <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Trust: {option.trustLevel}+ required
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button
              onClick={() => setStep(2)}
              disabled={!type}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl mt-4"
            >
              Continue / आगे बढ़ें
            </Button>
          </motion.div>
        )}

        {/* Step 2: Category & Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="mb-4">
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Select category & describe
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                श्रेणी चुनें और विवरण दें
              </p>
            </div>
            
            {/* Categories */}
            <div>
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>
                Category / श्रेणी
              </label>
              <ScrollArea className="h-48">
                <div className="grid grid-cols-2 gap-2 pr-2">
                  {getCategories().map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        category === cat.id 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                          : darkMode 
                            ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                            : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <p className="font-medium text-sm mt-1">{cat.label}</p>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Title */}
            <div>
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                Problem Title * / समस्या का शीर्षक
              </label>
              <Input
                placeholder="e.g., Bike puncture near MG Road"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                maxLength={100}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{title.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                Description / विवरण
              </label>
              <Textarea
                placeholder="Describe your problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                rows={3}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>
                📷 Problem Photo (Optional) / समस्या की फोटो
              </label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                capture="environment"
              />
              
              {image ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-orange-300 dark:border-orange-600">
                  <img 
                    src={image} 
                    alt="Problem photo" 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium">✓ Photo attached / फोटो जुड़ गई</p>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all hover:border-orange-400 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-800/50 hover:bg-gray-800' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="text-center">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Tap to add photo
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        फोटो जोड़ने के लिए टैप करें
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Helpers can see the problem before helping
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                💡 Photo helps helper understand the problem better
              </p>
            </div>

            {/* Offer Price */}
            <div>
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                Offer Price (Optional) / कीमत का प्रस्ताव
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
                <Input
                  type="number"
                  placeholder="How much can you pay?"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className={`pl-10 h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                />
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Leave empty for negotiable / बातचीत के लिए खाली छोड़ें
              </p>
            </div>

            <Button
              onClick={() => setStep(3)}
              disabled={!title}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl"
            >
              Continue / आगे बढ़ें
            </Button>
          </motion.div>
        )}

        {/* Step 3: Location & Submit */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="mb-4">
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirm location & submit
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                स्थान की पुष्टि करें और जमा करें
              </p>
            </div>
            
            {/* Location Picker */}
            <LocationPicker 
              onLocationSelect={handleLocationSelect}
              initialLocation={selectedLocation}
            />

            {/* Who can see this */}
            <Card className={`${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                    Who can see this request?
                  </h3>
                </div>
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  {type === 'RESOURCE_RENT' 
                    ? 'Only Trusted users (70+ trust score) within 20 KM' 
                    : type === 'TIME_ACCESS'
                    ? 'Users with 50+ trust score within 20 KM'
                    : 'Users with 40+ trust score within 20 KM'
                  }
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`}>
                  {type === 'RESOURCE_RENT' 
                    ? 'सिर्फ विश्वसनीय उपयोगकर्ता (70+ ट्रस्ट स्कोर) 20 किमी के भीतर' 
                    : type === 'TIME_ACCESS'
                    ? '50+ ट्रस्ट स्कोर वाले उपयोगकर्ता 20 किमी के भीतर'
                    : '40+ ट्रस्ट स्कोर वाले उपयोगकर्ता 20 किमी के भीतर'
                  }
                </p>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card className={`${darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'} border`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <h3 className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                    How this works?
                  </h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">1</span>
                    <span className={darkMode ? 'text-green-300' : 'text-green-700'}>Helpers see your request nearby</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">2</span>
                    <span className={darkMode ? 'text-green-300' : 'text-green-700'}>They call you directly on your phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">3</span>
                    <span className={darkMode ? 'text-green-300' : 'text-green-700'}>You decide price, pay via Cash/UPI</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardContent className="p-4">
                <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Summary / सारांश</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Type:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {typeOptions.find(t => t.type === type)?.labelEn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Category:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {getCategories().find(c => c.id === category)?.label || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Offer Price:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {offerPrice ? `₹${offerPrice}` : 'Negotiable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Status:</span>
                    <Badge className="bg-blue-100 text-blue-700">OPEN</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !selectedLocation}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Submit Request / अनुरोध भेजें
                </>
              )}
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
