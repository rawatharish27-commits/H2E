// Core Types for Help2Earn Marketplace - Production Grade

// User Types
export interface User {
  id: string
  phone: string
  name: string | null
  avatar: string | null
  email: string | null
  
  // Subscription
  paymentActive: boolean
  activeTill: Date | null
  subscriptionType: 'BASIC' | 'PREMIUM' | 'LIFETIME'
  
  // Trust & Safety
  trustScore: number
  noShowCount: number
  reportCount: number
  helpfulCount: number
  ratingSum: number
  ratingCount: number
  
  // Location
  lat: number | null
  lng: number | null
  areaCode: string | null
  
  // Status
  isBlocked: boolean
  isBanned: boolean
  isShadowBanned: boolean
  isFlagged: boolean
  noShowStrikes: number
  
  // Privacy
  locationEnabled: boolean
  showProfile: boolean
  
  // Referral
  referralCode: string | null
  referredBy: string | null
  referralCount: number
  referralRewards: number
  
  // Leader System
  isLeader: boolean
  leaderLevel: 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'AMBASSADOR'
  referredByLeaderId: string | null
  
  // KYC
  kycVerified: boolean
  
  // Badges
  badges: string[]
  
  // Preferences
  darkMode: boolean
  language: 'hi' | 'en'
  notifications: boolean
  
  // WhatsApp Notification Preferences
  whatsappEnabled: boolean
  whatsappNumber: string | null
  quietHoursStart: string | null  // e.g., "22:00"
  quietHoursEnd: string | null    // e.g., "07:00"
  notificationTypes: string[]     // e.g., ["EMERGENCY", "TIME_ACCESS"]
  
  createdAt: Date
}

// Problem Types
export type ProblemType = 'EMERGENCY' | 'TIME_ACCESS' | 'RESOURCE_RENT'
export type ProblemStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Problem {
  id: string
  postedById: string
  type: ProblemType
  category: string | null
  riskLevel: RiskLevel
  title: string
  description: string
  offerPrice: number | null
  image: string | null  // Problem photo URL
  lat: number
  lng: number
  address: string | null
  minTrustRequired: number
  status: ProblemStatus
  acceptedById: string | null
  acceptedAt: Date | null
  createdAt: Date
  expiresAt: Date | null
  closedAt: Date | null
  postedBy: User
  distance?: number
}

// Payment Types
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED'
export type PaymentMethod = 'UPI' | 'RAZORPAY' | 'MANUAL'

export interface Payment {
  id: string
  userId: string
  amount: number
  status: PaymentStatus
  paymentMethod: PaymentMethod | null
  upiId: string | null
  transactionRef: string | null
  razorpayId: string | null
  approvedBy: string | null
  approvedAt: Date | null
  month: string
  daysGranted: number
  createdAt: Date
  user: User
}

// Feedback Types
export interface Feedback {
  id: string
  problemId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment: string | null
  helperArrived: boolean
  duration: number | null
  createdAt: Date
}

// Referral Types
export type ReferralStatus = 'PENDING' | 'VERIFIED' | 'REWARDED'

export interface Referral {
  id: string
  referrerId: string
  referredUserId: string
  code: string
  status: ReferralStatus
  verifiedAt: Date | null
  rewardedAt: Date | null
  rewardDays: number
  createdAt: Date
}

// Badge Types
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'TRUST' | 'HELP' | 'REFERRAL' | 'SPECIAL'
  requirement: Record<string, unknown>
  reward: Record<string, unknown> | null
}

export interface UserAchievement {
  id: string
  userId: string
  badgeId: string
  badge: Badge
  earnedAt: Date
  notified: boolean
}

// Notification Types
export type NotificationType = 'REFERRAL' | 'PAYMENT' | 'HELP' | 'SYSTEM'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: Date
}

// Chat Message Types
export interface ChatMessage {
  id: string
  problemId: string
  senderId: string
  sender: {
    id: string
    name: string | null
    avatar: string | null
  }
  message: string
  isRead: boolean
  createdAt: Date
}

export interface ChatRoom {
  problemId: string
  problem: {
    id: string
    title: string
    status: ProblemStatus
    postedBy: {
      id: string
      name: string | null
      avatar: string | null
    }
  }
}

