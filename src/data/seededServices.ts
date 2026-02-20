// Seeded Services - 20 Sample Services to Make App Feel Populated
// These are REAL services that could exist, NOT fake/scam services
// Price ranges are realistic for Indian market

export interface SeededService {
  id: string
  title: string
  titleHi: string
  description: string
  descriptionHi: string
  category: 'EMERGENCY' | 'TIME_ACCESS' | 'RESOURCE_RENT'
  icon: string
  priceMin: number
  priceMax: number
  priceNote: string
  priceNoteHi: string
  providerName: string
  providerNameHi: string
  providerAvatar: string // Will use generated avatar
  providerRating: number
  providerHelps: number
  distance: number // km
  postedAt: Date
  area: string
  isReal: boolean // Always true - these are legitimate services
}

// Generate realistic profile photo URLs using DiceBear API
const getAvatarUrl = (seed: string) => 
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`

// 20 Seeded Services - Real looking services with realistic prices
export const SEEDED_SERVICES: SeededService[] = [
  // EMERGENCY (5)
  {
    id: 'seed-1',
    title: 'Bike Puncture Repair',
    titleHi: 'बाइक पंचर रिपेयर',
    description: 'Quick puncture repair at your location. Tubeless or tube both available.',
    descriptionHi: 'आपके स्थान पर त्वरित पंचर रिपेयर। ट्यूबलेस या ट्यूब दोनों उपलब्ध।',
    category: 'EMERGENCY',
    icon: '🏍️',
    priceMin: 50,
    priceMax: 150,
    priceNote: 'Price depends on puncture type',
    priceNoteHi: 'कीमत पंचर के प्रकार पर निर्भर',
    providerName: 'Raju Kumar',
    providerNameHi: 'राजू कुमार',
    providerAvatar: getAvatarUrl('raju-kumar'),
    providerRating: 4.8,
    providerHelps: 45,
    distance: 1.2,
    postedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-2',
    title: 'Emergency Fuel Delivery',
    titleHi: 'इमरजेंसी फ्यूल डिलीवरी',
    description: 'Petrol/diesel delivered to your location. 1-5 liters available.',
    descriptionHi: 'आपके स्थान पर पेट्रोल/डीजल। 1-5 लीटर उपलब्ध।',
    category: 'EMERGENCY',
    icon: '⛽',
    priceMin: 100,
    priceMax: 500,
    priceNote: 'Fuel cost + ₹50 delivery',
    priceNoteHi: 'फ्यूल कीमत + ₹50 डिलीवरी',
    providerName: 'Vikram Singh',
    providerNameHi: 'विक्रम सिंह',
    providerAvatar: getAvatarUrl('vikram-singh'),
    providerRating: 4.6,
    providerHelps: 32,
    distance: 2.5,
    postedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-3',
    title: 'Medicine Delivery Urgent',
    titleHi: 'दवाई तुरंत डिलीवरी',
    description: 'Quick medicine pickup from any pharmacy. Prescription required for some medicines.',
    descriptionHi: 'किसी भी फार्मेसी से जल्दी दवाई। कुछ दवाइयों के लिए प्रिस्क्रिप्शन जरूरी।',
    category: 'EMERGENCY',
    icon: '💊',
    priceMin: 30,
    priceMax: 100,
    priceNote: 'Delivery charge only',
    priceNoteHi: 'सिर्फ डिलीवरी चार्ज',
    providerName: 'Priya Sharma',
    providerNameHi: 'प्रिया शर्मा',
    providerAvatar: getAvatarUrl('priya-sharma'),
    providerRating: 4.9,
    providerHelps: 67,
    distance: 0.8,
    postedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-4',
    title: 'Car Battery Jump Start',
    titleHi: 'कार बैटरी जंप स्टार्ट',
    description: 'Jump start your car battery. Also available for checking battery health.',
    descriptionHi: 'कार बैटरी जंप स्टार्ट। बैटरी हेल्थ चेक भी उपलब्ध।',
    category: 'EMERGENCY',
    icon: '🔋',
    priceMin: 100,
    priceMax: 200,
    priceNote: 'Service charge',
    priceNoteHi: 'सर्विस चार्ज',
    providerName: 'Amit Verma',
    providerNameHi: 'अमित वर्मा',
    providerAvatar: getAvatarUrl('amit-verma'),
    providerRating: 4.7,
    providerHelps: 28,
    distance: 3.1,
    postedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-5',
    title: 'Locksmith Service',
    titleHi: 'ताला खोलने की सेवा',
    description: 'House/office/car lock opening. Key duplicate also available.',
    descriptionHi: 'घर/ऑफिस/कार का ताला खोलना। चाबी डुप्लिकेट भी उपलब्ध।',
    category: 'EMERGENCY',
    icon: '🔑',
    priceMin: 150,
    priceMax: 400,
    priceNote: 'Depends on lock type',
    priceNoteHi: 'ताले के प्रकार पर निर्भर',
    providerName: 'Sunil Kumar',
    providerNameHi: 'सुनील कुमार',
    providerAvatar: getAvatarUrl('sunil-kumar'),
    providerRating: 4.5,
    providerHelps: 52,
    distance: 1.8,
    postedAt: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
    area: 'Dehradun',
    isReal: true
  },

  // TIME_ACCESS (7)
  {
    id: 'seed-6',
    title: 'Bank Queue Standing',
    titleHi: 'बैंक में लाइन में खड़े होंगे',
    description: 'Will stand in bank/office queue for you. Update every 15 mins.',
    descriptionHi: 'आपके लिए बैंक/ऑफिस की लाइन में खड़े रहेंगे। हर 15 मिनट में अपडेट।',
    category: 'TIME_ACCESS',
    icon: '🏦',
    priceMin: 100,
    priceMax: 200,
    priceNote: 'Per hour rate',
    priceNoteHi: 'प्रति घंटा दर',
    providerName: 'Deepak Joshi',
    providerNameHi: 'दीपक जोशी',
    providerAvatar: getAvatarUrl('deepak-joshi'),
    providerRating: 4.4,
    providerHelps: 23,
    distance: 1.5,
    postedAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-7',
    title: 'Form Filling Help',
    titleHi: 'फॉर्म भरने में मदद',
    description: 'Online/offline form filling. Aadhaar, PAN, passport, bank forms all accepted.',
    descriptionHi: 'ऑनलाइन/ऑफलाइन फॉर्म भरना। आधार, पैन, पासपोर्ट, बैंक सभी स्वीकार।',
    category: 'TIME_ACCESS',
    icon: '📝',
    priceMin: 50,
    priceMax: 150,
    priceNote: 'Per form',
    priceNoteHi: 'प्रति फॉर्म',
    providerName: 'Neha Gupta',
    providerNameHi: 'नेहा गुप्ता',
    providerAvatar: getAvatarUrl('neha-gupta'),
    providerRating: 4.8,
    providerHelps: 89,
    distance: 0.5,
    postedAt: new Date(Date.now() - 1000 * 60 * 40), // 40 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-8',
    title: 'Grocery Pickup & Drop',
    titleHi: 'किराना पिकअप और ड्रॉप',
    description: 'Pickup groceries from any store and deliver to your home. List required.',
    descriptionHi: 'किसी भी दुकान से किराना पिकअप और घर पर डिलीवर। सूची जरूरी।',
    category: 'TIME_ACCESS',
    icon: '🛒',
    priceMin: 40,
    priceMax: 80,
    priceNote: 'Within 3km radius',
    priceNoteHi: '3 किमी त्रिज्या में',
    providerName: 'Rohit Rawat',
    providerNameHi: 'रोहित रावत',
    providerAvatar: getAvatarUrl('rohit-rawat'),
    providerRating: 4.6,
    providerHelps: 56,
    distance: 1.0,
    postedAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-9',
    title: 'Document Delivery',
    titleHi: 'डॉक्यूमेंट डिलीवरी',
    description: 'Quick document pickup and delivery. Safe handling guaranteed.',
    descriptionHi: 'त्वरित दस्तावेज़ पिकअप और डिलीवरी। सुरक्षित हैंडलिंग की गारंटी।',
    category: 'TIME_ACCESS',
    icon: '📄',
    priceMin: 30,
    priceMax: 100,
    priceNote: 'Based on distance',
    priceNoteHi: 'दूरी के अनुसार',
    providerName: 'Anjali Mehra',
    providerNameHi: 'अंजलि मेहरा',
    providerAvatar: getAvatarUrl('anjali-mehra'),
    providerRating: 4.7,
    providerHelps: 41,
    distance: 2.2,
    postedAt: new Date(Date.now() - 1000 * 60 * 55), // 55 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-10',
    title: 'Elderly Companion',
    titleHi: 'बुज़ुर्गों के साथी',
    description: 'Companionship for elderly - doctor visits, market, or just company.',
    descriptionHi: 'बुज़ुर्गों के लिए साथी - डॉक्टर विज़िट, बाज़ार, या बस साथ।',
    category: 'TIME_ACCESS',
    icon: '👴',
    priceMin: 150,
    priceMax: 300,
    priceNote: 'Per 2 hours',
    priceNoteHi: 'प्रति 2 घंटे',
    providerName: 'Sunita Devi',
    providerNameHi: 'सुनीता देवी',
    providerAvatar: getAvatarUrl('sunita-devi'),
    providerRating: 4.9,
    providerHelps: 34,
    distance: 0.9,
    postedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-11',
    title: 'Pet Care & Walking',
    titleHi: 'पालतू देखभाल और सैर',
    description: 'Dog walking, pet sitting, feeding. All pet types welcome.',
    descriptionHi: 'कुत्ते की सैर, पालतू बैठना, खिलाना। सभी पालतू स्वीकार।',
    category: 'TIME_ACCESS',
    icon: '🐕',
    priceMin: 50,
    priceMax: 150,
    priceNote: 'Per walk/visit',
    priceNoteHi: 'प्रति सैर/विज़िट',
    providerName: 'Karan Singh',
    providerNameHi: 'करण सिंह',
    providerAvatar: getAvatarUrl('karan-singh'),
    providerRating: 4.8,
    providerHelps: 29,
    distance: 1.4,
    postedAt: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-12',
    title: 'Home Tutor Available',
    titleHi: 'होम ट्यूटर उपलब्ध',
    description: 'Maths, Science, English tutoring for class 1-10. Home visits available.',
    descriptionHi: 'कक्षा 1-10 के लिए गणित, विज्ञान, अंग्रेजी ट्यूशन। होम विज़िट उपलब्ध।',
    category: 'TIME_ACCESS',
    icon: '📚',
    priceMin: 200,
    priceMax: 500,
    priceNote: 'Per hour',
    priceNoteHi: 'प्रति घंटा',
    providerName: 'Meera Thapa',
    providerNameHi: 'मीरा थापा',
    providerAvatar: getAvatarUrl('meera-thapa'),
    providerRating: 4.9,
    providerHelps: 78,
    distance: 0.7,
    postedAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    area: 'Dehradun',
    isReal: true
  },

  // RESOURCE_RENT (8)
  {
    id: 'seed-13',
    title: 'Ladder for Rent',
    titleHi: 'सीढ़ी किराये पर',
    description: 'Aluminum ladder 10-20 feet available. Deposit required.',
    descriptionHi: 'एल्युमिनियम सीढ़ी 10-20 फीट उपलब्ध। जमानत जरूरी।',
    category: 'RESOURCE_RENT',
    icon: '🪜',
    priceMin: 50,
    priceMax: 100,
    priceNote: 'Per day',
    priceNoteHi: 'प्रति दिन',
    providerName: 'Harish Negi',
    providerNameHi: 'हरीश नेगी',
    providerAvatar: getAvatarUrl('harish-negi'),
    providerRating: 4.5,
    providerHelps: 19,
    distance: 0.6,
    postedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-14',
    title: 'Power Drill & Tools',
    titleHi: 'पावर ड्रिल और टूल्स',
    description: 'Drill machine, hammer, screwdriver set available. With instruction.',
    descriptionHi: 'ड्रिल मशीन, हथौड़ा, स्क्रूड्राइवर सेट उपलब्ध। निर्देश के साथ।',
    category: 'RESOURCE_RENT',
    icon: '🔧',
    priceMin: 100,
    priceMax: 200,
    priceNote: 'Per day',
    priceNoteHi: 'प्रति दिन',
    providerName: 'Suresh Kumar',
    providerNameHi: 'सुरेश कुमार',
    providerAvatar: getAvatarUrl('suresh-kumar'),
    providerRating: 4.6,
    providerHelps: 37,
    distance: 1.1,
    postedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-15',
    title: 'Cycle on Rent',
    titleHi: 'साइकिल किराये पर',
    description: 'Mountain bike and regular cycle available. Helmet included.',
    descriptionHi: 'माउंटेन बाइक और साधारण साइकिल उपलब्ध। हेलमेट शामिल।',
    category: 'RESOURCE_RENT',
    icon: '🚴',
    priceMin: 50,
    priceMax: 150,
    priceNote: 'Per day',
    priceNoteHi: 'प्रति दिन',
    providerName: 'Rahul Bhandari',
    providerNameHi: 'राहुल भंडारी',
    providerAvatar: getAvatarUrl('rahul-bhandari'),
    providerRating: 4.7,
    providerHelps: 44,
    distance: 0.4,
    postedAt: new Date(Date.now() - 1000 * 60 * 70), // 70 mins ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-16',
    title: 'Wedding Saree Rental',
    titleHi: 'शादी की साड़ी किराये पर',
    description: 'Designer sarees for wedding/functions. Dry clean guaranteed.',
    descriptionHi: 'शादी/फंक्शन के लिए डिज़ाइनर साड़ियाँ। ड्राई क्लीन गारंटी।',
    category: 'RESOURCE_RENT',
    icon: '👰',
    priceMin: 500,
    priceMax: 2000,
    priceNote: 'Per event (2-3 days)',
    priceNoteHi: 'प्रति इवेंट (2-3 दिन)',
    providerName: 'Kavita Rani',
    providerNameHi: 'कविता रानी',
    providerAvatar: getAvatarUrl('kavita-rani'),
    providerRating: 4.8,
    providerHelps: 26,
    distance: 1.9,
    postedAt: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-17',
    title: 'Chairs & Tables Rent',
    titleHi: 'कुर्सियां और मेज किराये पर',
    description: 'Plastic/folding chairs and tables for events. 50+ available.',
    descriptionHi: 'इवेंट के लिए प्लास्टिक/फोल्डिंग कुर्सियां और मेज। 50+ उपलब्ध।',
    category: 'RESOURCE_RENT',
    icon: '🪑',
    priceMin: 10,
    priceMax: 25,
    priceNote: 'Per chair/day',
    priceNoteHi: 'प्रति कुर्सी/दिन',
    providerName: 'Mohan Lal',
    providerNameHi: 'मोहन लाल',
    providerAvatar: getAvatarUrl('mohan-lal'),
    providerRating: 4.4,
    providerHelps: 62,
    distance: 2.8,
    postedAt: new Date(Date.now() - 1000 * 60 * 100), // 1.5 hours ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-18',
    title: 'Sound System Rent',
    titleHi: 'साउंड सिस्टम किराये पर',
    description: 'DJ sound system with 2 speakers, mic, and mixer. Setup included.',
    descriptionHi: 'DJ साउंड सिस्टम 2 स्पीकर, माइक और मिक्सर के साथ। सेटअप शामिल।',
    category: 'RESOURCE_RENT',
    icon: '🔊',
    priceMin: 1500,
    priceMax: 3000,
    priceNote: 'Per event',
    priceNoteHi: 'प्रति इवेंट',
    providerName: 'Rajesh DJ',
    providerNameHi: 'राजेश डीजे',
    providerAvatar: getAvatarUrl('rajesh-dj'),
    providerRating: 4.6,
    providerHelps: 33,
    distance: 3.2,
    postedAt: new Date(Date.now() - 1000 * 60 * 200), // 3+ hours ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-19',
    title: 'Tent & Canopy Rent',
    titleHi: 'टेंट और कैनोपी किराये पर',
    description: 'Wedding/party tents. Multiple sizes available. Setup service extra.',
    descriptionHi: 'शादी/पार्टी टेंट। कई आकार उपलब्ध। सेटअप सर्विस अलग।',
    category: 'RESOURCE_RENT',
    icon: '⛺',
    priceMin: 500,
    priceMax: 2000,
    priceNote: 'Per day',
    priceNoteHi: 'प्रति दिन',
    providerName: 'Ganesh Singh',
    providerNameHi: 'गणेश सिंह',
    providerAvatar: getAvatarUrl('ganesh-singh'),
    providerRating: 4.5,
    providerHelps: 41,
    distance: 2.5,
    postedAt: new Date(Date.now() - 1000 * 60 * 140), // 2+ hours ago
    area: 'Dehradun',
    isReal: true
  },
  {
    id: 'seed-20',
    title: 'Sports Equipment Rent',
    titleHi: 'खेल का सामान किराये पर',
    description: 'Cricket kit, football, badminton, tentennis. All sports gear.',
    descriptionHi: 'क्रिकेट किट, फुटबॉल, बैडमिंटन, टेबल टेनिस। सभी खेल का सामान।',
    category: 'RESOURCE_RENT',
    icon: '⚽',
    priceMin: 50,
    priceMax: 200,
    priceNote: 'Per item/day',
    priceNoteHi: 'प्रति आइटम/दिन',
    providerName: 'Akash Thakur',
    providerNameHi: 'आकाश ठाकुर',
    providerAvatar: getAvatarUrl('akash-thakur'),
    providerRating: 4.7,
    providerHelps: 25,
    distance: 1.3,
    postedAt: new Date(Date.now() - 1000 * 60 * 80), // 1+ hours ago
    area: 'Dehradun',
    isReal: true
  }
]

// Activity Seed Tasks - Tasks posted by platform for initial 15 days
// These are REAL tasks (surveys, testing, local info) - NOT fake tasks
export interface ActivitySeedTask {
  id: string
  title: string
  titleHi: string
  description: string
  descriptionHi: string
  type: 'EMERGENCY' | 'TIME_ACCESS' | 'RESOURCE_RENT'
  icon: string
  reward: number
  category: 'SURVEY' | 'TESTING' | 'LOCAL_INFO' | 'FEEDBACK'
  dayNumber: number // Day 1-15
  isReal: boolean
  postedBy: 'PLATFORM'
}

// 75 tasks for 15 days (5 per day)
export const ACTIVITY_SEED_TASKS: ActivitySeedTask[] = [
  // Day 1
  { id: 'act-1-1', title: 'Local Shop Survey', titleHi: 'स्थानीय दुकान सर्वेक्षण', description: 'Visit 3 local shops and ask if they would use our app', descriptionHi: '3 स्थानीय दुकानों पर जाएं और पूछें कि वे हमारा ऐप इस्तेमाल करेंगे', type: 'TIME_ACCESS', icon: '📊', reward: 30, category: 'SURVEY', dayNumber: 1, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-1-2', title: 'App Feedback Task', titleHi: 'ऐप फीडबैक टास्क', description: 'Use the app for 10 minutes and share 3 things you liked', descriptionHi: 'ऐप को 10 मिनट तक इस्तेमाल करें और 3 चीजें बताएं जो आपको पसंद आईं', type: 'TIME_ACCESS', icon: '💬', reward: 20, category: 'FEEDBACK', dayNumber: 1, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-1-3', title: 'Nearby Bus Stop Check', titleHi: 'पास का बस स्टॉप चेक', description: 'Check if your nearest bus stop has a shelter and share photo', descriptionHi: 'जांचें कि आपके नजदीकी बस स्टॉप पर शेल्टर है और फोटो शेयर करें', type: 'TIME_ACCESS', icon: '🚌', reward: 25, category: 'LOCAL_INFO', dayNumber: 1, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-1-4', title: 'App Navigation Test', titleHi: 'ऐप नेविगेशन टेस्ट', description: 'Try all menu options and report any broken links', descriptionHi: 'सभी मेनू विकल्प आज़माएं और किसी भी टूटे लिंक की रिपोर्ट करें', type: 'TIME_ACCESS', icon: '🧭', reward: 20, category: 'TESTING', dayNumber: 1, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-1-5', title: 'Local Area Info', titleHi: 'स्थानीय क्षेत्र जानकारी', description: 'Share 3 useful places in your area (hospital, ATM, pharmacy)', descriptionHi: 'अपने क्षेत्र के 3 उपयोगी स्थान शेयर करें (अस्पताल, एटीएम, फार्मेसी)', type: 'TIME_ACCESS', icon: '📍', reward: 25, category: 'LOCAL_INFO', dayNumber: 1, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 2
  { id: 'act-2-1', title: 'Local Service Provider List', titleHi: 'स्थानीय सेवा प्रदाता सूची', description: 'List 3 electricians/plumbers in your area with their contact', descriptionHi: 'अपने क्षेत्र के 3 इलेक्ट्रीशियन/प्लंबर उनके संपर्क के साथ सूचीबद्ध करें', type: 'TIME_ACCESS', icon: '📋', reward: 35, category: 'LOCAL_INFO', dayNumber: 2, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-2-2', title: 'Post Problem Test', titleHi: 'प्रॉब्लम पोस्ट टेस्ट', description: 'Post a sample problem and delete it after testing', descriptionHi: 'एक सैंपल प्रॉब्लम पोस्ट करें और टेस्ट के बाद डिलीट करें', type: 'TIME_ACCESS', icon: '🧪', reward: 15, category: 'TESTING', dayNumber: 2, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-2-3', title: 'Market Price Survey', titleHi: 'बाजार मूल्य सर्वेक्षण', description: 'Check prices of 5 common items at your local market', descriptionHi: 'अपने स्थानीय बाजार में 5 सामान्य वस्तुओं की कीमतें जांचें', type: 'TIME_ACCESS', icon: '💰', reward: 30, category: 'SURVEY', dayNumber: 2, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-2-4', title: 'Feature Suggestion', titleHi: 'फीचर सुझाव', description: 'Suggest 2 features you would like to see in the app', descriptionHi: '2 फीचर सुझाएं जो आप ऐप में देखना चाहेंगे', type: 'TIME_ACCESS', icon: '💡', reward: 20, category: 'FEEDBACK', dayNumber: 2, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-2-5', title: 'Nearby School Info', titleHi: 'पास के स्कूल की जानकारी', description: 'Share admission info of nearest school', descriptionHi: 'नजदीकी स्कूल की प्रवेश जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🏫', reward: 25, category: 'LOCAL_INFO', dayNumber: 2, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 3
  { id: 'act-3-1', title: 'Profile Setup Help Test', titleHi: 'प्रोफाइल सेटअप हेल्प टेस्ट', description: 'Test the profile photo upload feature', descriptionHi: 'प्रोफाइल फोटो अपलोड फीचर टेस्ट करें', type: 'TIME_ACCESS', icon: '📸', reward: 15, category: 'TESTING', dayNumber: 3, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-3-2', title: 'Local Hospital Survey', titleHi: 'स्थानीय अस्पताल सर्वेक्षण', description: 'Visit nearest hospital and check emergency services availability', descriptionHi: 'नजदीकी अस्पताल जाएं और आपातकालीन सेवाओं की उपलब्धता जांचें', type: 'TIME_ACCESS', icon: '🏥', reward: 40, category: 'SURVEY', dayNumber: 3, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-3-3', title: 'UI/UX Feedback', titleHi: 'UI/UX फीडबैक', description: 'Share what you find confusing in the app', descriptionHi: 'ऐप में आपको क्या कन्फ्यूज़िंग लगा वह शेयर करें', type: 'TIME_ACCESS', icon: '🎨', reward: 25, category: 'FEEDBACK', dayNumber: 3, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-3-4', title: 'Nearby Park Info', titleHi: 'पास के पार्क की जानकारी', description: 'Share info about nearest park - timings, facilities', descriptionHi: 'नजदीकी पार्क की जानकारी शेयर करें - समय, सुविधाएं', type: 'TIME_ACCESS', icon: '🌳', reward: 20, category: 'LOCAL_INFO', dayNumber: 3, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-3-5', title: 'Map Location Test', titleHi: 'मैप लोकेशन टेस्ट', description: 'Test the map view and report location accuracy', descriptionHi: 'मैप व्यू टेस्ट करें और लोकेशन सटीकता रिपोर्ट करें', type: 'TIME_ACCESS', icon: '🗺️', reward: 20, category: 'TESTING', dayNumber: 3, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 4
  { id: 'act-4-1', title: 'Local Transport Survey', titleHi: 'स्थानीय परिवहन सर्वेक्षण', description: 'Survey 5 people about their daily commute problems', descriptionHi: '5 लोगों से उनकी दैनिक यात्रा समस्याओं के बारे में सर्वेक्षण करें', type: 'TIME_ACCESS', icon: '🚗', reward: 35, category: 'SURVEY', dayNumber: 4, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-4-2', title: 'Notification Test', titleHi: 'नोटिफिकेशन टेस्ट', description: 'Enable notifications and report if you receive them', descriptionHi: 'नोटिफिकेशन चालू करें और रिपोर्ट करें कि आपको मिल रहे हैं', type: 'TIME_ACCESS', icon: '🔔', reward: 15, category: 'TESTING', dayNumber: 4, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-4-3', title: 'Dark Mode Test', titleHi: 'डार्क मोड टेस्ट', description: 'Test dark mode toggle and report any visual issues', descriptionHi: 'डार्क मोड टॉगल टेस्ट करें और किसी भी विज़ुअल समस्या की रिपोर्ट करें', type: 'TIME_ACCESS', icon: '🌙', reward: 15, category: 'TESTING', dayNumber: 4, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-4-4', title: 'Local Business List', titleHi: 'स्थानीय व्यवसाय सूची', description: 'List 5 businesses in your area that could use our app', descriptionHi: 'अपने क्षेत्र के 5 व्यवसाय सूचीबद्ध करें जो हमारा ऐप इस्तेमाल कर सकते हैं', type: 'TIME_ACCESS', icon: '🏪', reward: 30, category: 'LOCAL_INFO', dayNumber: 4, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-4-5', title: 'Help Categories Test', titleHi: 'हेल्प कैटेगरी टेस्ट', description: 'Browse all help categories and suggest new ones', descriptionHi: 'सभी हेल्प कैटेगरी ब्राउज़ करें और नए सुझाएं', type: 'TIME_ACCESS', icon: '📂', reward: 20, category: 'FEEDBACK', dayNumber: 4, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 5
  { id: 'act-5-1', title: 'Senior Citizen Needs Survey', titleHi: 'वरिष्ठ नागरिक जरूरतें सर्वेक्षण', description: 'Talk to 2 elderly people about their daily help needs', descriptionHi: '2 बुज़ुर्गों से उनकी दैनिक मदद की जरूरतों के बारे में बात करें', type: 'TIME_ACCESS', icon: '👴', reward: 40, category: 'SURVEY', dayNumber: 5, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-5-2', title: 'Search Feature Test', titleHi: 'सर्च फीचर टेस्ट', description: 'Test the search functionality and report accuracy', descriptionHi: 'सर्च कार्यक्षमता टेस्ट करें और सटीकता रिपोर्ट करें', type: 'TIME_ACCESS', icon: '🔍', reward: 15, category: 'TESTING', dayNumber: 5, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-5-3', title: 'Local ATM Info', titleHi: 'स्थानीय ATM जानकारी', description: 'Share locations of 3 ATMs in your area', descriptionHi: 'अपने क्षेत्र के 3 ATM के स्थान शेयर करें', type: 'TIME_ACCESS', icon: '🏦', reward: 20, category: 'LOCAL_INFO', dayNumber: 5, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-5-4', title: 'Payment Flow Test', titleHi: 'पेमेंट फ्लो टेस्ट', description: 'Go through payment flow (dont pay) and report issues', descriptionHi: 'पेमेंट फ्लो से गुजरें (भुगतान न करें) और समस्याएं रिपोर्ट करें', type: 'TIME_ACCESS', icon: '💳', reward: 15, category: 'TESTING', dayNumber: 5, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-5-5', title: 'App Speed Feedback', titleHi: 'ऐप स्पीड फीडबैक', description: 'Rate app loading speed and suggest improvements', descriptionHi: 'ऐप लोडिंग स्पीड को रेट करें और सुधार सुझाएं', type: 'TIME_ACCESS', icon: '⚡', reward: 15, category: 'FEEDBACK', dayNumber: 5, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 6-10 (continuing pattern)
  { id: 'act-6-1', title: 'Local Vegetable Price', titleHi: 'स्थानीय सब्जी मूल्य', description: 'Check and share today prices of 5 vegetables', descriptionHi: 'आज की 5 सब्जियों की कीमतें जांचें और शेयर करें', type: 'TIME_ACCESS', icon: '🥬', reward: 25, category: 'SURVEY', dayNumber: 6, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-6-2', title: 'Language Test', titleHi: 'भाषा टेस्ट', description: 'Test Hindi/English toggle and report translation issues', descriptionHi: 'हिंदी/अंग्रेजी टॉगल टेस्ट करें और अनुवाद समस्याएं रिपोर्ट करें', type: 'TIME_ACCESS', icon: '🌐', reward: 20, category: 'TESTING', dayNumber: 6, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-6-3', title: 'Nearby Pharmacy Info', titleHi: 'पास की फार्मेसी जानकारी', description: 'Share info about 24hr pharmacy near you', descriptionHi: 'अपने पास की 24 घंटे की फार्मेसी की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '💊', reward: 25, category: 'LOCAL_INFO', dayNumber: 6, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-6-4', title: 'Trust Score Feedback', titleHi: 'ट्रस्ट स्कोर फीडबैक', description: 'Share your understanding of trust score system', descriptionHi: 'ट्रस्ट स्कोर सिस्टम की अपनी समझ शेयर करें', type: 'TIME_ACCESS', icon: '⭐', reward: 20, category: 'FEEDBACK', dayNumber: 6, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-6-5', title: 'Nearby Gym Info', titleHi: 'पास के जिम की जानकारी', description: 'Share monthly fees and timings of nearest gym', descriptionHi: 'नजदीकी जिम की मासिक फीस और समय शेयर करें', type: 'TIME_ACCESS', icon: '🏋️', reward: 25, category: 'LOCAL_INFO', dayNumber: 6, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 7
  { id: 'act-7-1', title: 'Weekly App Review', titleHi: 'साप्ताहिक ऐप समीक्षा', description: 'Share your overall experience after 1 week', descriptionHi: '1 सप्ताह बाद अपना समग्र अनुभव शेयर करें', type: 'TIME_ACCESS', icon: '📅', reward: 50, category: 'FEEDBACK', dayNumber: 7, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-7-2', title: 'Local Event Info', titleHi: 'स्थानीय कार्यक्रम जानकारी', description: 'Share info about any upcoming local event', descriptionHi: 'किसी आगामी स्थानीय कार्यक्रम की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🎪', reward: 20, category: 'LOCAL_INFO', dayNumber: 7, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-7-3', title: 'Chat Feature Test', titleHi: 'चैट फीचर टेस्ट', description: 'Test the chat feature with a friend', descriptionHi: 'किसी दोस्त के साथ चैट फीचर टेस्ट करें', type: 'TIME_ACCESS', icon: '💬', reward: 25, category: 'TESTING', dayNumber: 7, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-7-4', title: 'Local Cab Service Survey', titleHi: 'स्थानीय कैब सेवा सर्वेक्षण', description: 'Survey about local cab/auto availability', descriptionHi: 'स्थानीय कैब/ऑटो की उपलब्धता के बारे में सर्वेक्षण', type: 'TIME_ACCESS', icon: '🚕', reward: 30, category: 'SURVEY', dayNumber: 7, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-7-5', title: 'Share Feature Test', titleHi: 'शेयर फीचर टेस्ट', description: 'Test the share referral feature', descriptionHi: 'शेयर रेफरल फीचर टेस्ट करें', type: 'TIME_ACCESS', icon: '📤', reward: 15, category: 'TESTING', dayNumber: 7, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 8-15 (abbreviated for space)
  { id: 'act-8-1', title: 'Local Internet Cafe Info', titleHi: 'स्थानीय इंटरनेट कैफे जानकारी', description: 'Share info about internet cafe near you', descriptionHi: 'अपने पास के इंटरनेट कैफे की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '💻', reward: 20, category: 'LOCAL_INFO', dayNumber: 8, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-8-2', title: 'Category Icons Test', titleHi: 'कैटेगरी आइकन टेस्ट', description: 'Check if all category icons are visible correctly', descriptionHi: 'जांचें कि सभी कैटेगरी आइकन सही से दिख रहे हैं', type: 'TIME_ACCESS', icon: '🎨', reward: 15, category: 'TESTING', dayNumber: 8, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-8-3', title: 'Student Needs Survey', titleHi: 'छात्र जरूरतें सर्वेक्षण', description: 'Survey 3 students about their daily help needs', descriptionHi: '3 छात्रों से उनकी दैनिक मदद की जरूरतों के बारे में सर्वेक्षण', type: 'TIME_ACCESS', icon: '🎓', reward: 35, category: 'SURVEY', dayNumber: 8, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-8-4', title: 'Help Request Flow Test', titleHi: 'हेल्प रिक्वेस्ट फ्लो टेस्ट', description: 'Test the complete help request flow', descriptionHi: 'पूरा हेल्प रिक्वेस्ट फ्लो टेस्ट करें', type: 'TIME_ACCESS', icon: '🧪', reward: 20, category: 'TESTING', dayNumber: 8, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-8-5', title: 'Local Coaching Info', titleHi: 'स्थानीय कोचिंग जानकारी', description: 'Share info about nearby coaching centers', descriptionHi: 'पास के कोचिंग सेंटर की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '📖', reward: 25, category: 'LOCAL_INFO', dayNumber: 8, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 9
  { id: 'act-9-1', title: 'Local Repair Shop Survey', titleHi: 'स्थानीय रिपेयर शॉप सर्वेक्षण', description: 'Survey mobile/TV repair shops in your area', descriptionHi: 'अपने क्षेत्र में मोबाइल/टीवी रिपेयर शॉप का सर्वेक्षण', type: 'TIME_ACCESS', icon: '🔧', reward: 30, category: 'SURVEY', dayNumber: 9, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-9-2', title: 'Profile Edit Test', titleHi: 'प्रोफाइल एडिट टेस्ट', description: 'Test profile editing and photo change', descriptionHi: 'प्रोफाइल एडिटिंग और फोटो बदलने का टेस्ट करें', type: 'TIME_ACCESS', icon: '👤', reward: 15, category: 'TESTING', dayNumber: 9, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-9-3', title: 'Nearby Restaurant Info', titleHi: 'पास के रेस्तरां की जानकारी', description: 'Share info about budget-friendly restaurants', descriptionHi: 'बजट-फ्रेंडली रेस्तरां की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🍽️', reward: 25, category: 'LOCAL_INFO', dayNumber: 9, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-9-4', title: 'Loading Speed Test', titleHi: 'लोडिंग स्पीड टेस्ट', description: 'Measure and report app loading time on your device', descriptionHi: 'अपने डिवाइस पर ऐप लोडिंग समय मापें और रिपोर्ट करें', type: 'TIME_ACCESS', icon: '⏱️', reward: 15, category: 'TESTING', dayNumber: 9, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-9-5', title: 'User Onboarding Feedback', titleHi: 'यूज़र ऑनबोर्डिंग फीडबैक', description: 'Share your thoughts on the onboarding process', descriptionHi: 'ऑनबोर्डिंग प्रक्रिया पर अपने विचार शेयर करें', type: 'TIME_ACCESS', icon: '🚀', reward: 25, category: 'FEEDBACK', dayNumber: 9, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 10
  { id: 'act-10-1', title: 'Local Market Day Info', titleHi: 'स्थानीय बाजार दिवस जानकारी', description: 'Share weekly market day info in your area', descriptionHi: 'अपने क्षेत्र में साप्ताहिक बाजार दिवस की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🛍️', reward: 25, category: 'LOCAL_INFO', dayNumber: 10, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-10-2', title: 'Trust Score Display Test', titleHi: 'ट्रस्ट स्कोर डिस्प्ले टेस्ट', description: 'Check if trust score is displayed correctly', descriptionHi: 'जांचें कि ट्रस्ट स्कोर सही से प्रदर्शित हो रहा है', type: 'TIME_ACCESS', icon: '🛡️', reward: 15, category: 'TESTING', dayNumber: 10, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-10-3', title: 'Housewife Needs Survey', titleHi: 'गृहिणी जरूरतें सर्वेक्षण', description: 'Survey 3 housewives about their daily help needs', descriptionHi: '3 गृहिणियों से उनकी दैनिक मदद की जरूरतों का सर्वेक्षण', type: 'TIME_ACCESS', icon: '👩', reward: 35, category: 'SURVEY', dayNumber: 10, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-10-4', title: 'Error Message Test', titleHi: 'एरर मैसेज टेस्ट', description: 'Test error messages by entering invalid data', descriptionHi: 'अमान्य डेटा दर्ज करके एरर मैसेज टेस्ट करें', type: 'TIME_ACCESS', icon: '⚠️', reward: 15, category: 'TESTING', dayNumber: 10, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-10-5', title: 'App Rating Prompt', titleHi: 'ऐप रेटिंग प्रॉम्प्ट', description: 'Would you recommend this app? Why/why not?', descriptionHi: 'क्या आप इस ऐप की सिफारिश करेंगे? क्यों/क्यों नहीं?', type: 'TIME_ACCESS', icon: '⭐', reward: 30, category: 'FEEDBACK', dayNumber: 10, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 11-15 (final batch)
  { id: 'act-11-1', title: 'Nearby Pet Shop Info', titleHi: 'पास के पेट शॉप की जानकारी', description: 'Share info about pet shops/vets in your area', descriptionHi: 'अपने क्षेत्र में पेट शॉप/पशु चिकित्सक की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🐾', reward: 25, category: 'LOCAL_INFO', dayNumber: 11, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-11-2', title: 'Notification Timing Test', titleHi: 'नोटिफिकेशन टाइमिंग टेस्ट', description: 'Test if notifications arrive on time', descriptionHi: 'जांचें कि नोटिफिकेशन समय पर आ रहे हैं', type: 'TIME_ACCESS', icon: '⏰', reward: 15, category: 'TESTING', dayNumber: 11, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-11-3', title: 'Local Electrician List', titleHi: 'स्थानीय इलेक्ट्रीशियन सूची', description: 'List 3 electricians with their charges', descriptionHi: '3 इलेक्ट्रीशियन उनकी चार्ज के साथ सूचीबद्ध करें', type: 'TIME_ACCESS', icon: '⚡', reward: 30, category: 'LOCAL_INFO', dayNumber: 11, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-11-4', title: 'Menu Navigation Test', titleHi: 'मेनू नेविगेशन टेस्ट', description: 'Test all menu items and report broken links', descriptionHi: 'सभी मेनू आइटम टेस्ट करें और टूटे लिंक रिपोर्ट करें', type: 'TIME_ACCESS', icon: '📋', reward: 15, category: 'TESTING', dayNumber: 11, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-11-5', title: 'User Safety Feedback', titleHi: 'यूज़र सुरक्षा फीडबैक', description: 'Share thoughts on safety features in app', descriptionHi: 'ऐप में सुरक्षा सुविधाओं पर अपने विचार शेयर करें', type: 'TIME_ACCESS', icon: '🛡️', reward: 25, category: 'FEEDBACK', dayNumber: 11, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 12
  { id: 'act-12-1', title: 'Local Plumber Info', titleHi: 'स्थानीय प्लंबर जानकारी', description: 'Share info about reliable plumbers nearby', descriptionHi: 'पास के विश्वसनीय प्लंबर की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🔧', reward: 25, category: 'LOCAL_INFO', dayNumber: 12, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-12-2', title: 'SOS Button Test', titleHi: 'SOS बटन टेस्ट', description: 'Test SOS button (cancel immediately after pressing)', descriptionHi: 'SOS बटन टेस्ट करें (दबाने के तुरंत बाद कैंसल करें)', type: 'EMERGENCY', icon: '🆘', reward: 15, category: 'TESTING', dayNumber: 12, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-12-3', title: 'Small Business Survey', titleHi: 'छोटे व्यवसाय सर्वेक्षण', description: 'Survey 2 small businesses about app usefulness', descriptionHi: '2 छोटे व्यवसायों से ऐप की उपयोगिता के बारे में सर्वेक्षण', type: 'TIME_ACCESS', icon: '🏪', reward: 35, category: 'SURVEY', dayNumber: 12, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-12-4', title: 'Location Permission Test', titleHi: 'लोकेशन परमिशन टेस्ट', description: 'Test location permission flow', descriptionHi: 'लोकेशन परमिशन फ्लो टेस्ट करें', type: 'TIME_ACCESS', icon: '📍', reward: 15, category: 'TESTING', dayNumber: 12, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-12-5', title: 'Help Category Feedback', titleHi: 'हेल्प कैटेगरी फीडबैक', description: 'Are help categories easy to understand?', descriptionHi: 'क्या हेल्प कैटेगरी समझने में आसान हैं?', type: 'TIME_ACCESS', icon: '📂', reward: 20, category: 'FEEDBACK', dayNumber: 12, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 13
  { id: 'act-13-1', title: 'Nearby Laundry Info', titleHi: 'पास की लॉन्ड्री जानकारी', description: 'Share info about laundry services nearby', descriptionHi: 'पास की लॉन्ड्री सेवाओं की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🧺', reward: 20, category: 'LOCAL_INFO', dayNumber: 13, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-13-2', title: 'Form Validation Test', titleHi: 'फॉर्म वैलिडेशन टेस्ट', description: 'Test all forms with edge cases', descriptionHi: 'सभी फॉर्म को एज केस के साथ टेस्ट करें', type: 'TIME_ACCESS', icon: '📝', reward: 20, category: 'TESTING', dayNumber: 13, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-13-3', title: 'Daily Commuter Survey', titleHi: 'दैनिक यात्री सर्वेक्षण', description: 'Survey about daily commute challenges', descriptionHi: 'दैनिक यात्रा चुनौतियों के बारे में सर्वेक्षण', type: 'TIME_ACCESS', icon: '🚶', reward: 30, category: 'SURVEY', dayNumber: 13, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-13-4', title: 'Back Button Test', titleHi: 'बैक बटन टेस्ट', description: 'Test back button navigation throughout app', descriptionHi: 'पूरे ऐप में बैक बटन नेविगेशन टेस्ट करें', type: 'TIME_ACCESS', icon: '⬅️', reward: 15, category: 'TESTING', dayNumber: 13, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-13-5', title: 'Price Display Feedback', titleHi: 'कीमत प्रदर्शन फीडबैक', description: 'Are prices displayed clearly?', descriptionHi: 'क्या कीमतें स्पष्ट रूप से प्रदर्शित हैं?', type: 'TIME_ACCESS', icon: '💰', reward: 15, category: 'FEEDBACK', dayNumber: 13, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 14
  { id: 'act-14-1', title: 'Nearby Salon Info', titleHi: 'पास के सैलून की जानकारी', description: 'Share info about salons/barbers in your area', descriptionHi: 'अपने क्षेत्र में सैलून/नाई की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '💇', reward: 20, category: 'LOCAL_INFO', dayNumber: 14, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-14-2', title: 'Image Upload Test', titleHi: 'इमेज अपलोड टेस्ट', description: 'Test image upload in problem posting', descriptionHi: 'प्रॉब्लम पोस्टिंग में इमेज अपलोड टेस्ट करें', type: 'TIME_ACCESS', icon: '📷', reward: 20, category: 'TESTING', dayNumber: 14, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-14-3', title: 'Two Week Experience', titleHi: 'दो सप्ताह का अनुभव', description: 'Share your detailed app experience', descriptionHi: 'अपना विस्तृत ऐप अनुभव शेयर करें', type: 'TIME_ACCESS', icon: '📊', reward: 50, category: 'FEEDBACK', dayNumber: 14, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-14-4', title: 'Contact Display Test', titleHi: 'कॉन्टैक्ट डिस्प्ले टेस्ट', description: 'Test if phone numbers display correctly', descriptionHi: 'जांचें कि फोन नंबर सही से प्रदर्शित हो रहे हैं', type: 'TIME_ACCESS', icon: '📱', reward: 15, category: 'TESTING', dayNumber: 14, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-14-5', title: 'Local Baker Info', titleHi: 'स्थानीय बेकर की जानकारी', description: 'Share info about local bakery/sweet shop', descriptionHi: 'स्थानीय बेकरी/मिठाई की दुकान की जानकारी शेयर करें', type: 'TIME_ACCESS', icon: '🎂', reward: 20, category: 'LOCAL_INFO', dayNumber: 14, isReal: true, postedBy: 'PLATFORM' },
  
  // Day 15
  { id: 'act-15-1', title: 'Final App Review', titleHi: 'अंतिम ऐप समीक्षा', description: 'Comprehensive review after 15 days of usage', descriptionHi: '15 दिनों के उपयोग के बाद व्यापक समीक्षा', type: 'TIME_ACCESS', icon: '⭐', reward: 75, category: 'FEEDBACK', dayNumber: 15, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-15-2', title: 'Bug Report Summary', titleHi: 'बग रिपोर्ट सारांश', description: 'Report all bugs you found during testing', descriptionHi: 'टेस्टिंग के दौरान मिले सभी बग रिपोर्ट करें', type: 'TIME_ACCESS', icon: '🐛', reward: 40, category: 'TESTING', dayNumber: 15, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-15-3', title: 'Feature Request Summary', titleHi: 'फीचर रिक्वेस्ट सारांश', description: 'Summarize features you want added', descriptionHi: 'जो फीचर आप जोड़ना चाहते हैं उनका सारांश दें', type: 'TIME_ACCESS', icon: '✨', reward: 30, category: 'FEEDBACK', dayNumber: 15, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-15-4', title: 'Local Resource Summary', titleHi: 'स्थानीय संसाधन सारांश', description: 'Summarize local resources you documented', descriptionHi: 'आपके द्वारा दस्तावेज़ किए गए स्थानीय संसाधनों का सारांश', type: 'TIME_ACCESS', icon: '📋', reward: 40, category: 'LOCAL_INFO', dayNumber: 15, isReal: true, postedBy: 'PLATFORM' },
  { id: 'act-15-5', title: 'Thank You Task', titleHi: 'धन्यवाद टास्क', description: 'Thank you for completing 15 days! Share your referral.', descriptionHi: '15 दिन पूरे करने के लिए धन्यवाद! अपना रेफरल शेयर करें।', type: 'TIME_ACCESS', icon: '🙏', reward: 50, category: 'FEEDBACK', dayNumber: 15, isReal: true, postedBy: 'PLATFORM' }
]

// Helper function to get today's tasks based on app launch date
export function getTodaysSeedTasks(appLaunchDate: Date): ActivitySeedTask[] {
  const now = new Date()
  const daysSinceLaunch = Math.floor((now.getTime() - appLaunchDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // Only return tasks for first 15 days
  if (daysSinceLaunch > 15) {
    return []
  }
  
  return ACTIVITY_SEED_TASKS.filter(task => task.dayNumber === daysSinceLaunch)
}

// Helper function to get random services for display
export function getRandomServices(count: number = 10): SeededService[] {
  const shuffled = [...SEEDED_SERVICES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Helper to format service for display
export function formatServicePrice(service: SeededService): string {
  if (service.priceMin === service.priceMax) {
    return `₹${service.priceMin}`
  }
  return `₹${service.priceMin}-${service.priceMax}`
}
