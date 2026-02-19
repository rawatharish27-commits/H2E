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
import { IncomeStoryModal } from './IncomeStoryModal'

export function HomeScreen() {
  const { user, setScreen, isSubscriptionActive, getTrustInfo, requestLocation, location, darkMode, toggleDarkMode } = useAppStore()
  const [showMenu, setShowMenu] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'emergency' | 'rent' | 'skill'>('all')
  const [showIncomeStory, setShowIncomeStory] = useState(false)
  const [selectedHelpCard, setSelectedHelpCard] = useState<typeof allHelpCards[0] | null>(null)

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

  // All Help Cards - 45 Categories (15 Daily Need + 30 Situational)
  const allHelpCards = [
    // Daily Need Help Categories (15 cards - marked with isDailyNeed: true)
    {
      id: 'critical-sos',
      icon: '🆘',
      titleEn: 'Critical SOS',
      titleHi: 'आपातकालीन SOS',
      descriptionEn: 'Immediate emergency help for critical situations',
      descriptionHi: 'गंभीर स्थितियों के लिए तत्काल आपातकालीन मदद',
      avgEarning: '₹200-500',
      timeRequired: 'Urgent',
      successRate: '95%',
      isDailyNeed: true,
      gradient: 'from-red-500 to-rose-500'
    },
    {
      id: 'emergency-road',
      icon: '🚗',
      titleEn: 'Road Emergency',
      titleHi: 'सड़क आपातकाल',
      descriptionEn: 'Vehicle breakdown and roadside assistance',
      descriptionHi: 'वाहन खराबी और सड़क किनारे सहायता',
      avgEarning: '₹100-300',
      timeRequired: '30-60 min',
      successRate: '90%',
      isDailyNeed: true,
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 'safety-escort',
      icon: '🛡️',
      titleEn: 'Safety Escort',
      titleHi: 'सुरक्षा साथी',
      descriptionEn: 'Safe accompaniment for travel and late hours',
      descriptionHi: 'यात्रा और देर शाम के लिए सुरक्षित साथ',
      avgEarning: '₹100-300',
      timeRequired: '1-2 hrs',
      successRate: '92%',
      isDailyNeed: true,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'patient-medical',
      icon: '🏥',
      titleEn: 'Patient Medical',
      titleHi: 'मरीज चिकित्सा',
      descriptionEn: 'Hospital visits, medicine delivery, patient care',
      descriptionHi: 'अस्पताल विज़िट, दवा डिलीवरी, मरीज देखभाल',
      avgEarning: '₹150-400',
      timeRequired: '2-4 hrs',
      successRate: '94%',
      isDailyNeed: true,
      gradient: 'from-red-400 to-pink-500'
    },
    {
      id: 'elderly-assist',
      icon: '👴',
      titleEn: 'Elderly Assist',
      titleHi: 'बुजुर्ग सहायता',
      descriptionEn: 'Help for senior citizens with daily tasks',
      descriptionHi: 'वरिष्ठ नागरिकों को दैनिक कार्यों में मदद',
      avgEarning: '₹100-250',
      timeRequired: '1-3 hrs',
      successRate: '96%',
      isDailyNeed: true,
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'child-family',
      icon: '👶',
      titleEn: 'Child & Family',
      titleHi: 'बच्चे और परिवार',
      descriptionEn: 'Babysitting, school pickup, homework help',
      descriptionHi: 'बच्चों की देखभाल, स्कूल पिकअप, होमवर्क मदद',
      avgEarning: '₹100-300',
      timeRequired: '1-4 hrs',
      successRate: '93%',
      isDailyNeed: true,
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'line-presence',
      icon: '🧍',
      titleEn: 'Line Presence',
      titleHi: 'लाइन में खड़े होना',
      descriptionEn: 'Standing in queues at banks, offices, hospitals',
      descriptionHi: 'बैंक, कार्यालय, अस्पतालों में लाइन में खड़े होना',
      avgEarning: '₹50-200',
      timeRequired: '1-3 hrs',
      successRate: '88%',
      isDailyNeed: true,
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'shopping-errand',
      icon: '🛒',
      titleEn: 'Shopping Errand',
      titleHi: 'खरीदारी दौड़',
      descriptionEn: 'Grocery pickup, market shopping, deliveries',
      descriptionHi: 'किराना पिकअप, बाजार खरीदारी, डिलीवरी',
      avgEarning: '₹50-150',
      timeRequired: '30-90 min',
      successRate: '91%',
      isDailyNeed: true,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'household-help',
      icon: '🏠',
      titleEn: 'Household Help',
      titleHi: 'घरेलू मदद',
      descriptionEn: 'Cleaning, cooking, minor repairs at home',
      descriptionHi: 'सफाई, खाना बनाना, घर में छोटी मरम्मत',
      avgEarning: '₹100-300',
      timeRequired: '1-3 hrs',
      successRate: '89%',
      isDailyNeed: true,
      gradient: 'from-amber-500 to-yellow-500'
    },
    {
      id: 'vehicle-transport',
      icon: '🏍️',
      titleEn: 'Vehicle Transport',
      titleHi: 'वाहन परिवहन',
      descriptionEn: 'Lift sharing, pickup-drop, local transport',
      descriptionHi: 'लिफ्ट शेयरिंग, पिकअप-ड्रॉप, स्थानीय परिवहन',
      avgEarning: '₹30-200',
      timeRequired: '15-60 min',
      successRate: '87%',
      isDailyNeed: true,
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 'temp-manpower',
      icon: '💪',
      titleEn: 'Temp Manpower',
      titleHi: 'अस्थायी मजदूर',
      descriptionEn: 'Temporary help for events, shifting, loading',
      descriptionHi: 'कार्यक्रमों, शिफ्टिंग, लोडिंग के लिए अस्थायी मदद',
      avgEarning: '₹200-500',
      timeRequired: '2-8 hrs',
      successRate: '85%',
      isDailyNeed: true,
      gradient: 'from-slate-500 to-gray-600'
    },
    {
      id: 'item-sharing',
      icon: '📦',
      titleEn: 'Item Sharing',
      titleHi: 'सामान साझा करना',
      descriptionEn: 'Tools, appliances, household items on rent/share',
      descriptionHi: 'किराये/साझे पर उपकरण, उपकरण, घरेलू सामान',
      avgEarning: '₹50-300',
      timeRequired: 'Flexible',
      successRate: '82%',
      isDailyNeed: true,
      gradient: 'from-orange-400 to-red-400'
    },
    {
      id: 'digital-form',
      icon: '📱',
      titleEn: 'Digital Form',
      titleHi: 'डिजिटल फॉर्म',
      descriptionEn: 'Online forms, UPI help, digital literacy',
      descriptionHi: 'ऑनलाइन फॉर्म, UPI मदद, डिजिटल साक्षरता',
      avgEarning: '₹50-200',
      timeRequired: '30-60 min',
      successRate: '90%',
      isDailyNeed: true,
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'local-knowledge',
      icon: '🗺️',
      titleEn: 'Local Knowledge',
      titleHi: 'स्थानीय जानकारी',
      descriptionEn: 'Area guidance, directions, local tips',
      descriptionHi: 'क्षेत्र मार्गदर्शन, दिशाएं, स्थानीय सुझाव',
      avgEarning: '₹30-100',
      timeRequired: '15-30 min',
      successRate: '95%',
      isDailyNeed: true,
      gradient: 'from-teal-400 to-green-500'
    },
    {
      id: 'pet-animal',
      icon: '🐕',
      titleEn: 'Pet & Animal',
      titleHi: 'पालतू जानवर',
      descriptionEn: 'Dog walking, pet care, feeding strays',
      descriptionHi: 'कुत्ते को घुमाना, पालतू देखभाल, आवारों को खिलाना',
      avgEarning: '₹50-200',
      timeRequired: '30-60 min',
      successRate: '88%',
      isDailyNeed: true,
      gradient: 'from-amber-400 to-orange-500'
    },
    // Situational Cards (30 cards)
    {
      id: 'wedding-saree',
      icon: '👰',
      titleEn: 'Wedding Saree',
      titleHi: 'शादी की साड़ी',
      descriptionEn: 'Wedding coming up? Need a saree for just one day?',
      descriptionHi: 'शादी है? सिर्फ़ एक दिन के लिए साड़ी चाहिए?',
      avgEarning: '₹500-5000',
      timeRequired: '1 day',
      successRate: '80%',
      isDailyNeed: false,
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      id: 'sherwani',
      icon: '🤵',
      titleEn: 'Sherwani',
      titleHi: 'शेरवानी',
      descriptionEn: 'Need ethnic wear for wedding functions?',
      descriptionHi: 'शादी समारोहों के लिए पारंपरिक पोशाक चाहिए?',
      avgEarning: '₹500-3000',
      timeRequired: '1 day',
      successRate: '78%',
      isDailyNeed: false,
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 'dance-costume',
      icon: '💃',
      titleEn: 'Dance Costume',
      titleHi: 'नृत्य पोशाक',
      descriptionEn: 'Performance coming up? Need a costume?',
      descriptionHi: 'प्रदर्शन है? पोशाक चाहिए?',
      avgEarning: '₹200-1000',
      timeRequired: '1-2 days',
      successRate: '75%',
      isDailyNeed: false,
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 'bike-puncture',
      icon: '🏍️',
      titleEn: 'Bike Puncture',
      titleHi: 'बाइक पंचर',
      descriptionEn: 'Your bike got punctured on the road?',
      descriptionHi: 'आपकी बाइक सड़क पर पंचर हो गई?',
      avgEarning: '₹50-200',
      timeRequired: '30 min',
      successRate: '92%',
      isDailyNeed: false,
      gradient: 'from-orange-400 to-amber-500'
    },
    {
      id: 'fuel-empty',
      icon: '⛽',
      titleEn: 'Fuel Empty',
      titleHi: 'ईंधन खत्म',
      descriptionEn: 'Ran out of fuel? Need emergency delivery?',
      descriptionHi: 'पेट्रोल खत्म? आपातकालीन डिलीवरी चाहिए?',
      avgEarning: '₹100-300',
      timeRequired: '30 min',
      successRate: '90%',
      isDailyNeed: false,
      gradient: 'from-red-400 to-orange-500'
    },
    {
      id: 'car-breakdown',
      icon: '🚗',
      titleEn: 'Car Breakdown',
      titleHi: 'कार खराब',
      descriptionEn: 'Car stopped working? Need immediate help?',
      descriptionHi: 'कार बंद हो गई? तत्काल मदद चाहिए?',
      avgEarning: '₹200-500',
      timeRequired: '1 hr',
      successRate: '85%',
      isDailyNeed: false,
      gradient: 'from-gray-500 to-slate-600'
    },
    {
      id: 'bank-queue',
      icon: '🏦',
      titleEn: 'Bank Queue',
      titleHi: 'बैंक लाइन',
      descriptionEn: 'The bank queue is long. Can someone help?',
      descriptionHi: 'बैंक की लाइन लंबी है। कोई मदद कर सकता है?',
      avgEarning: '₹50-150',
      timeRequired: '1-2 hrs',
      successRate: '88%',
      isDailyNeed: false,
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'govt-office',
      icon: '🏛️',
      titleEn: 'Govt Office',
      titleHi: 'सरकारी कार्यालय',
      descriptionEn: 'Need to visit a government office?',
      descriptionHi: 'सरकारी कार्यालय जाना है?',
      avgEarning: '₹100-300',
      timeRequired: '2-4 hrs',
      successRate: '82%',
      isDailyNeed: false,
      gradient: 'from-slate-500 to-gray-600'
    },
    {
      id: 'form-filling',
      icon: '📝',
      titleEn: 'Form Filling',
      titleHi: 'फॉर्म भरना',
      descriptionEn: 'Need help filling official forms?',
      descriptionHi: 'आधिकारिक फॉर्म भरने में मदद चाहिए?',
      avgEarning: '₹50-200',
      timeRequired: '30-60 min',
      successRate: '90%',
      isDailyNeed: false,
      gradient: 'from-indigo-400 to-blue-500'
    },
    {
      id: 'phone-battery',
      icon: '🔋',
      titleEn: 'Phone Battery',
      titleHi: 'फोन बैटरी',
      descriptionEn: 'Phone died? Need a charger urgently?',
      descriptionHi: 'फोन बंद हो गया? तुरंत चार्जर चाहिए?',
      avgEarning: '₹20-50',
      timeRequired: '15 min',
      successRate: '95%',
      isDailyNeed: false,
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'no-internet',
      icon: '📶',
      titleEn: 'No Internet',
      titleHi: 'इंटरनेट नहीं',
      descriptionEn: 'Internet down? Need urgent WiFi hotspot?',
      descriptionHi: 'इंटरनेट बंद? तत्काल WiFi हॉटस्पॉट चाहिए?',
      avgEarning: '₹20-50',
      timeRequired: '15 min',
      successRate: '93%',
      isDailyNeed: false,
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'laptop-issue',
      icon: '💻',
      titleEn: 'Laptop Issue',
      titleHi: 'लैपटॉप समस्या',
      descriptionEn: 'Laptop not working? Need quick tech help?',
      descriptionHi: 'लैपटॉप काम नहीं कर रहा? त्वरित तकनीकी मदद चाहिए?',
      avgEarning: '₹100-300',
      timeRequired: '1-2 hrs',
      successRate: '80%',
      isDailyNeed: false,
      gradient: 'from-gray-400 to-slate-500'
    },
    {
      id: 'medicine-delivery',
      icon: '💊',
      titleEn: 'Medicine Delivery',
      titleHi: 'दवा डिलीवरी',
      descriptionEn: 'Need urgent medicine delivery?',
      descriptionHi: 'तत्काल दवा डिलीवरी चाहिए?',
      avgEarning: '₹30-100',
      timeRequired: '30 min',
      successRate: '94%',
      isDailyNeed: false,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'first-aid',
      icon: '🩹',
      titleEn: 'First Aid',
      titleHi: 'प्राथमिक चिकित्सा',
      descriptionEn: 'Minor injury? Need first aid help?',
      descriptionHi: 'मामूली चोट? प्राथमिक चिकित्सा मदद चाहिए?',
      avgEarning: '₹50-150',
      timeRequired: '15 min',
      successRate: '92%',
      isDailyNeed: false,
      gradient: 'from-red-400 to-pink-500'
    },
    {
      id: 'hospital-route',
      icon: '🚑',
      titleEn: 'Hospital Route',
      titleHi: 'अस्पताल मार्ग',
      descriptionEn: 'Need directions to the nearest hospital?',
      descriptionHi: 'निकटतम अस्पताल का मार्ग चाहिए?',
      avgEarning: '₹50-200',
      timeRequired: '15-30 min',
      successRate: '96%',
      isDailyNeed: false,
      gradient: 'from-red-500 to-rose-600'
    },
    {
      id: 'tools-needed',
      icon: '🔧',
      titleEn: 'Tools Needed',
      titleHi: 'उपकरण चाहिए',
      descriptionEn: 'Could someone have the tools you need?',
      descriptionHi: 'क्या किसी के पास आपको चाहिए टूल्स हो सकते हैं?',
      avgEarning: '₹30-100',
      timeRequired: '30 min',
      successRate: '85%',
      isDailyNeed: false,
      gradient: 'from-gray-500 to-zinc-600'
    },
    {
      id: 'ladder-needed',
      icon: '🪜',
      titleEn: 'Ladder Needed',
      titleHi: 'सीढ़ी चाहिए',
      descriptionEn: 'Need a ladder for a quick fix?',
      descriptionHi: 'जल्दी ठीक करने के लिए सीढ़ी चाहिए?',
      avgEarning: '₹30-80',
      timeRequired: '15-30 min',
      successRate: '88%',
      isDailyNeed: false,
      gradient: 'from-amber-400 to-yellow-500'
    },
    {
      id: 'electric-issue',
      icon: '⚡',
      titleEn: 'Electric Issue',
      titleHi: 'बिजली समस्या',
      descriptionEn: 'Sudden electrical problem at home?',
      descriptionHi: 'घर में अचानक बिजली की समस्या?',
      avgEarning: '₹100-400',
      timeRequired: '1-2 hrs',
      successRate: '82%',
      isDailyNeed: false,
      gradient: 'from-yellow-400 to-amber-500'
    },
    {
      id: 'parcel-pickup',
      icon: '📦',
      titleEn: 'Parcel Pickup',
      titleHi: 'पार्सल पिकअप',
      descriptionEn: 'Need someone to pick up your parcel?',
      descriptionHi: 'आपका पार्सल पिकअप करने के लिए कोई चाहिए?',
      avgEarning: '₹30-80',
      timeRequired: '30 min',
      successRate: '90%',
      isDailyNeed: false,
      gradient: 'from-orange-400 to-red-400'
    },
    {
      id: 'grocery-needed',
      icon: '🛒',
      titleEn: 'Grocery Needed',
      titleHi: 'किराना चाहिए',
      descriptionEn: 'Sudden need for groceries?',
      descriptionHi: 'अचानक किराने की ज़रूरत?',
      avgEarning: '₹30-100',
      timeRequired: '30-60 min',
      successRate: '92%',
      isDailyNeed: false,
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'document-delivery',
      icon: '📄',
      titleEn: 'Document Delivery',
      titleHi: 'दस्तावेज़ डिलीवरी',
      descriptionEn: 'Need urgent document delivery?',
      descriptionHi: 'तत्काल दस्तावेज़ डिलीवरी चाहिए?',
      avgEarning: '₹50-150',
      timeRequired: '1 hr',
      successRate: '91%',
      isDailyNeed: false,
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'tent-event',
      icon: '🎪',
      titleEn: 'Tent Event',
      titleHi: 'टेंट कार्यक्रम',
      descriptionEn: 'Planning an event? Need tent setup?',
      descriptionHi: 'कार्यक्रम की योजना? टेंट सेटअप चाहिए?',
      avgEarning: '₹500-2000',
      timeRequired: '4-8 hrs',
      successRate: '78%',
      isDailyNeed: false,
      gradient: 'from-purple-400 to-violet-500'
    },
    {
      id: 'chairs-needed',
      icon: '🪑',
      titleEn: 'Chairs Needed',
      titleHi: 'कुर्सियां चाहिए',
      descriptionEn: 'Need extra chairs for a gathering?',
      descriptionHi: 'समारोह के लिए अतिरिक्त कुर्सियां चाहिए?',
      avgEarning: '₹100-300',
      timeRequired: '2 hrs',
      successRate: '85%',
      isDailyNeed: false,
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 'sound-system',
      icon: '🔊',
      titleEn: 'Sound System',
      titleHi: 'साउंड सिस्टम',
      descriptionEn: 'Need sound system for an event?',
      descriptionHi: 'कार्यक्रम के लिए साउंड सिस्टम चाहिए?',
      avgEarning: '₹500-2000',
      timeRequired: '2-4 hrs',
      successRate: '75%',
      isDailyNeed: false,
      gradient: 'from-slate-500 to-gray-600'
    },
    {
      id: 'sports-gear',
      icon: '⚽',
      titleEn: 'Sports Gear',
      titleHi: 'खेल का सामान',
      descriptionEn: 'Need sports equipment for a game?',
      descriptionHi: 'खेल के लिए खेल का सामान चाहिए?',
      avgEarning: '₹50-200',
      timeRequired: '2-4 hrs',
      successRate: '82%',
      isDailyNeed: false,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'gym-equipment',
      icon: '🏋️',
      titleEn: 'Gym Equipment',
      titleHi: 'जिम उपकरण',
      descriptionEn: 'Need gym equipment temporarily?',
      descriptionHi: 'अस्थायी रूप से जिम उपकरण चाहिए?',
      avgEarning: '₹100-300',
      timeRequired: '1-7 days',
      successRate: '70%',
      isDailyNeed: false,
      gradient: 'from-red-400 to-orange-500'
    },
    {
      id: 'cycle-needed',
      icon: '🚲',
      titleEn: 'Cycle Needed',
      titleHi: 'साइकिल चाहिए',
      descriptionEn: 'Need a cycle for short commute?',
      descriptionHi: 'छोटी यात्रा के लिए साइकिल चाहिए?',
      avgEarning: '₹50-150',
      timeRequired: '1-4 hrs',
      successRate: '88%',
      isDailyNeed: false,
      gradient: 'from-teal-400 to-cyan-500'
    },
    {
      id: 'pet-care',
      icon: '🐾',
      titleEn: 'Pet Care',
      titleHi: 'पालतू देखभाल',
      descriptionEn: 'Need someone to watch your pet?',
      descriptionHi: 'आपके पालतू को देखने के लिए कोई चाहिए?',
      avgEarning: '₹100-300',
      timeRequired: '2-8 hrs',
      successRate: '90%',
      isDailyNeed: false,
      gradient: 'from-amber-400 to-yellow-500'
    },
    {
      id: 'plant-care',
      icon: '🌱',
      titleEn: 'Plant Care',
      titleHi: 'पौधे की देखभाल',
      descriptionEn: 'Going away? Need plant watering help?',
      descriptionHi: 'कहीं जा रहे हैं? पौधों को पानी देने में मदद चाहिए?',
      avgEarning: '₹50-150',
      timeRequired: '15 min',
      successRate: '92%',
      isDailyNeed: false,
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'photo-needed',
      icon: '📸',
      titleEn: 'Photo Needed',
      titleHi: 'फोटो चाहिए',
      descriptionEn: 'Need passport photo or quick photography?',
      descriptionHi: 'पासपोर्ट फोटो या त्वरित फोटोग्राफी चाहिए?',
      avgEarning: '₹50-200',
      timeRequired: '30 min',
      successRate: '85%',
      isDailyNeed: false,
      gradient: 'from-purple-400 to-pink-500'
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

        {/* All Help Categories - 45 Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-4"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Help Categories
            </h3>
            <Badge className="bg-orange-500 text-white text-xs font-bold">
              {allHelpCards.length} Categories
            </Badge>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            मदद की श्रेणियाँ • Tap to see income story
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            {allHelpCards.map((card, idx) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedHelpCard(card)
                  setShowIncomeStory(true)
                }}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'} relative`}
              >
                <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
                <div className="p-3 text-center">
                  <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-xl shadow-md mb-2`}>
                    {card.icon}
                  </div>
                  <p className={`text-xs font-semibold line-clamp-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {card.titleEn}
                  </p>
                  {card.isDailyNeed && (
                    <Badge className="bg-orange-500 text-white text-[10px] mt-1 px-1.5 py-0.5 font-bold">
                      Daily
                    </Badge>
                  )}
                </div>
              </motion.button>
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

      {/* Income Story Modal */}
      <IncomeStoryModal
        isOpen={showIncomeStory}
        onClose={() => setShowIncomeStory(false)}
        category={selectedHelpCard!}
      />

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