// Trust Badge Types
export type TrustBadge = 'TRUSTED' | 'NEUTRAL' | 'RESTRICTED'

export interface TrustInfo {
  badge: TrustBadge
  score: number
  color: string
  label: string
}

// Location Types
export interface Location {
  lat: number
  lng: number
  address?: string
}

// App State Types
export type AppScreen = 
  | 'splash'
  | 'welcome'
  | 'pre-login-share'
  | 'login'
  | 'otp'
  | 'dashboard'
  | 'home'
  | 'subscription'
  | 'post-problem'
  | 'nearby'
  | 'map'
  | 'profile'
  | 'referral'
  | 'problem-detail'
  | 'chat'
  | 'admin'
  | 'privacy-settings'
  | 'notification-settings'
  | 'terms'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'legal'
  | 'username'
  | 'leader-dashboard'

// WhatsApp Notification Types
export type WhatsAppNotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ'

export interface WhatsAppNotification {
  id: string
  userId: string
  problemId: string
  status: WhatsAppNotificationStatus
  sentAt: Date | null
  deliveredAt: Date | null
  errorMessage: string | null
  createdAt: Date
}

// Problem Categories - 50+ Categories + Misc
export const EMERGENCY_CATEGORIES = [
  // Vehicle Related
  { id: 'puncture', label: 'Puncture Help', icon: '🔧', labelHi: 'पंक्चर मदद' },
  { id: 'jumpstart', label: 'Jump Start', icon: '⚡', labelHi: 'जंप स्टार्ट' },
  { id: 'tow', label: 'Tow Help', icon: '🚗', labelHi: 'टो मदद' },
  { id: 'fuel', label: 'Fuel Emergency', icon: '⛽', labelHi: 'ईंधन आपातकाल' },
  { id: 'carbreakdown', label: 'Car Breakdown', icon: '🚙', labelHi: 'गाड़ी खराब' },
  { id: 'locksmith', label: 'Lock Help', icon: '🔑', labelHi: 'ताला मदद' },
  { id: 'keys_lost', label: 'Keys Lost', icon: '🗝️', labelHi: 'चाबी खो गई' },
  
  // Phone/Tech Related
  { id: 'charging', label: 'Phone Charging', icon: '🔋', labelHi: 'फोन चार्जिंग' },
  { id: 'internet', label: 'Internet Hotspot', icon: '📶', labelHi: 'इंटरनेट हॉटस्पॉट' },
  { id: 'wifi', label: 'WiFi Access', icon: '📡', labelHi: 'वाईफाई एक्सेस' },
  { id: 'laptop', label: 'Laptop Help', icon: '💻', labelHi: 'लैपटॉप मदद' },
  { id: 'powerbank', label: 'Power Bank', icon: '🔋', labelHi: 'पावर बैंक' },
  
  // Medical/Health
  { id: 'firstaid', label: 'First Aid Help', icon: '🩹', labelHi: 'प्राथमिक चिकित्सा' },
  { id: 'medicine', label: 'Medicine Delivery', icon: '💊', labelHi: 'दवाई डिलीवरी' },
  { id: 'blood', label: 'Blood Donor', icon: '🩸', labelHi: 'रक्तदाता' },
  { id: 'ambulance_guide', label: 'Hospital Route', icon: '🏥', labelHi: 'अस्पताल रास्ता' },
  
  // Home Emergency
  { id: 'plumbing', label: 'Plumbing Leak', icon: '🚿', labelHi: 'पाइप लीक' },
  { id: 'electrical', label: 'Electrical Issue', icon: '💡', labelHi: 'बिजली समस्या' },
  { id: 'gas', label: 'Gas Leak', icon: '🔥', labelHi: 'गैस लीक' },
  { id: 'water', label: 'Water Shortage', icon: '💧', labelHi: 'पानी की कमी' },
  
  // Misc Emergency
  { id: 'pet_emergency', label: 'Pet Emergency', icon: '🐕', labelHi: 'पालतू आपातकाल' },
  { id: 'stranded', label: 'Stranded Help', icon: '🆘', labelHi: 'फंसे हुए' },
  { id: 'other_emergency', label: 'Other Emergency', icon: '⚠️', labelHi: 'अन्य आपातकाल' },
] as const

