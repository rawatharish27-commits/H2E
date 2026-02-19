// Comprehensive Resources Data for Help2Earn
// 15 Categories with 150+ Resources - Visual Representation with Images

export interface Resource {
  id: string
  name: string
  nameHindi: string
  description: string
  icon: string
  category: 'EMERGENCY' | 'TIME_ACCESS' | 'RESOURCE_RENT' | 'SKILL' | 'SPACE'
  avgEarning: string
  imageEmoji: string
  imageColor: string
  tags: string[]
}

export interface ResourceCategory {
  id: string
  name: string
  nameHindi: string
  description: string
  icon: string
  imageEmoji: string
  gradient: string
  resources: Resource[]
}

// Complete Resource Categories - 15 Categories with 150+ Resources
export const allResourceCategories: ResourceCategory[] = [
  // 1. Personal Help / Human Assistance
  {
    id: 'personal-help',
    name: '🧑‍🤝‍🧑 Personal Help',
    nameHindi: 'व्यक्तिगत मदद',
    description: 'Time, effort aur presence = income',
    icon: '🧑‍🤝‍🧑',
    imageEmoji: '🤝',
    gradient: 'from-blue-500 to-cyan-500',
    resources: [
      { id: 'ph1', name: 'Queue Standing', nameHindi: 'बुज़ुर्ग को लाइन में खड़ा होना', description: 'Stand in bank, hospital, ration queues for elderly', icon: '🧍', category: 'TIME_ACCESS', avgEarning: '₹50-200', imageEmoji: '🏦', imageColor: 'bg-blue-100', tags: ['elderly', 'queue', 'bank'] },
      { id: 'ph2', name: 'Medicine/Ration Delivery', nameHindi: 'दवा/राशन लाकर देना', description: 'Fetch medicines or groceries for elderly/sick', icon: '📦', category: 'TIME_ACCESS', avgEarning: '₹30-100', imageEmoji: '💊', imageColor: 'bg-green-100', tags: ['delivery', 'elderly', 'medicine'] },
      { id: 'ph3', name: 'Hospital Transport', nameHindi: 'hospital ले जाना', description: 'Take sick persons to hospital', icon: '🏥', category: 'EMERGENCY', avgEarning: '₹100-300', imageEmoji: '🚑', imageColor: 'bg-red-100', tags: ['medical', 'transport', 'emergency'] },
      { id: 'ph4', name: 'Government Form Help', nameHindi: 'सरकारी office में form भरना', description: 'Help with government forms and applications', icon: '📝', category: 'SKILL', avgEarning: '₹50-200', imageEmoji: '📋', imageColor: 'bg-amber-100', tags: ['government', 'forms', 'documentation'] },
      { id: 'ph5', name: 'School Pickup/Drop', nameHindi: 'बच्चा school छोड़ना/लाना', description: 'Pick up or drop children from school', icon: '🏫', category: 'TIME_ACCESS', avgEarning: '₹100-300/month', imageEmoji: '🧒', imageColor: 'bg-yellow-100', tags: ['children', 'school', 'transport'] },
      { id: 'ph6', name: 'Pet Walking', nameHindi: 'Pet walk कराना', description: 'Walk pets when owners are busy', icon: '🐕', category: 'TIME_ACCESS', avgEarning: '₹50-150/walk', imageEmoji: '🐾', imageColor: 'bg-orange-100', tags: ['pet', 'walking', 'daily'] },
      { id: 'ph7', name: 'Digital Literacy Training', nameHindi: 'Mobile app/UPPI use सिखाना', description: 'Teach mobile apps, UPI to elderly', icon: '📱', category: 'SKILL', avgEarning: '₹100-300', imageEmoji: '📲', imageColor: 'bg-purple-100', tags: ['digital', 'training', 'elderly'] },
      { id: 'ph8', name: 'Interview/Exam Escort', nameHindi: 'Interview center तक accompany', description: 'Accompany to interviews or exam centers', icon: '🎯', category: 'TIME_ACCESS', avgEarning: '₹100-300', imageEmoji: '🎓', imageColor: 'bg-indigo-100', tags: ['escort', 'interview', 'exam'] },
      { id: 'ph9', name: 'Safety Escort', nameHindi: 'Late night घर छोड़ना', description: 'Safety escort for late night travel', icon: '🛡️', category: 'EMERGENCY', avgEarning: '₹100-300', imageEmoji: '🚶', imageColor: 'bg-slate-100', tags: ['safety', 'night', 'escort'] },
    ]
  },

  // 2. Vehicle & Roadside Help
  {
    id: 'vehicle-help',
    name: '🚗 Vehicle & Roadside',
    nameHindi: 'गाड़ी और सड़क मदद',
    description: 'Emergency + locality advantage',
    icon: '🚗',
    imageEmoji: '🚙',
    gradient: 'from-red-500 to-orange-500',
    resources: [
      { id: 'vh1', name: 'Puncture Repair', nameHindi: 'गाड़ी puncture repair', description: 'Fix bike/car punctures on the spot', icon: '🔧', category: 'EMERGENCY', avgEarning: '₹50-200', imageEmoji: '🏍️', imageColor: 'bg-red-100', tags: ['emergency', 'vehicle', 'repair'] },
      { id: 'vh2', name: 'Jump Start', nameHindi: 'Battery jump start', description: 'Jump start dead vehicle batteries', icon: '🔋', category: 'EMERGENCY', avgEarning: '₹100-300', imageEmoji: '⚡', imageColor: 'bg-yellow-100', tags: ['emergency', 'battery', 'vehicle'] },
      { id: 'vh3', name: 'Fuel Delivery', nameHindi: 'Fuel emergency delivery', description: 'Deliver petrol/diesel in emergencies', icon: '⛽', category: 'EMERGENCY', avgEarning: '₹100-300', imageEmoji: '🛢️', imageColor: 'bg-amber-100', tags: ['fuel', 'emergency', 'delivery'] },
      { id: 'vh4', name: 'Push Help', nameHindi: 'Scooty/bike push help', description: 'Help push broken down vehicles', icon: '🚲', category: 'EMERGENCY', avgEarning: '₹50-150', imageEmoji: '🛵', imageColor: 'bg-blue-100', tags: ['push', 'vehicle', 'help'] },
      { id: 'vh5', name: 'Accident Help', nameHindi: 'Accident ke baad help', description: 'Immediate assistance after accidents', icon: '🚨', category: 'EMERGENCY', avgEarning: '₹200-500', imageEmoji: '🚑', imageColor: 'bg-red-100', tags: ['accident', 'emergency', 'help'] },
      { id: 'vh6', name: 'Traffic Assist', nameHindi: 'Traffic jam me help', description: 'Help stuck vehicles in traffic', icon: '🚦', category: 'EMERGENCY', avgEarning: '₹50-100', imageEmoji: '🛣️', imageColor: 'bg-green-100', tags: ['traffic', 'help', 'vehicle'] },
      { id: 'vh7', name: 'Co-Driver/Navigator', nameHindi: 'Long drive me navigator', description: 'Navigate during long drives', icon: '🗺️', category: 'TIME_ACCESS', avgEarning: '₹200-500', imageEmoji: '🧭', imageColor: 'bg-teal-100', tags: ['navigation', 'travel', 'drive'] },
      { id: 'vh8', name: 'Parking Finder', nameHindi: 'Parking find karne me help', description: 'Help find parking spots', icon: '🅿️', category: 'TIME_ACCESS', avgEarning: '₹20-50', imageEmoji: '📍', imageColor: 'bg-blue-100', tags: ['parking', 'help', 'find'] },
    ]
  },

  // 3. Home Services
  {
    id: 'home-services',
    name: '🏠 Home Services',
    nameHindi: 'घर की सेवाएं',
    description: 'रोज़ की ज़रूरतें = daily income',
    icon: '🏠',
    imageEmoji: '🏡',
    gradient: 'from-green-500 to-teal-500',
    resources: [
      { id: 'hs1', name: 'Plumber', nameHindi: 'Plumber (tap, pipe)', description: 'Fix taps, pipes, bathroom issues', icon: '🔧', category: 'SKILL', avgEarning: '₹200-800', imageEmoji: '🚿', imageColor: 'bg-blue-100', tags: ['plumber', 'repair', 'home'] },
      { id: 'hs2', name: 'Electrician', nameHindi: 'Electrician (fan, switch)', description: 'Fix fans, switches, wiring', icon: '⚡', category: 'SKILL', avgEarning: '₹200-800', imageEmoji: '💡', imageColor: 'bg-yellow-100', tags: ['electrician', 'repair', 'home'] },
      { id: 'hs3', name: 'Washing Machine Repair', nameHindi: 'Washing machine repair', description: 'Fix washing machine issues', icon: '🧺', category: 'SKILL', avgEarning: '₹200-1000', imageEmoji: '👕', imageColor: 'bg-purple-100', tags: ['appliance', 'repair', 'home'] },
      { id: 'hs4', name: 'Fridge/AC Repair', nameHindi: 'Fridge/AC repair', description: 'Repair refrigerators and ACs', icon: '❄️', category: 'SKILL', avgEarning: '₹300-1500', imageEmoji: '🌬️', imageColor: 'bg-cyan-100', tags: ['appliance', 'repair', 'cooling'] },
      { id: 'hs5', name: 'RO/Water Purifier', nameHindi: 'RO service', description: 'Service and repair water purifiers', icon: '💧', category: 'SKILL', avgEarning: '₹200-500', imageEmoji: '🚰', imageColor: 'bg-blue-100', tags: ['water', 'purifier', 'service'] },
      { id: 'hs6', name: 'Gas Cylinder Change', nameHindi: 'Gas cylinder change', description: 'Help change gas cylinders', icon: '🔥', category: 'TIME_ACCESS', avgEarning: '₹50-100', imageEmoji: '🍳', imageColor: 'bg-orange-100', tags: ['gas', 'cylinder', 'home'] },
      { id: 'hs7', name: 'Furniture Assembly', nameHindi: 'Furniture assembly', description: 'Assemble new furniture', icon: '🪑', category: 'SKILL', avgEarning: '₹200-800', imageEmoji: '🛋️', imageColor: 'bg-amber-100', tags: ['furniture', 'assembly', 'home'] },
      { id: 'hs8', name: 'Minor Carpentry', nameHindi: 'Minor carpentry', description: 'Small carpentry repairs', icon: '🛠️', category: 'SKILL', avgEarning: '₹200-1000', imageEmoji: '🪚', imageColor: 'bg-yellow-100', tags: ['carpentry', 'repair', 'wood'] },
      { id: 'hs9', name: 'House Shifting Helper', nameHindi: 'House shifting help', description: 'Help with house shifting', icon: '📦', category: 'TIME_ACCESS', avgEarning: '₹300-1000', imageEmoji: '🚚', imageColor: 'bg-brown-100', tags: ['shifting', 'moving', 'help'] },
    ]
  },

  // 4. Clothing, Fashion & Lifestyle (RENT = GOLD)
  {
    id: 'fashion-rent',
    name: '👗 Fashion & Lifestyle Rent',
    nameHindi: 'कपड़े और फैशन किराया',
    description: 'One-time purchase → lifetime income',
    icon: '👗',
    imageEmoji: '👗',
    gradient: 'from-pink-500 to-rose-500',
    resources: [
      { id: 'fr1', name: 'Wedding Saree Rent', nameHindi: 'शादी की साड़ी rent', description: 'Rent wedding sarees', icon: '🥻', category: 'RESOURCE_RENT', avgEarning: '₹500-5000', imageEmoji: '👰', imageColor: 'bg-red-100', tags: ['saree', 'wedding', 'rent'] },
      { id: 'fr2', name: 'Lehenga/Sherwani Rent', nameHindi: 'Lehenga/Sherwani rent', description: 'Rent ethnic wedding wear', icon: '👘', category: 'RESOURCE_RENT', avgEarning: '₹1000-10000', imageEmoji: '🎊', imageColor: 'bg-pink-100', tags: ['lehenga', 'sherwani', 'wedding'] },
      { id: 'fr3', name: 'Party Dress Rent', nameHindi: 'Party dresses rent', description: 'Rent party wear dresses', icon: '👗', category: 'RESOURCE_RENT', avgEarning: '₹200-2000', imageEmoji: '🎉', imageColor: 'bg-purple-100', tags: ['party', 'dress', 'rent'] },
      { id: 'fr4', name: 'Blazer/Coat Rent', nameHindi: 'Blazer rent (interviews)', description: 'Rent formal wear for interviews', icon: '🧥', category: 'RESOURCE_RENT', avgEarning: '₹100-500', imageEmoji: '👔', imageColor: 'bg-slate-100', tags: ['blazer', 'interview', 'formal'] },
      { id: 'fr5', name: 'Jewellery Rent', nameHindi: 'Jewelry rent (wedding)', description: 'Rent wedding/function jewellery', icon: '💍', category: 'RESOURCE_RENT', avgEarning: '₹500-5000', imageEmoji: '💎', imageColor: 'bg-amber-100', tags: ['jewellery', 'wedding', 'rent'] },
      { id: 'fr6', name: 'Footwear Rent', nameHindi: 'Footwear rent', description: 'Rent ethnic/formal footwear', icon: '👠', category: 'RESOURCE_RENT', avgEarning: '₹100-500', imageEmoji: '👟', imageColor: 'bg-orange-100', tags: ['footwear', 'rent', 'ethnic'] },
      { id: 'fr7', name: 'Bags/Clutches Rent', nameHindi: 'Bags/clutches rent', description: 'Rent designer bags and clutches', icon: '👜', category: 'RESOURCE_RENT', avgEarning: '₹100-1000', imageEmoji: '👛', imageColor: 'bg-pink-100', tags: ['bags', 'clutches', 'rent'] },
      { id: 'fr8', name: 'Makeup Kit Rent', nameHindi: 'Makeup kit rent', description: 'Rent professional makeup kits', icon: '💄', category: 'RESOURCE_RENT', avgEarning: '₹200-1000', imageEmoji: '💋', imageColor: 'bg-rose-100', tags: ['makeup', 'beauty', 'rent'] },
      { id: 'fr9', name: 'Photo Accessories Rent', nameHindi: 'Camera-ready accessories', description: 'Rent photo shoot accessories', icon: '📸', category: 'RESOURCE_RENT', avgEarning: '₹200-1000', imageEmoji: '📷', imageColor: 'bg-gray-100', tags: ['photo', 'accessories', 'rent'] },
    ]
  },

  // 5. Tools & Equipment Sharing
  {
    id: 'tools-sharing',
    name: '🛠️ Tools & Equipment',
    nameHindi: 'औजार और उपकरण',
    description: 'Sabke paas tool nahi hota',
    icon: '🛠️',
    imageEmoji: '🔧',
    gradient: 'from-gray-500 to-slate-600',
    resources: [
      { id: 'ts1', name: 'Drill Machine', nameHindi: 'Drill machine rent', description: 'Rent power drill machine', icon: '🔋', category: 'RESOURCE_RENT', avgEarning: '₹100-300/day', imageEmoji: '⚙️', imageColor: 'bg-gray-100', tags: ['drill', 'tool', 'rent'] },
      { id: 'ts2', name: 'Ladder', nameHindi: 'Ladder rent', description: 'Rent aluminium/wooden ladder', icon: '🪜', category: 'RESOURCE_RENT', avgEarning: '₹50-150/day', imageEmoji: '🏗️', imageColor: 'bg-yellow-100', tags: ['ladder', 'tool', 'rent'] },
      { id: 'ts3', name: 'Gas Stove Extra', nameHindi: 'Gas stove rent', description: 'Rent extra gas stove for events', icon: '🔥', category: 'RESOURCE_RENT', avgEarning: '₹50-200/day', imageEmoji: '🍳', imageColor: 'bg-orange-100', tags: ['stove', 'cooking', 'rent'] },
      { id: 'ts4', name: 'Pressure Washer', nameHindi: 'Pressure washer rent', description: 'Rent pressure washer for cleaning', icon: '💦', category: 'RESOURCE_RENT', avgEarning: '₹200-500/day', imageEmoji: '🧽', imageColor: 'bg-blue-100', tags: ['washer', 'cleaning', 'rent'] },
      { id: 'ts5', name: 'Car Vacuum', nameHindi: 'Car vacuum cleaner', description: 'Rent car vacuum cleaner', icon: '🧹', category: 'RESOURCE_RENT', avgEarning: '₹50-150/day', imageEmoji: '🚗', imageColor: 'bg-purple-100', tags: ['vacuum', 'car', 'cleaning'] },
      { id: 'ts6', name: 'Sewing Machine', nameHindi: 'Sewing machine rent', description: 'Rent sewing machine', icon: '🧵', category: 'RESOURCE_RENT', avgEarning: '₹50-200/day', imageEmoji: '✂️', imageColor: 'bg-pink-100', tags: ['sewing', 'stitching', 'rent'] },
      { id: 'ts7', name: 'Power Extension', nameHindi: 'Power extension board', description: 'Rent power extension boards', icon: '🔌', category: 'RESOURCE_RENT', avgEarning: '₹30-100/day', imageEmoji: '⚡', imageColor: 'bg-yellow-100', tags: ['power', 'extension', 'electric'] },
      { id: 'ts8', name: 'Welding Machine', nameHindi: 'Welding machine rent', description: 'Rent welding machine', icon: '🔥', category: 'RESOURCE_RENT', avgEarning: '₹200-500/day', imageEmoji: '🛠️', imageColor: 'bg-red-100', tags: ['welding', 'tool', 'rent'] },
      { id: 'ts9', name: 'Generator/Inverter', nameHindi: 'Generator rent', description: 'Rent generator for power backup', icon: '⚡', category: 'RESOURCE_RENT', avgEarning: '₹500-2000/day', imageEmoji: '🔋', imageColor: 'bg-green-100', tags: ['generator', 'power', 'backup'] },
    ]
  },

  // 6. Food & Kitchen Help
  {
    id: 'food-kitchen',
    name: '🍳 Food & Kitchen',
    nameHindi: 'खाना और रसोई',
    description: 'Emotional + survival need',
    icon: '🍳',
    imageEmoji: '🍽️',
    gradient: 'from-orange-500 to-amber-500',
    resources: [
      { id: 'fk1', name: 'Home Tiffin', nameHindi: 'Ghar ka khana tiffin', description: 'Home-cooked tiffin service', icon: '🍱', category: 'SKILL', avgEarning: '₹50-150/tiffin', imageEmoji: '🥘', imageColor: 'bg-orange-100', tags: ['tiffin', 'home-food', 'daily'] },
      { id: 'fk2', name: 'Emergency Food', nameHindi: 'Emergency food delivery', description: 'Emergency food delivery', icon: '🥡', category: 'EMERGENCY', avgEarning: '₹50-100', imageEmoji: '🍜', imageColor: 'bg-red-100', tags: ['emergency', 'food', 'delivery'] },
      { id: 'fk3', name: 'Function Cooking', nameHindi: 'Function cooking help', description: 'Cooking help for functions', icon: '👨‍🍳', category: 'SKILL', avgEarning: '₹500-2000', imageEmoji: '🎉', imageColor: 'bg-yellow-100', tags: ['cooking', 'function', 'event'] },
      { id: 'fk4', name: 'Elderly Cooking', nameHindi: 'Old-age cooking support', description: 'Cooking support for elderly', icon: '👵', category: 'TIME_ACCESS', avgEarning: '₹100-300/day', imageEmoji: '🥗', imageColor: 'bg-green-100', tags: ['elderly', 'cooking', 'support'] },
      { id: 'fk5', name: 'Diet/Special Food', nameHindi: 'Diet/special food', description: 'Special diet food (diabetic, etc)', icon: '🥗', category: 'SKILL', avgEarning: '₹100-300', imageEmoji: '🥬', imageColor: 'bg-green-100', tags: ['diet', 'health', 'special'] },
      { id: 'fk6', name: 'Festival Sweets', nameHindi: 'Festival sweets making', description: 'Make festival sweets', icon: '🍬', category: 'SKILL', avgEarning: '₹200-1000', imageEmoji: '🎊', imageColor: 'bg-pink-100', tags: ['sweets', 'festival', 'cooking'] },
      { id: 'fk7', name: 'Roti/Sabzi Maker', nameHindi: 'Roti/sabzi maker hourly', description: 'Hourly roti/sabzi making', icon: '🫓', category: 'TIME_ACCESS', avgEarning: '₹100-300/hr', imageEmoji: '🍛', imageColor: 'bg-amber-100', tags: ['roti', 'cooking', 'hourly'] },
    ]
  },

  // 7. Child, Family & Care
  {
    id: 'child-care',
    name: '👶 Child & Family Care',
    nameHindi: 'बच्चे और परिवार देखभाल',
    description: 'Trust-based, high value',
    icon: '👶',
    imageEmoji: '👨‍👩‍👧',
    gradient: 'from-pink-500 to-purple-500',
    resources: [
      { id: 'cc1', name: 'Babysitting', nameHindi: 'Babysitting hourly', description: 'Hourly babysitting service', icon: '👶', category: 'TIME_ACCESS', avgEarning: '₹100-300/hr', imageEmoji: '🧸', imageColor: 'bg-pink-100', tags: ['baby', 'care', 'hourly'] },
      { id: 'cc2', name: 'Homework Help', nameHindi: 'School homework help', description: 'Help with school homework', icon: '📚', category: 'SKILL', avgEarning: '₹50-200/hr', imageEmoji: '✏️', imageColor: 'bg-blue-100', tags: ['homework', 'study', 'children'] },
      { id: 'cc3', name: 'Tuition', nameHindi: 'Tuition micro sessions', description: 'Micro tuition sessions', icon: '📖', category: 'SKILL', avgEarning: '₹100-500/hr', imageEmoji: '🎓', imageColor: 'bg-indigo-100', tags: ['tuition', 'teaching', 'study'] },
      { id: 'cc4', name: 'Exam Prep Help', nameHindi: 'Exam preparation help', description: 'Help with exam preparation', icon: '📝', category: 'SKILL', avgEarning: '₹100-500/hr', imageEmoji: '📋', imageColor: 'bg-purple-100', tags: ['exam', 'preparation', 'study'] },
      { id: 'cc5', name: 'Kids Pickup/Drop', nameHindi: 'Kids pickup-drop', description: 'Pick up and drop kids', icon: '🚗', category: 'TIME_ACCESS', avgEarning: '₹50-200', imageEmoji: '🧒', imageColor: 'bg-green-100', tags: ['kids', 'transport', 'school'] },
      { id: 'cc6', name: 'Elderly Companion', nameHindi: 'Elderly companionship', description: 'Companionship for elderly', icon: '👴', category: 'TIME_ACCESS', avgEarning: '₹100-300/day', imageEmoji: '👵', imageColor: 'bg-amber-100', tags: ['elderly', 'companion', 'care'] },
      { id: 'cc7', name: 'Night Patient Care', nameHindi: 'Night care for patient', description: 'Night care for patients', icon: '🏥', category: 'TIME_ACCESS', avgEarning: '₹300-800/night', imageEmoji: '🛏️', imageColor: 'bg-blue-100', tags: ['patient', 'night', 'care'] },
      { id: 'cc8', name: 'Disability Assistance', nameHindi: 'Disability assistance', description: 'Help for disabled persons', icon: '♿', category: 'TIME_ACCESS', avgEarning: '₹100-500', imageEmoji: '🤝', imageColor: 'bg-purple-100', tags: ['disability', 'assistance', 'care'] },
    ]
  },

  // 8. Digital & Knowledge-Based Help
  {
    id: 'digital-help',
    name: '🧑‍💻 Digital Help',
    nameHindi: 'डिजिटल मदद',
    description: 'Skill + mobile = income',
    icon: '🧑‍💻',
    imageEmoji: '💻',
    gradient: 'from-indigo-500 to-blue-500',
    resources: [
      { id: 'dh1', name: 'Mobile Setup', nameHindi: 'Mobile setup (new phone)', description: 'Setup new mobile phones', icon: '📱', category: 'SKILL', avgEarning: '₹50-200', imageEmoji: '📲', imageColor: 'bg-blue-100', tags: ['mobile', 'setup', 'phone'] },
      { id: 'dh2', name: 'UPI/App Training', nameHindi: 'WhatsApp/Paytm/GPay help', description: 'Teach UPI and apps usage', icon: '💳', category: 'SKILL', avgEarning: '₹50-150', imageEmoji: '💸', imageColor: 'bg-green-100', tags: ['upi', 'training', 'apps'] },
      { id: 'dh3', name: 'Online Form Filling', nameHindi: 'Online form filling', description: 'Fill online forms', icon: '📝', category: 'SKILL', avgEarning: '₹50-200', imageEmoji: '📋', imageColor: 'bg-purple-100', tags: ['forms', 'online', 'filling'] },
      { id: 'dh4', name: 'Resume Making', nameHindi: 'Resume making', description: 'Create professional resumes', icon: '📄', category: 'SKILL', avgEarning: '₹100-300', imageEmoji: '📑', imageColor: 'bg-gray-100', tags: ['resume', 'job', 'document'] },
      { id: 'dh5', name: 'Aadhaar/PAN Help', nameHindi: 'Aadhaar/PAN help', description: 'Help with Aadhaar/PAN applications', icon: '🪪', category: 'SKILL', avgEarning: '₹50-200', imageEmoji: '🎫', imageColor: 'bg-orange-100', tags: ['aadhaar', 'pan', 'document'] },
      { id: 'dh6', name: 'Online Booking', nameHindi: 'Online booking help', description: 'Book trains, buses, hospital appointments', icon: '🎫', category: 'SKILL', avgEarning: '₹30-100', imageEmoji: '🚂', imageColor: 'bg-blue-100', tags: ['booking', 'online', 'ticket'] },
      { id: 'dh7', name: 'App Training', nameHindi: 'Teaching apps usage', description: 'Teach how to use apps', icon: '📲', category: 'SKILL', avgEarning: '₹50-150', imageEmoji: '🎓', imageColor: 'bg-green-100', tags: ['training', 'apps', 'teaching'] },
      { id: 'dh8', name: 'Computer Training', nameHindi: 'Basic computer training', description: 'Basic computer training', icon: '💻', category: 'SKILL', avgEarning: '₹100-300/hr', imageEmoji: '🖥️', imageColor: 'bg-indigo-100', tags: ['computer', 'training', 'basic'] },
      { id: 'dh9', name: 'Photo/Video Editing', nameHindi: 'Photo/video editing help', description: 'Help with photo and video editing', icon: '🎬', category: 'SKILL', avgEarning: '₹100-500', imageEmoji: '📸', imageColor: 'bg-pink-100', tags: ['editing', 'photo', 'video'] },
    ]
  },

  // 9. Travel & Movement Help
  {
    id: 'travel-help',
    name: '🧳 Travel & Movement',
    nameHindi: 'यात्रा और आवाजाही',
    description: "One person's route = another's solution",
    icon: '🧳',
    imageEmoji: '✈️',
    gradient: 'from-cyan-500 to-teal-500',
    resources: [
      { id: 'th1', name: 'Lift Sharing', nameHindi: 'Lift sharing short distance', description: 'Share lift for short distances', icon: '🚗', category: 'TIME_ACCESS', avgEarning: '₹30-100', imageEmoji: '🚙', imageColor: 'bg-blue-100', tags: ['lift', 'sharing', 'transport'] },
      { id: 'th2', name: 'Airport/Station Drop', nameHindi: 'Airport/station drop', description: 'Drop to airport or station', icon: '✈️', category: 'TIME_ACCESS', avgEarning: '₹200-1000', imageEmoji: '🚕', imageColor: 'bg-purple-100', tags: ['airport', 'station', 'drop'] },
      { id: 'th3', name: 'Luggage Help', nameHindi: 'सामान ले जाने me help', description: 'Help carry luggage', icon: '🧳', category: 'TIME_ACCESS', avgEarning: '₹50-200', imageEmoji: '📦', imageColor: 'bg-amber-100', tags: ['luggage', 'carry', 'help'] },
      { id: 'th4', name: 'Local Tourist Guide', nameHindi: 'Tourist guide local', description: 'Guide tourists locally', icon: '🗺️', category: 'SKILL', avgEarning: '₹300-1000', imageEmoji: '🏛️', imageColor: 'bg-green-100', tags: ['tourist', 'guide', 'local'] },
      { id: 'th5', name: 'Language Translation', nameHindi: 'Local language translation', description: 'Translate local language', icon: '🗣️', category: 'SKILL', avgEarning: '₹100-500', imageEmoji: '💬', imageColor: 'bg-blue-100', tags: ['translation', 'language', 'local'] },
      { id: 'th6', name: 'Hotel Check-in Help', nameHindi: 'Hotel check-in assistance', description: 'Help with hotel check-in', icon: '🏨', category: 'TIME_ACCESS', avgEarning: '₹50-150', imageEmoji: '🛎️', imageColor: 'bg-purple-100', tags: ['hotel', 'checkin', 'assistance'] },
      { id: 'th7', name: 'Courier Pickup/Drop', nameHindi: 'सामान courier pickup-drop', description: 'Pickup and drop couriers', icon: '📦', category: 'TIME_ACCESS', avgEarning: '₹30-100', imageEmoji: '📬', imageColor: 'bg-orange-100', tags: ['courier', 'pickup', 'delivery'] },
    ]
  },

  // 10. Medical & Emergency Support
  {
    id: 'medical-emergency',
    name: '🏥 Medical & Emergency',
    nameHindi: 'चिकित्सा और आपातकाल',
    description: 'Life-saving + high trust',
    icon: '🏥',
    imageEmoji: '⚕️',
    gradient: 'from-red-500 to-pink-500',
    resources: [
      { id: 'me1', name: 'Hospital Accompany', nameHindi: 'Hospital accompany', description: 'Accompany to hospital', icon: '🏥', category: 'EMERGENCY', avgEarning: '₹100-500', imageEmoji: '🚑', imageColor: 'bg-red-100', tags: ['hospital', 'accompany', 'medical'] },
      { id: 'me2', name: 'Blood Donation Help', nameHindi: 'Blood donation', description: 'Blood donation coordination', icon: '🩸', category: 'EMERGENCY', avgEarning: '₹0-200', imageEmoji: '❤️', imageColor: 'bg-red-100', tags: ['blood', 'donation', 'emergency'] },
      { id: 'me3', name: 'Medicine Delivery', nameHindi: 'Emergency medicine delivery', description: 'Emergency medicine delivery', icon: '💊', category: 'EMERGENCY', avgEarning: '₹50-150', imageEmoji: '💉', imageColor: 'bg-green-100', tags: ['medicine', 'delivery', 'emergency'] },
      { id: 'me4', name: 'Wheelchair Push', nameHindi: 'Wheelchair push', description: 'Push wheelchair for patients', icon: '♿', category: 'TIME_ACCESS', avgEarning: '₹50-150', imageEmoji: '🦽', imageColor: 'bg-blue-100', tags: ['wheelchair', 'patient', 'help'] },
      { id: 'me5', name: 'Doctor Appointment', nameHindi: 'Doctor appointment booking', description: 'Book doctor appointments', icon: '📅', category: 'SKILL', avgEarning: '₹30-100', imageEmoji: '👨‍⚕️', imageColor: 'bg-purple-100', tags: ['doctor', 'appointment', 'booking'] },
      { id: 'me6', name: 'Home Nurse Helper', nameHindi: 'Home nurse helper', description: 'Help home nurses', icon: '👩‍⚕️', category: 'TIME_ACCESS', avgEarning: '₹200-500/day', imageEmoji: '💉', imageColor: 'bg-pink-100', tags: ['nurse', 'home', 'care'] },
      { id: 'me7', name: 'Ambulance Support', nameHindi: 'Ambulance calling support', description: 'Help call and coordinate ambulance', icon: '🚑', category: 'EMERGENCY', avgEarning: '₹50-200', imageEmoji: '🆘', imageColor: 'bg-red-100', tags: ['ambulance', 'emergency', 'support'] },
    ]
  },

  // 11. Event, Marriage & Crowd Work
  {
    id: 'event-work',
    name: '🏢 Event & Marriage Work',
    nameHindi: 'कार्यक्रम और शादी काम',
    description: 'Temporary work, instant cash',
    icon: '🏢',
    imageEmoji: '🎊',
    gradient: 'from-yellow-500 to-orange-500',
    resources: [
      { id: 'ew1', name: 'Wedding Helper', nameHindi: 'Shaadi me helpers', description: 'Help in weddings (4-5 people)', icon: '💒', category: 'TIME_ACCESS', avgEarning: '₹500-2000', imageEmoji: '💍', imageColor: 'bg-pink-100', tags: ['wedding', 'helper', 'event'] },
      { id: 'ew2', name: 'Decoration Setup', nameHindi: 'Decoration setup', description: 'Setup event decorations', icon: '🎈', category: 'SKILL', avgEarning: '₹300-1500', imageEmoji: '🎊', imageColor: 'bg-purple-100', tags: ['decoration', 'setup', 'event'] },
      { id: 'ew3', name: 'Catering Support', nameHindi: 'Catering support', description: 'Help with catering service', icon: '🍽️', category: 'TIME_ACCESS', avgEarning: '₹300-1000', imageEmoji: '🥘', imageColor: 'bg-orange-100', tags: ['catering', 'food', 'event'] },
      { id: 'ew4', name: 'Guest Management', nameHindi: 'Guest management', description: 'Manage event guests', icon: '🤝', category: 'TIME_ACCESS', avgEarning: '₹300-1000', imageEmoji: '👥', imageColor: 'bg-blue-100', tags: ['guest', 'management', 'event'] },
      { id: 'ew5', name: 'Queue Management', nameHindi: 'Queue management', description: 'Manage queues at events', icon: '🧍', category: 'TIME_ACCESS', avgEarning: '₹200-500', imageEmoji: '📋', imageColor: 'bg-green-100', tags: ['queue', 'management', 'event'] },
      { id: 'ew6', name: 'Security Volunteer', nameHindi: 'Security volunteer', description: 'Volunteer for event security', icon: '🛡️', category: 'TIME_ACCESS', avgEarning: '₹300-800', imageEmoji: '👮', imageColor: 'bg-slate-100', tags: ['security', 'volunteer', 'event'] },
      { id: 'ew7', name: 'Stage Handling', nameHindi: 'Stage handling', description: 'Handle event stage', icon: '🎭', category: 'SKILL', avgEarning: '₹500-1500', imageEmoji: '🎪', imageColor: 'bg-purple-100', tags: ['stage', 'handling', 'event'] },
      { id: 'ew8', name: 'Cleanup Crew', nameHindi: 'Cleanup crew', description: 'Post-event cleanup', icon: '🧹', category: 'TIME_ACCESS', avgEarning: '₹200-500', imageEmoji: '🧽', imageColor: 'bg-green-100', tags: ['cleanup', 'event', 'work'] },
    ]
  },

  // 12. Space & Property Sharing
  {
    id: 'space-sharing',
    name: '🏬 Space & Property',
    nameHindi: 'जगह और संपत्ति',
    description: 'Idle space = earning asset',
    icon: '🏬',
    imageEmoji: '🏠',
    gradient: 'from-emerald-500 to-green-500',
    resources: [
      { id: 'ss1', name: 'Extra Room Rent', nameHindi: 'Extra room rent hourly/day', description: 'Rent extra room hourly/daily', icon: '🛏️', category: 'SPACE', avgEarning: '₹300-2000/day', imageEmoji: '🏠', imageColor: 'bg-blue-100', tags: ['room', 'rent', 'space'] },
      { id: 'ss2', name: 'Parking Space', nameHindi: 'Parking space rent', description: 'Rent parking space', icon: '🅿️', category: 'SPACE', avgEarning: '₹50-200/day', imageEmoji: '🚗', imageColor: 'bg-gray-100', tags: ['parking', 'space', 'rent'] },
      { id: 'ss3', name: 'Store Room', nameHindi: 'Store room rent', description: 'Rent store room for storage', icon: '📦', category: 'SPACE', avgEarning: '₹100-500/month', imageEmoji: '🏪', imageColor: 'bg-amber-100', tags: ['storage', 'room', 'rent'] },
      { id: 'ss4', name: 'Rooftop Rent', nameHindi: 'Rooftop rent (party)', description: 'Rent rooftop for parties/photoshoots', icon: '🌆', category: 'SPACE', avgEarning: '₹500-5000', imageEmoji: '📸', imageColor: 'bg-purple-100', tags: ['rooftop', 'party', 'photoshoot'] },
      { id: 'ss5', name: 'Shop Front Temp', nameHindi: 'Shop front temporary use', description: 'Temporary shop front usage', icon: '🏪', category: 'SPACE', avgEarning: '₹100-500/day', imageEmoji: '🏬', imageColor: 'bg-green-100', tags: ['shop', 'temporary', 'space'] },
      { id: 'ss6', name: 'Warehouse Storage', nameHindi: 'Warehouse short-term', description: 'Short-term warehouse storage', icon: '🏭', category: 'SPACE', avgEarning: '₹500-2000/month', imageEmoji: '📦', imageColor: 'bg-slate-100', tags: ['warehouse', 'storage', 'short-term'] },
    ]
  },

  // 13. Pet & Animal Help
  {
    id: 'pet-help',
    name: '🐕 Pet & Animal Help',
    nameHindi: 'पालतू जानवर मदद',
    description: 'Emotional need + niche market',
    icon: '🐕',
    imageEmoji: '🐾',
    gradient: 'from-amber-500 to-yellow-500',
    resources: [
      { id: 'pa1', name: 'Dog Walking', nameHindi: 'Dog walking', description: 'Walk dogs regularly', icon: '🐕', category: 'TIME_ACCESS', avgEarning: '₹50-200/walk', imageEmoji: '🦮', imageColor: 'bg-orange-100', tags: ['dog', 'walking', 'pet'] },
      { id: 'pa2', name: 'Pet Boarding', nameHindi: 'Pet boarding', description: 'Board pets when owners away', icon: '🏠', category: 'TIME_ACCESS', avgEarning: '₹200-500/day', imageEmoji: '🐾', imageColor: 'bg-green-100', tags: ['boarding', 'pet', 'care'] },
      { id: 'pa3', name: 'Pet Grooming', nameHindi: 'Pet grooming', description: 'Groom pets', icon: '✂️', category: 'SKILL', avgEarning: '₹200-800', imageEmoji: '🐩', imageColor: 'bg-pink-100', tags: ['grooming', 'pet', 'care'] },
      { id: 'pa4', name: 'Vet Visit Help', nameHindi: 'Vet visit help', description: 'Help with vet visits', icon: '🩺', category: 'TIME_ACCESS', avgEarning: '₹100-300', imageEmoji: '🏥', imageColor: 'bg-blue-100', tags: ['vet', 'visit', 'pet'] },
      { id: 'pa5', name: 'Lost Pet Search', nameHindi: 'Lost pet search', description: 'Help find lost pets', icon: '🔍', category: 'EMERGENCY', avgEarning: '₹200-1000', imageEmoji: '😿', imageColor: 'bg-purple-100', tags: ['lost', 'pet', 'search'] },
      { id: 'pa6', name: 'Stray Feeding', nameHindi: 'Feeding stray animals', description: 'Feed stray animals (NGO paid)', icon: '🥣', category: 'TIME_ACCESS', avgEarning: '₹50-200', imageEmoji: '🐱', imageColor: 'bg-amber-100', tags: ['stray', 'feeding', 'ngo'] },
    ]
  },

  // 14. Ideas, Advice & Decision Help
  {
    id: 'ideas-advice',
    name: '🧠 Ideas & Advice',
    nameHindi: 'विचार और सलाह',
    description: 'Brain = asset',
    icon: '🧠',
    imageEmoji: '💡',
    gradient: 'from-violet-500 to-purple-500',
    resources: [
      { id: 'ia1', name: 'Business Ideas', nameHindi: 'Business idea suggestion', description: 'Suggest business ideas', icon: '💡', category: 'SKILL', avgEarning: '₹100-500', imageEmoji: '📈', imageColor: 'bg-blue-100', tags: ['business', 'ideas', 'consulting'] },
      { id: 'ia2', name: 'Career Guidance', nameHindi: 'Career guidance', description: 'Provide career guidance', icon: '🎯', category: 'SKILL', avgEarning: '₹100-500', imageEmoji: '🎓', imageColor: 'bg-green-100', tags: ['career', 'guidance', 'consulting'] },
      { id: 'ia3', name: 'Exam Strategy', nameHindi: 'Exam strategy help', description: 'Help with exam strategies', icon: '📝', category: 'SKILL', avgEarning: '₹100-300', imageEmoji: '📋', imageColor: 'bg-purple-100', tags: ['exam', 'strategy', 'study'] },
      { id: 'ia4', name: 'Relationship Advice', nameHindi: 'Relationship counselling', description: 'Basic relationship counselling', icon: '❤️', category: 'SKILL', avgEarning: '₹100-500', imageEmoji: '💑', imageColor: 'bg-pink-100', tags: ['relationship', 'advice', 'counselling'] },
      { id: 'ia5', name: 'Elder Wisdom', nameHindi: 'Elder advice', description: 'Experience-based advice', icon: '👴', category: 'SKILL', avgEarning: '₹50-200', imageEmoji: '📚', imageColor: 'bg-amber-100', tags: ['elder', 'wisdom', 'advice'] },
      { id: 'ia6', name: 'Legal Document Help', nameHindi: 'Legal document understanding', description: 'Help understand legal documents', icon: '📄', category: 'SKILL', avgEarning: '₹100-500', imageEmoji: '⚖️', imageColor: 'bg-slate-100', tags: ['legal', 'document', 'help'] },
    ]
  },

  // 15. Safety, Rescue & Critical Help
  {
    id: 'safety-rescue',
    name: '🛡️ Safety & Rescue',
    nameHindi: 'सुरक्षा और बचाव',
    description: 'Highest impact, premium trust',
    icon: '🛡️',
    imageEmoji: '🚨',
    gradient: 'from-red-600 to-rose-600',
    resources: [
      { id: 'sr1', name: 'Women Safety Escort', nameHindi: 'Women safety escort', description: 'Safety escort for women', icon: '🚺', category: 'EMERGENCY', avgEarning: '₹100-300', imageEmoji: '🛡️', imageColor: 'bg-pink-100', tags: ['women', 'safety', 'escort'] },
      { id: 'sr2', name: 'Night Emergency', nameHindi: 'Night emergency help', description: 'Emergency help at night', icon: '🌙', category: 'EMERGENCY', avgEarning: '₹200-500', imageEmoji: '🚨', imageColor: 'bg-slate-100', tags: ['night', 'emergency', 'help'] },
      { id: 'sr3', name: 'Lost Child Help', nameHindi: 'Lost child assistance', description: 'Help find lost children', icon: '👧', category: 'EMERGENCY', avgEarning: '₹100-500', imageEmoji: '🔍', imageColor: 'bg-blue-100', tags: ['lost', 'child', 'help'] },
      { id: 'sr4', name: 'Disaster Support', nameHindi: 'Natural disaster support', description: 'Support during natural disasters', icon: '🌊', category: 'EMERGENCY', avgEarning: '₹200-1000', imageEmoji: '🆘', imageColor: 'bg-red-100', tags: ['disaster', 'emergency', 'support'] },
      { id: 'sr5', name: 'Flood/Fire Evacuation', nameHindi: 'Flood/fire evacuation', description: 'Help in flood/fire evacuation', icon: '🔥', category: 'EMERGENCY', avgEarning: '₹500-2000', imageEmoji: '🧯', imageColor: 'bg-orange-100', tags: ['evacuation', 'emergency', 'rescue'] },
      { id: 'sr6', name: 'First Responder', nameHindi: 'First responder help', description: 'First responder assistance', icon: '🚑', category: 'EMERGENCY', avgEarning: '₹100-500', imageEmoji: '⚕️', imageColor: 'bg-red-100', tags: ['responder', 'emergency', 'medical'] },
      { id: 'sr7', name: 'Missing Person Search', nameHindi: 'Missing person search', description: 'Help search missing persons', icon: '🔍', category: 'EMERGENCY', avgEarning: '₹500-2000', imageEmoji: '👤', imageColor: 'bg-purple-100', tags: ['missing', 'search', 'help'] },
    ]
  },
]

// Get all resources as flat list
export function getAllResources(): Resource[] {
  const all: Resource[] = []
  allResourceCategories.forEach(cat => {
    cat.resources.forEach(res => all.push(res))
  })
  return all
}

// Get category by ID
export function getCategoryById(id: string): ResourceCategory | undefined {
  return allResourceCategories.find(cat => cat.id === id)
}

// Search resources
export function searchResources(query: string): Resource[] {
  const lowerQuery = query.toLowerCase()
  const all = getAllResources()
  return all.filter(res => 
    res.name.toLowerCase().includes(lowerQuery) ||
    res.nameHindi.includes(query) ||
    res.description.toLowerCase().includes(lowerQuery) ||
    res.tags.some(tag => tag.includes(lowerQuery))
  )
}

// Get resources by category type
export function getResourcesByCategory(category: 'EMERGENCY' | 'TIME_ACCESS' | 'RESOURCE_RENT' | 'SKILL' | 'SPACE'): Resource[] {
  return getAllResources().filter(res => res.category === category)
}