export const TIME_ACCESS_CATEGORIES = [
  // Queue/Waiting
  { id: 'queue', label: 'Queue Standing', icon: '🧍', labelHi: 'लाइन में खड़े' },
  { id: 'bank_queue', label: 'Bank Queue', icon: '🏦', labelHi: 'बैंक लाइन' },
  { id: 'govt_office', label: 'Govt Office', icon: '🏛️', labelHi: 'सरकारी कार्यालय' },
  { id: 'ticket', label: 'Ticket Booking', icon: '🎫', labelHi: 'टिकट बुकिंग' },
  
  // Errands
  { id: 'errand', label: 'Errand Running', icon: '🏃', labelHi: 'दौड़-धूप' },
  { id: 'pickup', label: 'Pick & Drop', icon: '🛵', labelHi: 'पिक एंड ड्रॉप' },
  { id: 'delivery', label: 'Local Delivery', icon: '📦', labelHi: 'स्थानीय डिलीवरी' },
  { id: 'grocery', label: 'Grocery Pickup', icon: '🛒', labelHi: 'किराना पिकअप' },
  { id: 'document', label: 'Document Delivery', icon: '📄', labelHi: 'दस्तावेज़ डिलीवरी' },
  
  // Guidance
  { id: 'guidance', label: 'Local Guidance', icon: '🧭', labelHi: 'स्थानीय मार्गदर्शन' },
  { id: 'city_tour', label: 'City Tour', icon: '🗺️', labelHi: 'शहर दौरा' },
  { id: 'translator', label: 'Translator Help', icon: '🗣️', labelHi: 'अनुवादक' },
  
  // Watch/Security
  { id: 'watch', label: 'Shop/House Watch', icon: '👀', labelHi: 'दुकान/घर निगरानी' },
  { id: 'pet_sit', label: 'Pet Sitting', icon: '🐕', labelHi: 'पालतू देखभाल' },
  { id: 'plant_care', label: 'Plant Care', icon: '🌱', labelHi: 'पौधे देखभाल' },
  
  // Assistance
  { id: 'form_filling', label: 'Form Filling', icon: '📝', labelHi: 'फॉर्म भरने' },
  { id: 'photocopy', label: 'Photocopy/Print', icon: '📠', labelHi: 'फोटोकॉपी/प्रिंट' },
  { id: 'photo_click', label: 'Photo/Video', icon: '📸', labelHi: 'फोटो/वीडियो' },
  { id: 'other_time', label: 'Other Task', icon: '⏰', labelHi: 'अन्य कार्य' },
] as const

export const RESOURCE_CATEGORIES = [
  // Vehicles
  { id: 'bike', label: 'Bike/Scooty', icon: '🏍️', labelHi: 'बाइक/स्कूटी' },
  { id: 'cycle', label: 'Bicycle', icon: '🚲', labelHi: 'साइकिल' },
  { id: 'car', label: 'Car', icon: '🚗', labelHi: 'कार' },
  { id: 'auto', label: 'Auto Rickshaw', icon: '🛺', labelHi: 'ऑटो रिक्शा' },
  
  // Clothing/Accessories
  { id: 'saree', label: 'Saree/Lehenga', icon: '👗', labelHi: 'साड़ी/लहंगा' },
  { id: 'suit', label: 'Suit/Sherwani', icon: '🤵', labelHi: 'सूट/शेरवानी' },
  { id: 'jewelry', label: 'Jewelry', icon: '💎', labelHi: 'गहने' },
  { id: 'costume', label: 'Costume/Dress', icon: '🎭', labelHi: 'पोशाक' },
  { id: 'bags', label: 'Bags/Luggage', icon: '👜', labelHi: 'बैग/सामान' },
  
  // Tools/Equipment
  { id: 'tools', label: 'Tools Kit', icon: '🛠️', labelHi: 'टूल्स किट' },
  { id: 'ladder', label: 'Ladder', icon: '🪜', labelHi: 'सीढ़ी' },
  { id: 'drill', label: 'Drill Machine', icon: '🔧', labelHi: 'ड्रिल मशीन' },
  { id: 'gardening', label: 'Gardening Tools', icon: '🌻', labelHi: 'बगीचे के उपकरण' },
  { id: 'cleaning', label: 'Cleaning Equipment', icon: '🧹', labelHi: 'सफाई उपकरण' },
  
  // Electronics
  { id: 'electronics', label: 'Electronics', icon: '📱', labelHi: 'इलेक्ट्रॉनिक्स' },
  { id: 'laptop_rent', label: 'Laptop', icon: '💻', labelHi: 'लैपटॉप' },
  { id: 'camera', label: 'Camera/Gadgets', icon: '📷', labelHi: 'कैमरा/गैजेट्स' },
  { id: 'speaker', label: 'Speaker/Sound', icon: '🔊', labelHi: 'स्पीकर/साउंड' },
  { id: 'projector', label: 'Projector', icon: '📽️', labelHi: 'प्रोजेक्टर' },
  { id: 'gaming', label: 'Gaming Console', icon: '🎮', labelHi: 'गेमिंग कंसोल' },
  
  // Event/Party
  { id: 'tent', label: 'Tent/Canopy', icon: '⛺', labelHi: 'टेंट/कैनोपी' },
  { id: 'chairs', label: 'Chairs/Tables', icon: '🪑', labelHi: 'कुर्सियाँ/मेज़' },
  { id: 'decoration', label: 'Decoration Items', icon: '🎀', labelHi: 'सजावट का सामान' },
  { id: 'sound', label: 'Sound System', icon: '🎙️', labelHi: 'साउंड सिस्टम' },
  
  // Sports/Fitness
  { id: 'sports', label: 'Sports Equipment', icon: '⚽', labelHi: 'खेल का सामान' },
  { id: 'fitness', label: 'Fitness Equipment', icon: '🏋️', labelHi: 'फिटनेस उपकरण' },
  { id: 'bicycle', label: 'Exercise Cycle', icon: '🚴', labelHi: 'व्यायाम साइकिल' },
  
  // Misc
  { id: 'books', label: 'Books/Notes', icon: '📚', labelHi: 'किताबें/नोट्स' },
  { id: 'instruments', label: 'Musical Instruments', icon: '🎸', labelHi: 'संगीत वाद्य' },
  { id: 'camping', label: 'Camping Gear', icon: '🏕️', labelHi: 'कैंपिंग गियर' },
  { id: 'other', label: 'Other Items', icon: '📦', labelHi: 'अन्य वस्तुएं' },
] as const

// Risk Levels
export const PROBLEM_RISK: Record<ProblemType, RiskLevel> = {
  EMERGENCY: 'LOW',
  TIME_ACCESS: 'MEDIUM',
  RESOURCE_RENT: 'HIGH',
}

export const MIN_TRUST_REQUIRED: Record<RiskLevel, number> = {
  LOW: 40,
  MEDIUM: 50,
  HIGH: 70,
}

// Trust Score Functions
export function getTrustBadge(score: number): TrustInfo {
  if (score >= 70) {
    return { badge: 'TRUSTED', score, color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950', label: 'Trusted' }
  } else if (score >= 40) {
    return { badge: 'NEUTRAL', score, color: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950', label: 'Neutral' }
  } else {
    return { badge: 'RESTRICTED', score, color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950', label: 'Restricted' }
  }
}

// Distance calculation (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Format distance
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

// Format price
export function formatPrice(price: number | null): string {
  if (!price) return 'Negotiable'
  return `₹${price.toLocaleString('en-IN')}`
}

// Format date
export function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-IN')
}

// Referral Reward Tiers
export const REFERRAL_TIERS = [
  { count: 5, reward: '+7 days free', badge: 'Active Sharer', icon: '🌟' },
  { count: 10, reward: '+30 days subscription', badge: 'Super Sharer', icon: '⭐' },
  { count: 25, reward: 'Priority access', badge: 'Area Connector', icon: '🏅' },
  { count: 50, reward: '3 months free', badge: 'Community Builder', icon: '🏆' },
  { count: 100, reward: 'Lifetime discount', badge: 'Community Leader', icon: '👑' },
] as const
