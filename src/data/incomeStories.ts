// Comprehensive Income Stories for all 30+ situations
// Each story is unique with practical steps and resources

export interface IncomeStory {
  story: {
    title: string
    titleHi: string
    intro: string
    introHi: string
    income: string
    incomeHi: string
    incomeRange: string
    demand: string
    demandHi: string
  }
  steps: Array<{
    step: number
    title: string
    titleHi: string
    description: string
    descriptionHi: string
    icon: string
    tip?: string
    tipHi?: string
  }>
  resources: Array<{
    name: string
    nameHi: string
    icon: string
    income: string
    difficulty: string
  }>
  appHelp: Array<{
    title: string
    titleHi: string
    description: string
    descriptionHi: string
  }>
}

export const incomeStories: Record<string, IncomeStory> = {
  // ========== WEDDING & EVENTS (Row 1) ==========
  
  // 1. Wedding Saree
  'wedding-saree': {
    story: {
      title: 'Wedding Saree Rental',
      titleHi: 'शादी की साड़ी किराये पर',
      intro: 'A designer wedding saree costs ₹15,000-1,00,000 but is worn only once. Your expensive sarees can generate monthly income!',
      introHi: 'डिज़ाइनर शादी की साड़ी ₹15,000-1,00,000 की होती है लेकिन सिर्फ एक बार पहनी जाती है। आपकी महंगी साड़ियां मासिक आय दे सकती हैं!',
      income: 'Earn ₹500-3000 per day',
      incomeHi: 'रोज़ ₹500-3000 कमाएं',
      incomeRange: '₹500 - ₹3,000/day',
      demand: 'Peak: Wedding season (Oct-Feb, Apr-Jun)',
      demandHi: 'शादी के सीजन में ज़्यादा मांग'
    },
    steps: [
      { step: 1, title: 'Prepare Saree', titleHi: 'साड़ी तैयार करें', description: 'Clean, iron and take clear photos from front, back, pallu detail', descriptionHi: 'साफ करें, इस्तरी करें और सामने, पीछे, पल्लू की स्पष्ट फोटो लें', icon: '📸', tip: 'Natural daylight photos get 3x more requests', tipHi: 'प्राकृतिक रोशनी में फोटो से 3x ज़्यादा अनुरोध' },
      { step: 2, title: 'Set Price & Deposit', titleHi: 'कीमत और जमानत', description: 'Set daily rent (₹500-2000) and security deposit (₹2000-10000)', descriptionHi: 'दैनिक किराया (₹500-2000) और सिक्योरिटी डिपॉजिट (₹2000-10000) तय करें', icon: '💰', tip: 'Higher deposit = safer transaction', tipHi: 'ज़्यादा जमानत = सुरक्षित लेनदेन' },
      { step: 3, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Upload photos, set location radius, add conditions', descriptionHi: 'फोटो अपलोड करें, स्थान त्रिज्या सेट करें, शर्तें जोड़ें', icon: '📱', tip: 'Add "dry clean before return" condition', tipHi: '"वापसी से पहले ड्राई क्लीन" शर्त जोड़ें' },
      { step: 4, title: 'Meet & Verify', titleHi: 'मिलें और वेरिफाई करें', description: 'Meet at public place, check renter\'s ID, take photos of saree condition', descriptionHi: 'सार्वजनिक जगह मिलें, किराएदार का ID चेक करें, साड़ी की स्थिति की फोटो लें', icon: '🤝', tip: 'Keep Aadhaar copy for safety', tipHi: 'सुरक्षा के लिए आधार कॉपी रखें' },
      { step: 5, title: 'Return & Review', titleHi: 'वापस लें और समीक्षा करें', description: 'Check condition, return deposit, give review on app', descriptionHi: 'स्थिति जांचें, जमानत वापस करें, ऐप पर समीक्षा दें', icon: '⭐', tip: 'Good reviews = more rentals', tipHi: 'अच्छी समीक्षा = ज़्यादा किराया' }
    ],
    resources: [
      { name: 'Bridal Silk Saree', nameHi: 'ब्राइडल सिल्क साड़ी', icon: '👗', income: '₹1500-3000/day', difficulty: 'High' },
      { name: 'Designer Lehenga', nameHi: 'डिज़ाइनर लहंगा', icon: '💃', income: '₹2000-5000/day', difficulty: 'High' },
      { name: 'Banarasi Saree', nameHi: 'बनारसी साड़ी', icon: '✨', income: '₹800-1500/day', difficulty: 'Medium' },
      { name: 'Reception Saree', nameHi: 'रिसेप्शन साड़ी', icon: '🎀', income: '₹1000-2000/day', difficulty: 'Medium' },
      { name: 'Engagement Outfit', nameHi: 'सगाई का कपड़ा', icon: '💫', income: '₹500-1200/day', difficulty: 'Low' },
      { name: 'Wedding Jewelry Set', nameHi: 'शादी का गहना सेट', icon: '💎', income: '₹500-1500/day', difficulty: 'High' }
    ],
    appHelp: [
      { title: 'Verified Renters', titleHi: 'वेरिफाइड किराएदार', description: 'See renter\'s trust score and rental history', descriptionHi: 'किराएदार का ट्रस्ट स्कोर और किराया इतिहास देखें' },
      { title: 'Photo Verification', titleHi: 'फोटो वेरिफिकेशन', description: 'App records item condition at handover', descriptionHi: 'ऐप हैंडओवर पर आइटम की स्थिति रिकॉर्ड करता है' },
      { title: 'Safe Meeting Spots', titleHi: 'सुरक्षित मिलने की जगह', description: 'Meet at verified public locations', descriptionHi: 'सत्यापित सार्वजनिक स्थानों पर मिलें' },
      { title: 'Earnings Tracker', titleHi: 'कमाई ट्रैकर', description: 'Track monthly income from rentals', descriptionHi: 'किराये से मासिक आय ट्रैक करें' }
    ]
  },

  // 2. Sherwani
  'sherwani': {
    story: {
      title: 'Sherwani & Formal Wear Rental',
      titleHi: 'शेरवानी और फॉर्मल पहनावा किराये पर',
      intro: 'Men\'s wedding sherwanis cost ₹10,000-50,000 and are worn once. Your sherwani can help grooms look great and earn you money!',
      introHi: 'पुरुषों की शादी की शेरवानी ₹10,000-50,000 की होती है और एक बार पहनी जाती है। आपकी शेरवानी दूल्हों को शानदार दिखा सकती है और आपको पैसे कमा सकती है!',
      income: 'Earn ₹500-2000 per day',
      incomeHi: 'रोज़ ₹500-2000 कमाएं',
      incomeRange: '₹500 - ₹2,000/day',
      demand: 'High demand in wedding season',
      demandHi: 'शादी के सीजन में उच्च मांग'
    },
    steps: [
      { step: 1, title: 'Clean & Press', titleHi: 'साफ और प्रेस', description: 'Dry clean sherwani, steam press, check for any damages', descriptionHi: 'शेरवानी ड्राई क्लीन करें, स्टीम प्रेस, किसी भी नुकसान की जांच करें', icon: '🧹', tip: 'Include matching stole and mojari', tipHi: 'मिलती-जुलती दुपट्टा और मोजरी शामिल करें' },
      { step: 2, title: 'Measure & List', titleHi: 'मापें और पोस्ट करें', description: 'Note chest, shoulder, length measurements and post with size', descriptionHi: 'छाती, कंधे, लंबाई की माप नोट करें और साइज के साथ पोस्ट करें', icon: '📏', tip: 'Add height recommendation (5\'8" - 6\'0")', tipHi: 'ऊंचाई सिफारिश जोड़ें' },
      { step: 3, title: 'Setup Fitting', titleHi: 'फिटिंग का इंतजाम', description: 'Allow renter to try at safe location before final booking', descriptionHi: 'अंतिम बुकिंग से पहले किराएदार को सुरक्षित जगह पर ट्राई करने दें', icon: '👔', tip: 'Keep safety pins and minor alteration kit', tipHi: 'सेफ्टी पिन और मामूली अल्टरेशन किट रखें' },
      { step: 4, title: 'Handover with Care', titleHi: 'सावधानी से सौंपें', description: 'Check ID, take deposit, click photos of sherwani condition', descriptionHi: 'ID चेक करें, जमानत लें, शेरवानी की स्थिति की फोटो लें', icon: '🤝', tip: 'Give wearing tips - how to drape stole', tipHi: 'पहनने के टिप्स दें - दुपट्टा कैसे पहनें' },
      { step: 5, title: 'Collect & Review', titleHi: 'वापस लें और समीक्षा करें', description: 'Check for damages, return deposit minus any deductions', descriptionHi: 'नुकसान की जांच करें, कटौती के बाद जमानत वापस करें', icon: '⭐', tip: 'Build relationship for repeat customers', tipHi: 'दोहराए ग्राहकों के लिए संबंध बनाएं' }
    ],
    resources: [
      { name: 'Designer Sherwani', nameHi: 'डिज़ाइनर शेरवानी', icon: '🤵', income: '₹1000-2000/day', difficulty: 'High' },
      { name: 'Simple Sherwani', nameHi: 'साधारण शेरवानी', icon: '👔', income: '₹500-1000/day', difficulty: 'Medium' },
      { name: 'Kurta Pajama Set', nameHi: 'कुर्ता पजामा सेट', icon: '🧥', income: '₹200-500/day', difficulty: 'Low' },
      { name: 'Nehru Jacket', nameHi: 'नेहरू जैकेट', icon: '🧥', income: '₹200-400/day', difficulty: 'Low' },
      { name: 'Mojari/Jutti', nameHi: 'मोजरी/जूती', icon: '👞', income: '₹100-200/day', difficulty: 'Low' },
      { name: 'Safa/Pagdi', nameHi: 'साफा/पगड़ी', icon: '👳', income: '₹150-300/day', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Size Matching', titleHi: 'साइज मैचिंग', description: 'App suggests compatible sizes to renters', descriptionHi: 'ऐप किराएदारों को संगत साइज सुझाता है' },
      { title: 'Photo Documentation', titleHi: 'फोटो दस्तावेज़ीकरण', description: 'Before/after photos stored securely', descriptionHi: 'पहले/बाद की फोटो सुरक्षित रूप से संग्रहीत' },
      { title: 'Deposit Protection', titleHi: 'जमानत सुरक्षा', description: 'App helps calculate fair deposit amount', descriptionHi: 'ऐप उचित जमानत राशि की गणना में मदद करता है' },
      { title: 'Review System', titleHi: 'समीक्षा प्रणाली', description: 'Both parties can rate each other', descriptionHi: 'दोनों पक्ष एक-दूसरे को रेट कर सकते हैं' }
    ]
  },

  // 3. Dance Costume
  'dance-costume': {
    story: {
      title: 'Dance & Performance Costume Rental',
      titleHi: 'नृत्य और प्रदर्शन कॉस्ट्यूम किराये पर',
      intro: 'Dance costumes for sangeet, competitions, school functions cost ₹3,000-20,000. Your costumes can help performers shine!',
      introHi: 'संगीत, प्रतियोगिताओं, स्कूल कार्यक्रमों के लिए डांस कॉस्ट्यूम ₹3,000-20,000 के होते हैं। आपके कॉस्ट्यूम प्रदर्शनकारों को चमकने में मदद कर सकते हैं!',
      income: 'Earn ₹300-1500 per day',
      incomeHi: 'रोज़ ₹300-1500 कमाएं',
      incomeRange: '₹300 - ₹1,500/day',
      demand: 'High during wedding & cultural seasons',
      demandHi: 'शादी और सांस्कृतिक सीजन में उच्च'
    },
    steps: [
      { step: 1, title: 'Organize Costumes', titleHi: 'कॉस्ट्यूम व्यवस्थित करें', description: 'Sort by dance type - classical, western, folk, Bollywood', descriptionHi: 'नृत्य प्रकार के अनुसार छांटें - शास्त्रीय, पश्चिमी, लोक, बॉलीवुड', icon: '💃', tip: 'Include matching accessories', tipHi: 'मिलते-जुलते एक्सेसरीज शामिल करें' },
      { step: 2, title: 'Photo Session', titleHi: 'फोटो सेशन', description: 'Take photos showing full costume on hanger and worn', descriptionHi: 'हैंगर पर और पहने हुए पूरे कॉस्ट्यूम की फोटो लें', icon: '📸', tip: 'Show back view and details', tipHi: 'पीछे का दृश्य और विवरण दिखाएं' },
      { step: 3, title: 'List with Details', titleHi: 'विवरण के साथ पोस्ट करें', description: 'Add size, dance type suitable for, accessories included', descriptionHi: 'साइज, उपयुक्त नृत्य प्रकार, शामिल एक्सेसरीज जोड़ें', icon: '📝', tip: 'Mention if alterations possible', tipHi: 'बताएं कि अल्टरेशन संभव है या नहीं' },
      { step: 4, title: 'Fitting Session', titleHi: 'फिटिंग सेशन', description: 'Let dancer try, check for comfort during dance moves', descriptionHi: 'नर्तक को ट्राई करने दें, नृत्य के दौरान आराम की जांच करें', icon: '🎭', tip: 'Advise on performance tips', tipHi: 'प्रदर्शन के टिप्स दें' },
      { step: 5, title: 'Return Check', titleHi: 'वापसी जांच', description: 'Check for makeup stains, tears, missing accessories', descriptionHi: 'मेकअप के धब्बे, फटन, गायब एक्सेसरीज की जांच करें', icon: '✅', tip: 'Keep extra safety pins handy', tipHi: 'अतिरिक्त सेफ्टी पिन रखें' }
    ],
    resources: [
      { name: 'Classical Dance Costume', nameHi: 'शास्त्रीय नृत्य कॉस्ट्यूम', icon: '🪔', income: '₹800-1500/day', difficulty: 'High' },
      { name: 'Bollywood Dance Dress', nameHi: 'बॉलीवुड डांस ड्रेस', icon: '🎬', income: '₹400-800/day', difficulty: 'Medium' },
      { name: 'Folk Dance Costume', nameHi: 'लोक नृत्य कॉस्ट्यूम', icon: '🪘', income: '₹300-600/day', difficulty: 'Medium' },
      { name: 'Western Dance Outfit', nameHi: 'पश्चिमी नृत्य पोशाक', icon: '🕺', income: '₹400-800/day', difficulty: 'Medium' },
      { name: 'Dance Accessories Set', nameHi: 'डांस एक्सेसरीज सेट', icon: '✨', income: '₹100-300/day', difficulty: 'Low' },
      { name: 'Stage Props', nameHi: 'स्टेज प्रॉप्स', icon: '🎪', income: '₹200-500/use', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Dance Type Filter', titleHi: 'नृत्य प्रकार फ़िल्टर', description: 'Renters can search by dance style', descriptionHi: 'किराएदार नृत्य शैली से खोज सकते हैं' },
      { title: 'Size Guide', titleHi: 'साइज गाइड', description: 'App helps match costume to performer', descriptionHi: 'ऐप कॉस्ट्यूम को प्रदर्शनकार से मिलाने में मदद करता है' },
      { title: 'Accessory Checklist', titleHi: 'एक्सेसरी चेकलिस्ट', description: 'Digital checklist for handover items', descriptionHi: 'हैंडओवर आइटम्स के लिए डिजिटल चेकलिस्ट' },
      { title: 'Quick Reviews', titleHi: 'त्वरित समीक्षा', description: 'Easy rating after each rental', descriptionHi: 'प्रत्येक किराये के बाद आसान रेटिंग' }
    ]
  },

  // ========== VEHICLE ISSUES (Row 2) ==========

  // 4. Bike Puncture
  'bike-puncture': {
    story: {
      title: 'Bike Puncture Help Service',
      titleHi: 'बाइक पंक्चर मदद सेवा',
      intro: 'A simple puncture repair kit (₹200-500) can help stranded riders and earn you ₹100-300 per puncture!',
      introHi: 'एक साधारण पंक्चर रिपेयर किट (₹200-500) फंसे हुए राइडर्स की मदद कर सकती है और आपको प्रति पंक्चर ₹100-300 कमा सकती है!',
      income: 'Earn ₹100-300 per puncture',
      incomeHi: 'प्रति पंक्चर ₹100-300 कमाएं',
      incomeRange: '₹100 - ₹300/help',
      demand: 'Daily 50-100+ punctures in every city!',
      demandHi: 'हर शहर में रोज़ 50-100+ पंक्चर!'
    },
    steps: [
      { step: 1, title: 'Keep Kit Ready', titleHi: 'किट तैयार रखें', description: 'Carry puncture kit: patches, glue, pump, levers, spare tube', descriptionHi: 'पंक्चर किट रखें: पैच, गोंद, पंप, लीवर, स्पेयर ट्यूब', icon: '🔧', tip: 'Practice at home first', tipHi: 'पहले घर पर अभ्यास करें' },
      { step: 2, title: 'Get Alert', titleHi: 'अलर्ट पाएं', description: 'Enable notifications, see nearby help requests on map', descriptionHi: 'नोटिफिकेशन चालू करें, मैप पर पास के मदद अनुरोध देखें', icon: '🔔', tip: 'Quick response = first to reach', tipHi: 'तेज़ जवाब = पहले पहुंचना' },
      { step: 3, title: 'Navigate to Spot', titleHi: 'स्थान पर जाएं', description: 'Use GPS to reach exact location, call if needed', descriptionHi: 'सही जगह पर पहुंचने के लिए GPS का उपयोग करें, जरूरत हो तो कॉल करें', icon: '📍', tip: 'First 5 helpers get phone number', tipHi: 'पहले 5 मददगारों को फोन नंबर मिलता है' },
      { step: 4, title: 'Fix Puncture', titleHi: 'पंक्चर ठीक करें', description: 'Remove wheel, find hole, patch it or replace tube', descriptionHi: 'पहिया निकालें, छेद खोजें, पैच करें या ट्यूब बदलें', icon: '🛞', tip: 'Check for multiple holes', tipHi: 'कई छेदों की जांच करें' },
      { step: 5, title: 'Get Payment', titleHi: 'भुगतान पाएं', description: 'Charge ₹100-300 based on work, accept UPI/cash', descriptionHi: 'काम के आधार पर ₹100-300 लें, UPI/कैश स्वीकार करें', icon: '💵', tip: 'Ask for tip if good service!', tipHi: 'अच्छी सेवा के लिए टिप मांगें!' }
    ],
    resources: [
      { name: 'Puncture Repair Kit', nameHi: 'पंक्चर रिपेयर किट', icon: '🔧', income: '₹100-300/repair', difficulty: 'Low' },
      { name: 'Portable Air Pump', nameHi: 'पोर्टेबल एयर पंप', icon: '💨', income: '₹50-100/fill', difficulty: 'Very Low' },
      { name: 'Spare Tubes (Scooter/Bike)', nameHi: 'स्पेयर ट्यूब्स', icon: '⭕', income: '₹200-400/replace', difficulty: 'Low' },
      { name: 'Tyre Levers Set', nameHi: 'टायर लीवर सेट', icon: '🔨', income: 'Included in repair', difficulty: 'Low' },
      { name: 'Foot Pump', nameHi: 'फुट पंप', icon: '🦶', income: '₹30-50/fill', difficulty: 'Very Low' },
      { name: 'Tubeless Puncture Kit', nameHi: 'ट्यूबलेस पंक्चर किट', icon: '🔩', income: '₹150-300/repair', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Instant Alerts', titleHi: 'तुरंत अलर्ट', description: 'Get notified when someone nearby needs help', descriptionHi: 'जब पास में किसी को मदद चाहिए तो सूचना पाएं' },
      { title: 'GPS Navigation', titleHi: 'GPS नेविगेशन', description: 'One-tap directions to stranded rider', descriptionHi: 'फंसे राइडर तक एक टैप में दिशा-निर्देश' },
      { title: 'First 5 Advantage', titleHi: 'पहले 5 का फायदा', description: 'Be among first 5 to get phone number', descriptionHi: 'फोन नंबर पाने के लिए पहले 5 में रहें' },
      { title: 'Trust Score', titleHi: 'ट्रस्ट स्कोर', description: 'Good reviews increase your score', descriptionHi: 'अच्छी समीक्षा से आपका स्कोर बढ़ता है' }
    ]
  },

  // 5. Fuel/Petrol
  'fuel-empty': {
    story: {
      title: 'Emergency Fuel Delivery',
      titleHi: 'आपातकालीन ईंधन डिलीवरी',
      intro: 'A 5L jerry can and your bike/scooter can save stranded drivers! Many people run out of fuel and need emergency help.',
      introHi: 'एक 5L जेरी कैन और आपकी बाइक/स्कूटी फंसे हुए ड्राइवरों को बचा सकती है! कई लोगों का ईंधन खत्म हो जाता है और उन्हें आपातकालीन मदद चाहिए।',
      income: 'Earn ₹100-300 per delivery',
      incomeHi: 'प्रति डिलीवरी ₹100-300 कमाएं',
      incomeRange: '₹100 - ₹300/help',
      demand: 'Every day 20-50 people run out of fuel in city',
      demandHi: 'हर दिन शहर में 20-50 लोगों का ईंधन खत्म होता है'
    },
    steps: [
      { step: 1, title: 'Get Equipment', titleHi: 'सामान प्राप्त करें', description: 'Buy 5L jerry can (₹300-500), keep at home with fuel', descriptionHi: '5L जेरी कैन (₹300-500) खरीदें, घर पर ईंधन के साथ रखें', icon: '⛽', tip: 'Use only approved fuel containers', tipHi: 'केवल मंजूरी प्राप्त ईंधन कंटेनर का उपयोग करें' },
      { step: 2, title: 'Watch for Requests', titleHi: 'अनुरोध देखें', description: 'Enable alerts, check app for nearby fuel requests', descriptionHi: 'अलर्ट चालू करें, पास के ईंधन अनुरोधों के लिए ऐप चेक करें', icon: '📱', tip: 'Quick response is key', tipHi: 'तेज़ प्रतिक्रिया महत्वपूर्ण है' },
      { step: 3, title: 'Fill & Go', titleHi: 'भरें और जाएं', description: 'Fill jerry can from nearest pump, ride to location', descriptionHi: 'निकटतम पंप से जेरी कैन भरें, स्थान पर जाएं', icon: '🏍️', tip: 'Get receipt for fuel price proof', tipHi: 'ईंधन मूल्य प्रमाण के लिए रसीद लें' },
      { step: 4, title: 'Deliver Safely', titleHi: 'सुरक्षित रूप से पहुंचाएं', description: 'Pour fuel carefully, help restart vehicle if needed', descriptionHi: 'ईंधन ध्यान से डालें, जरूरत हो तो वाहन फिर से शुरू करने में मदद करें', icon: '🚗', tip: 'Stand upwind when pouring', tipHi: 'डालते समय हवा की दिशा में खड़े रहें' },
      { step: 5, title: 'Collect Payment', titleHi: 'भुगतान लें', description: 'Fuel cost + ₹50-100 service charge', descriptionHi: 'ईंधन लागत + ₹50-100 सेवा शुल्क', icon: '💵', tip: 'Accept UPI for easy payment', tipHi: 'आसान भुगतान के लिए UPI स्वीकार करें' }
    ],
    resources: [
      { name: 'Jerry Can 5L', nameHi: 'जेरी कैन 5L', icon: '⛽', income: '₹100-200/delivery', difficulty: 'Low' },
      { name: 'Jerry Can 10L', nameHi: 'जेरी कैन 10L', icon: '⛽', income: '₹150-300/delivery', difficulty: 'Medium' },
      { name: 'Funnel', nameHi: 'फ़नल', icon: '🛢️', income: 'Included', difficulty: 'Very Low' },
      { name: 'Bike/Scooter', nameHi: 'बाइक/स्कूटर', icon: '🏍️', income: 'Your vehicle', difficulty: 'Required' },
      { name: 'Fuel Container', nameHi: 'ईंधन कंटेनर', icon: '🛢️', income: '₹50-100/help', difficulty: 'Low' },
      { name: 'Emergency Kit', nameHi: 'आपातकालीन किट', icon: '🚨', income: 'Bonus for full service', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Location Pinning', titleHi: 'लोकेशन पिनिंग', description: 'Exact GPS location of stranded vehicle', descriptionHi: 'फंसे हुए वाहन का सही GPS स्थान' },
      { title: 'Fuel Calculator', titleHi: 'ईंधन कैलकुलेटर', description: 'App estimates fuel needed based on vehicle', descriptionHi: 'ऐप वाहन के आधार पर आवश्यक ईंधन का अनुमान लगाता है' },
      { title: 'Safe Meeting', titleHi: 'सुरक्षित मिलना', description: 'Meet at landmark locations', descriptionHi: 'लैंडमार्क स्थानों पर मिलें' },
      { title: 'Payment Security', titleHi: 'भुगतान सुरक्षा', description: 'Digital payment tracking', descriptionHi: 'डिजिटल भुगतान ट्रैकिंग' }
    ]
  },

  // 6. Car Breakdown
  'car-breakdown': {
    story: {
      title: 'Car Breakdown Assistance',
      titleHi: 'कार ब्रेकडाउन सहायता',
      intro: 'Basic car tools and knowledge can help stranded drivers! Jump start, tire change, minor repairs - all in demand.',
      introHi: 'बुनियादी कार टूल्स और ज्ञान फंसे हुए ड्राइवरों की मदद कर सकते हैं! जंप स्टार्ट, टायर बदलना, मामूली मरम्मत - सभी की मांग है।',
      income: 'Earn ₹200-1000 per help',
      incomeHi: 'प्रति मदद ₹200-1000 कमाएं',
      incomeRange: '₹200 - ₹1,000/help',
      demand: 'Daily 30-50 car breakdowns in city',
      demandHi: 'शहर में रोज़ 30-50 कारें खराब होती हैं'
    },
    steps: [
      { step: 1, title: 'Carry Basic Tools', titleHi: 'बुनियादी टूल्स रखें', description: 'Jack, wheel spanner, jump cables, basic toolkit, flashlight', descriptionHi: 'जैक, व्हील स्पैनर, जंप केबल, बेसिक टूलकिट, टॉर्च', icon: '🔧', tip: 'Learn basic car troubleshooting', tipHi: 'बुनियादी कार समस्या समाधान सीखें' },
      { step: 2, title: 'Get Alert', titleHi: 'अलर्ट पाएं', description: 'See breakdown requests nearby, check issue type', descriptionHi: 'पास के ब्रेकडाउन अनुरोध देखें, समस्या का प्रकार जांचें', icon: '🔔', tip: 'Specialize in 1-2 areas', tipHi: '1-2 क्षेत्रों में विशेषज्ञ बनें' },
      { step: 3, title: 'Reach & Diagnose', titleHi: 'पहुंचें और पहचानें', description: 'Reach location, understand the problem, explain solution', descriptionHi: 'स्थान पर पहुंचें, समस्या समझें, समाधान समझाएं', icon: '🔍', tip: 'First 5 helpers get phone number', tipHi: 'पहले 5 मददगारों को फोन नंबर मिलता है' },
      { step: 4, title: 'Fix Issue', titleHi: 'समस्या ठीक करें', description: 'Jump start battery, change tire, fix minor issues', descriptionHi: 'बैटरी जंप स्टार्ट करें, टायर बदलें, छोटी समस्याएं ठीक करें', icon: '🚗', tip: 'Carry spare fuses and bulbs', tipHi: 'स्पेयर फ्यूज और बल्ब रखें' },
      { step: 5, title: 'Payment & Review', titleHi: 'भुगतान और समीक्षा', description: 'Charge based on effort, get rated, build trust', descriptionHi: 'मेहनत के आधार पर शुल्क लें, रेटिंग पाएं, विश्वास बनाएं', icon: '⭐', tip: 'Good service = tips and referrals', tipHi: 'अच्छी सेवा = टिप्स और रेफरल' }
    ],
    resources: [
      { name: 'Jump Start Cables', nameHi: 'जंप स्टार्ट केबल', icon: '⚡', income: '₹200-400/start', difficulty: 'Low' },
      { name: 'Car Jack + Spanner', nameHi: 'कार जैक + स्पैनर', icon: '🚙', income: '₹200-500/tire', difficulty: 'Medium' },
      { name: 'OBD Scanner', nameHi: 'OBD स्कैनर', icon: '📊', income: '₹100-200/diagnose', difficulty: 'High' },
      { name: 'Basic Toolkit', nameHi: 'बेसिक टूलकिट', icon: '🧰', income: '₹100-300/help', difficulty: 'Medium' },
      { name: 'Tow Rope', nameHi: 'टो रोप', icon: '🔗', income: '₹300-500/tow', difficulty: 'Medium' },
      { name: 'Air Compressor', nameHi: 'एयर कंप्रेसर', icon: '💨', income: '₹50-100/fill', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Issue Categories', titleHi: 'समस्या श्रेणियां', description: 'Filter by breakdown type you can help', descriptionHi: 'आप जिस ब्रेकडाउन प्रकार की मदद कर सकते हैं उसके अनुसार फ़िल्टर करें' },
      { title: 'Navigation Help', titleHi: 'नेविगेशन मदद', description: 'GPS directions to breakdown spot', descriptionHi: 'ब्रेकडाउन स्थान तक GPS दिशा-निर्देश' },
      { title: 'Service History', titleHi: 'सेवा इतिहास', description: 'Track your helps and earnings', descriptionHi: 'अपनी मदद और कमाई ट्रैक करें' },
      { title: 'Expert Badge', titleHi: 'विशेषज्ञ बैज', description: 'Get certified for specific repairs', descriptionHi: 'विशिष्ट मरम्मत के लिए प्रमाणित हों' }
    ]
  },

  // ========== BANK & OFFICE (Row 3) ==========

  // 7. Bank Queue
  'bank-queue': {
    story: {
      title: 'Bank Queue Standing Service',
      titleHi: 'बैंक लाइन में खड़े होने की सेवा',
      intro: 'Your free time can help busy professionals! Stand in bank queues and earn ₹200-500 per task.',
      introHi: 'आपका खाली समय व्यस्त पेशेवरों की मदद कर सकता है! बैंक की लाइनों में खड़े हों और प्रति काम ₹200-500 कमाएं।',
      income: 'Earn ₹200-500 per task',
      incomeHi: 'प्रति काम ₹200-500 कमाएं',
      incomeRange: '₹200 - ₹500/task',
      demand: 'High demand - many can\'t take leave',
      demandHi: 'उच्च मांग - कई लोग छुट्टी नहीं ले सकते'
    },
    steps: [
      { step: 1, title: 'Share Availability', titleHi: 'उपलब्धता साझा करें', description: 'Update your free hours on app (morning/afternoon)', descriptionHi: 'अपने खाली घंटे ऐप पर अपडेट करें (सुबह/दोपहर)', icon: '🕐', tip: 'More availability = more work', tipHi: 'ज़्यादा उपलब्धता = ज़्यादा काम' },
      { step: 2, title: 'Accept Task', titleHi: 'काम स्वीकार करें', description: 'See queue tasks near you, accept before others', descriptionHi: 'अपने पास के कतार काम देखें, दूसरों से पहले स्वीकार करें', icon: '✅', tip: 'First 5 to accept get phone number', tipHi: 'स्वीकार करने वाले पहले 5 को फोन नंबर मिलता है' },
      { step: 3, title: 'Reach Bank Early', titleHi: 'जल्दी बैंक पहुंचें', description: 'Arrive 15 min before, get token, stand in queue', descriptionHi: '15 मिनट पहले पहुंचें, टोकन लें, लाइन में खड़े हों', icon: '🏦', tip: 'Carry water and phone charger', tipHi: 'पानी और फोन चार्जर रखें' },
      { step: 4, title: 'Keep Client Updated', titleHi: 'क्लाइंट को अपडेट रखें', description: 'Send queue position updates, call when near counter', descriptionHi: 'लाइन की स्थिति भेजें, काउंटर पास आने पर कॉल करें', icon: '📱', tip: 'Share live location for trust', tipHi: 'विश्वास के लिए लाइव लोकेशन शेयर करें' },
      { step: 5, title: 'Complete & Get Paid', titleHi: 'पूरा करें और पैसे पाएं', description: 'Hand over token to client or complete their work', descriptionHi: 'क्लाइंट को टोकन दें या उनका काम पूरा करें', icon: '💰', tip: 'Ask for good review', tipHi: 'अच्छी समीक्षा मांगें' }
    ],
    resources: [
      { name: 'Your Free Time', nameHi: 'आपका खाली समय', icon: '⏰', income: '₹200-500/task', difficulty: 'Very Low' },
      { name: 'Mobile Phone', nameHi: 'मोबाइल फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Water Bottle', nameHi: 'पानी की बोतल', icon: '💧', income: 'Comfort', difficulty: 'Very Low' },
      { name: 'Portable Charger', nameHi: 'पोर्टेबल चार्जर', icon: '🔋', income: '₹500 savings', difficulty: 'Low' },
      { name: 'Umbrella', nameHi: 'छाता', icon: '☂️', income: 'Weather protection', difficulty: 'Very Low' },
      { name: 'Book/Music', nameHi: 'किताब/संगीत', icon: '📚', income: 'Time pass', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Task Matching', titleHi: 'काम मिलान', description: 'App matches your availability with tasks', descriptionHi: 'ऐप आपकी उपलब्धता को काम से मिलाता है' },
      { title: 'Live Updates', titleHi: 'लाइव अपडेट', description: 'Send queue position to client', descriptionHi: 'क्लाइंट को कतार की स्थिति भेजें' },
      { title: 'Secure Payment', titleHi: 'सुरक्षित भुगतान', description: 'Payment tracked through app', descriptionHi: 'ऐप के माध्यम से भुगतान ट्रैक किया गया' },
      { title: 'Trust Building', titleHi: 'विश्वास निर्माण', description: 'Good reviews = more tasks', descriptionHi: 'अच्छी समीक्षा = ज़्यादा काम' }
    ]
  },

  // 8. Govt Office
  'govt-office': {
    story: {
      title: 'Government Office Work Help',
      titleHi: 'सरकारी कार्यालय काम में मदद',
      intro: 'Many people struggle with govt office procedures. If you know the process, help them and earn!',
      introHi: 'कई लोग सरकारी कार्यालय की प्रक्रियाओं में परेशानी महसूस करते हैं। अगर आप प्रक्रिया जानते हैं, तो मदद करें और कमाएं!',
      income: 'Earn ₹300-800 per task',
      incomeHi: 'प्रति काम ₹300-800 कमाएं',
      incomeRange: '₹300 - ₹800/task',
      demand: 'Very high - complex procedures confuse people',
      demandHi: 'बहुत ज़्यादा - जटिल प्रक्रियाएं लोगों को परेशान करती हैं'
    },
    steps: [
      { step: 1, title: 'Know the Process', titleHi: 'प्रक्रिया जानें', description: 'Learn procedures for RTO, Passport, Aadhaar, ration card etc.', descriptionHi: 'RTO, पासपोर्ट, आधार, राशन कार्ड आदि की प्रक्रियाएं सीखें', icon: '📚', tip: 'Specialize in 1-2 offices', tipHi: '1-2 कार्यालयों में विशेषज्ञ बनें' },
      { step: 2, title: 'List Your Expertise', titleHi: 'अपनी विशेषज्ञता पोस्ट करें', description: 'Mark which offices and work types you can help with', descriptionHi: 'चिह्नित करें कि किन कार्यालयों और कामों में मदद कर सकते हैं', icon: '✅', tip: 'Add your success stories', tipHi: 'अपनी सफलता की कहानियां जोड़ें' },
      { step: 3, title: 'Guide Client', titleHi: 'क्लाइंट का मार्गदर्शन करें', description: 'Tell them documents needed, best time to visit, fees', descriptionHi: 'उन्हें आवश्यक दस्तावेज़, जाने का सही समय, फीस बताएं', icon: '📋', tip: 'Create document checklist', tipHi: 'दस्तावेज़ चेकलिस्ट बनाएं' },
      { step: 4, title: 'Accompany if Needed', titleHi: 'जरूरत हो तो साथ जाएं', description: 'Go with client to office, help navigate the process', descriptionHi: 'क्लाइंट के साथ कार्यालय जाएं, प्रक्रिया में मदद करें', icon: '🏛️', tip: 'Know the right officers/counter', tipHi: 'सही अधिकारियों/काउंटर को जानें' },
      { step: 5, title: 'Complete Task', titleHi: 'काम पूरा करें', description: 'Help till work is done, get paid and rated', descriptionHi: 'काम होने तक मदद करें, भुगतान और रेटिंग पाएं', icon: '💰', tip: 'Follow up if needed', tipHi: 'जरूरत हो तो फॉलो-अप करें' }
    ],
    resources: [
      { name: 'Process Knowledge', nameHi: 'प्रक्रिया ज्ञान', icon: '🧠', income: '₹300-800/task', difficulty: 'Medium' },
      { name: 'Document Templates', nameHi: 'दस्तावेज़ टेम्पलेट', icon: '📄', income: '₹50-100/template', difficulty: 'Low' },
      { name: 'Office Contacts', nameHi: 'कार्यालय संपर्क', icon: '📞', income: 'Speed bonus', difficulty: 'Medium' },
      { name: 'Time Availability', nameHi: 'समय उपलब्धता', icon: '⏰', income: '₹200-500/task', difficulty: 'Very Low' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹100-200/trip', difficulty: 'Low' },
      { name: 'Mobile & Internet', nameHi: 'मोबाइल और इंटरनेट', icon: '📱', income: 'Required', difficulty: 'Required' }
    ],
    appHelp: [
      { title: 'Expert Matching', titleHi: 'विशेषज्ञ मिलान', description: 'App matches clients with your expertise', descriptionHi: 'ऐप क्लाइंट को आपकी विशेषज्ञता से मिलाता है' },
      { title: 'Document Checklist', titleHi: 'दस्तावेज़ चेकलिस्ट', description: 'Share digital checklists with clients', descriptionHi: 'क्लाइंट के साथ डिजिटल चेकलिस्ट साझा करें' },
      { title: 'Progress Updates', titleHi: 'प्रगति अपडेट', description: 'Keep client informed about task status', descriptionHi: 'क्लाइंट को काम की स्थिति के बारे में सूचित करें' },
      { title: 'Verified Helper Badge', titleHi: 'वेरिफाइड हेल्पर बैज', description: 'Get certified for specific offices', descriptionHi: 'विशिष्ट कार्यालयों के लिए प्रमाणित हों' }
    ]
  },

  // 9. Form Filling
  'form-filling': {
    story: {
      title: 'Form Filling & Documentation Help',
      titleHi: 'फॉर्म भरने और दस्तावेज़ीकरण में मदद',
      intro: 'Many people struggle with online/offline forms. Help them fill applications correctly and earn!',
      introHi: 'कई लोग ऑनलाइन/ऑफलाइन फॉर्म से परेशान रहते हैं। उन्हें सही तरीके से आवेदन भरने में मदद करें और कमाएं!',
      income: 'Earn ₹100-500 per form',
      incomeHi: 'प्रति फॉर्म ₹100-500 कमाएं',
      incomeRange: '₹100 - ₹500/form',
      demand: 'Daily 100s of forms need filling',
      demandHi: 'रोज़ सैकड़ों फॉर्म भरने की जरूरत'
    },
    steps: [
      { step: 1, title: 'Know Form Types', titleHi: 'फॉर्म प्रकार जानें', description: 'Learn forms: Aadhaar, PAN, passport, bank, ration, scholarship', descriptionHi: 'फॉर्म सीखें: आधार, PAN, पासपोर्ट, बैंक, राशन, छात्रवृत्ति', icon: '📝', tip: 'Start with simple forms', tipHi: 'सरल फॉर्म से शुरू करें' },
      { step: 2, title: 'Advertise Skills', titleHi: 'कौशल प्रचारित करें', description: 'List which forms you can help with on app', descriptionHi: 'ऐप पर चिह्नित करें कि किन फॉर्म में मदद कर सकते हैं', icon: '📋', tip: 'Mention languages you know', tipHi: 'जो भाषाएं जानते हैं उनका उल्लेख करें' },
      { step: 3, title: 'Collect Documents', titleHi: 'दस्तावेज़ एकत्र करें', description: 'Ask client for required documents (photo, ID, address proof)', descriptionHi: 'क्लाइंट से आवश्यक दस्तावेज़ मांगें (फोटो, ID, पता प्रमाण)', icon: '📄', tip: 'Create document checklist', tipHi: 'दस्तावेज़ चेकलिस्ट बनाएं' },
      { step: 4, title: 'Fill Form Correctly', titleHi: 'फॉर्म सही भरें', description: 'Enter details carefully, double-check all information', descriptionHi: 'विवरण ध्यान से दर्ज करें, सभी जानकारी डबल-चेक करें', icon: '✍️', tip: 'Read form to client before submission', tipHi: 'जमा करने से पहले फॉर्म क्लाइंट को पढ़कर सुनाएं' },
      { step: 5, title: 'Submit & Track', titleHi: 'जमा करें और ट्रैक करें', description: 'Submit form, share acknowledgment, track status', descriptionHi: 'फॉर्म जमा करें, पावती साझा करें, स्थिति ट्रैक करें', icon: '✅', tip: 'Offer follow-up service', tipHi: 'फॉलो-अप सेवा की पेशकश करें' }
    ],
    resources: [
      { name: 'Laptop/Computer', nameHi: 'लैपटॉप/कंप्यूटर', icon: '💻', income: 'Required for online forms', difficulty: 'Required' },
      { name: 'Printer + Scanner', nameHi: 'प्रिंटर + स्कैनर', icon: '🖨️', income: '₹50-100/form', difficulty: 'Medium' },
      { name: 'Internet Connection', nameHi: 'इंटरनेट कनेक्शन', icon: '📶', income: 'Required', difficulty: 'Required' },
      { name: 'Pen & Stationery', nameHi: 'पेन और स्टेशनरी', icon: '🖊️', income: '₹20-50/form', difficulty: 'Very Low' },
      { name: 'Document Folder', nameHi: 'दस्तावेज़ फोल्डर', icon: '📁', income: 'Professional look', difficulty: 'Very Low' },
      { name: 'Knowledge Base', nameHi: 'ज्ञान आधार', icon: '📚', income: '₹200-500/form', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Form Templates', titleHi: 'फॉर्म टेम्पलेट', description: 'Access common form templates', descriptionHi: 'सामान्य फॉर्म टेम्पलेट तक पहुंच' },
      { title: 'Document Checklist', titleHi: 'दस्तावेज़ चेकलिस्ट', description: 'Auto-generate required documents list', descriptionHi: 'आवश्यक दस्तावेज़ सूची स्वतः उत्पन्न करें' },
      { title: 'Language Support', titleHi: 'भाषा समर्थन', description: 'Forms available in multiple languages', descriptionHi: 'फॉर्म कई भाषाओं में उपलब्ध' },
      { title: 'Status Tracking', titleHi: 'स्थिति ट्रैकिंग', description: 'Track form submission status', descriptionHi: 'फॉर्म जमा स्थिति ट्रैक करें' }
    ]
  },

  // ========== PHONE & TECH (Row 4) ==========

  // 10. Phone Battery
  'phone-battery': {
    story: {
      title: 'Phone Charging Service',
      titleHi: 'फोन चार्जिंग सेवा',
      intro: 'A power bank (₹500-1500) can save someone\'s day and earn you money! Very easy to start.',
      introHi: 'एक पावर बैंक (₹500-1500) किसी का दिन बचा सकता है और आपको पैसे कमा सकता है! शुरू करना बहुत आसान है।',
      income: 'Earn ₹20-50 per charge',
      incomeHi: 'प्रति चार्ज ₹20-50 कमाएं',
      incomeRange: '₹20 - ₹50/charge',
      demand: 'Everyone needs phone - daily demand!',
      demandHi: 'सबको फोन चाहिए - रोज़ मांग!'
    },
    steps: [
      { step: 1, title: 'Get Power Bank', titleHi: 'पावर बैंक लें', description: 'Buy 10000-20000mAh power bank (₹500-1500)', descriptionHi: '10000-20000mAh पावर बैंक खरीदें (₹500-1500)', icon: '🔋', tip: 'Keep multiple cables - Type-C, iPhone, Micro', tipHi: 'कई केबल रखें - Type-C, iPhone, Micro' },
      { step: 2, title: 'Stay Charged', titleHi: 'चार्ज रखें', description: 'Keep power bank fully charged, carry extra cables', descriptionHi: 'पावर बैंक पूरी तरह चार्ज रखें, अतिरिक्त केबल रखें', icon: '⚡', tip: 'Check charge level before leaving home', tipHi: 'घर से निकलने से पहले चार्ज स्तर चेक करें' },
      { step: 3, title: 'Find Customers', titleHi: 'ग्राहक खोजें', description: 'Check app for nearby charging requests, or stay in public areas', descriptionHi: 'पास के चार्जिंग अनुरोधों के लिए ऐप चेक करें, या सार्वजनिक क्षेत्रों में रहें', icon: '📱', tip: 'Mark your spot on app for visibility', tipHi: 'दृश्यता के लिए अपनी जगह ऐप पर चिह्नित करें' },
      { step: 4, title: 'Charge Phone', titleHi: 'फोन चार्ज करें', description: 'Give your power bank, let them charge to 20-50%', descriptionHi: 'अपना पावर बैंक दें, उन्हें 20-50% तक चार्ज करने दें', icon: '🔌', tip: 'Stay nearby while charging', tipHi: 'चार्जिंग के दौरान पास रहें' },
      { step: 5, title: 'Get Paid', titleHi: 'पैसे पाएं', description: 'Charge ₹20-50 based on charge given, accept UPI', descriptionHi: 'दिए गए चार्ज के आधार पर ₹20-50 लें, UPI स्वीकार करें', icon: '💵', tip: 'Great for students and part-timers', tipHi: 'छात्रों और पार्ट-टाइमर्स के लिए बढ़िया' }
    ],
    resources: [
      { name: 'Power Bank 10000mAh', nameHi: 'पावर बैंक 10000mAh', icon: '🔋', income: '₹30-50/charge', difficulty: 'Very Low' },
      { name: 'Power Bank 20000mAh', nameHi: 'पावर बैंक 20000mAh', icon: '🔋', income: '₹40-70/charge', difficulty: 'Low' },
      { name: 'Type-C Cable', nameHi: 'Type-C केबल', icon: '🔌', income: '₹10-20/use', difficulty: 'Very Low' },
      { name: 'iPhone Cable', nameHi: 'iPhone केबल', icon: '🍎', income: '₹15-25/use', difficulty: 'Very Low' },
      { name: 'Multi-Charging Cable', nameHi: 'मल्टी-चार्जिंग केबल', icon: '🔌', income: 'All phones supported', difficulty: 'Very Low' },
      { name: 'Car Charger', nameHi: 'कार चार्जर', icon: '🚗', income: '₹20-40/charge', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Location Sharing', titleHi: 'लोकेशन शेयरिंग', description: 'Show your spot to people needing charge', descriptionHi: 'चार्ज चाहिए लोगों को अपनी जगह दिखाएं' },
      { title: 'Quick Alerts', titleHi: 'जल्दी अलर्ट', description: 'Get notified when someone nearby needs charge', descriptionHi: 'जब पास में किसी को चार्ज चाहिए सूचना पाएं' },
      { title: 'Safe Spots', titleHi: 'सुरक्षित जगहें', description: 'Meet at verified public locations', descriptionHi: 'सत्यापित सार्वजनिक स्थानों पर मिलें' },
      { title: 'Earnings Tracker', titleHi: 'कमाई ट्रैकर', description: 'Track your daily charging income', descriptionHi: 'अपनी दैनिक चार्जिंग आय ट्रैक करें' }
    ]
  },

  // 11. No Internet/Hotspot
  'no-internet': {
    story: {
      title: 'Internet Hotspot Sharing',
      titleHi: 'इंटरनेट हॉटस्पॉट शेयरिंग',
      intro: 'Share your mobile data and earn! Many people need urgent internet for payments, calls, or work.',
      introHi: 'अपना मोबाइल डेटा शेयर करें और कमाएं! कई लोगों को भुगतान, कॉल या काम के लिए जल्दी इंटरनेट चाहिए।',
      income: 'Earn ₹20-100 per session',
      incomeHi: 'प्रति सत्र ₹20-100 कमाएं',
      incomeRange: '₹20 - ₹100/session',
      demand: 'High - people often run out of data',
      demandHi: 'उच्च - लोग अक्सर डेटा खत्म कर देते हैं'
    },
    steps: [
      { step: 1, title: 'Have Good Data Plan', titleHi: 'अच्छा डेटा प्लान रखें', description: 'Get unlimited or high data plan (1GB+/day)', descriptionHi: 'अनलिमिटेड या हाई डेटा प्लान लें (1GB+/दिन)', icon: '📶', tip: 'Check data balance before sharing', tipHi: 'शेयर करने से पहले डेटा बैलेंस चेक करें' },
      { step: 2, title: 'Mark Availability', titleHi: 'उपलब्धता चिह्नित करें', description: 'Show on app that you can share hotspot', descriptionHi: 'ऐप पर दिखाएं कि आप हॉटस्पॉट शेयर कर सकते हैं', icon: '📍', tip: 'Stay in areas with good signal', tipHi: 'अच्छे सिग्नल वाले क्षेत्रों में रहें' },
      { step: 3, title: 'Share Securely', titleHi: 'सुरक्षित रूप से शेयर करें', description: 'Turn on hotspot, share password, set time limit', descriptionHi: 'हॉटस्पॉट चालू करें, पासवर्ड शेयर करें, समय सीमा तय करें', icon: '📱', tip: 'Use strong password, change after each user', tipHi: 'मजबूत पासवर्ड, हर यूजर के बाद बदलें' },
      { step: 4, title: 'Monitor Usage', titleHi: 'उपयोग मॉनिटर करें', description: 'Keep track of data shared, end session after agreed limit', descriptionHi: 'शेयर किए गए डेटा को ट्रैक करें, सहमत सीमा के बाद सत्र समाप्त करें', icon: '📊', tip: 'Set hotspot to disconnect after inactivity', tipHi: 'निष्क्रियता के बाद हॉटस्पॉट डिसकनेक्ट करने के लिए सेट करें' },
      { step: 5, title: 'Get Payment', titleHi: 'भुगतान पाएं', description: 'Charge ₹20-100 based on time/data shared', descriptionHi: 'साझा किए गए समय/डेटा के आधार पर ₹20-100 लें', icon: '💵', tip: '₹10 per 100MB is fair rate', tipHi: '₹10 प्रति 100MB उचित दर है' }
    ],
    resources: [
      { name: 'Mobile Data Plan', nameHi: 'मोबाइल डेटा प्लान', icon: '📶', income: '₹20-100/session', difficulty: 'Very Low' },
      { name: 'Smartphone with Hotspot', nameHi: 'हॉटस्पॉट वाला स्मार्टफोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Power Bank', nameHi: 'पावर बैंक', icon: '🔋', income: 'Keep phone charged', difficulty: 'Low' },
      { name: 'Good Signal Area', nameHi: 'अच्छा सिग्नल क्षेत्र', icon: '📍', income: 'Better speed = more customers', difficulty: 'Very Low' },
      { name: '4G/5G Phone', nameHi: '4G/5G फोन', icon: '📱', income: 'Faster speed = higher rate', difficulty: 'Low' },
      { name: 'Dual SIM', nameHi: 'डुअल SIM', icon: '📞', income: 'Backup network', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Data Calculator', titleHi: 'डेटा कैलकुलेटर', description: 'Calculate fair price based on data shared', descriptionHi: 'साझा किए गए डेटा के आधार पर उचित मूल्य की गणना करें' },
      { title: 'Secure Sharing', titleHi: 'सुरक्षित शेयरिंग', description: 'App helps generate secure passwords', descriptionHi: 'ऐप सुरक्षित पासवर्ड बनाने में मदद करता है' },
      { title: 'Time Tracking', titleHi: 'समय ट्रैकिंग', description: 'Track session duration and data used', descriptionHi: 'सत्र अवधि और उपयोग किए गए डेटा को ट्रैक करें' },
      { title: 'Rating System', titleHi: 'रेटिंग सिस्टम', description: 'Build trust through good reviews', descriptionHi: 'अच्छी समीक्षाओं से विश्वास बनाएं' }
    ]
  },

  // 12. Laptop Issue
  'laptop-issue': {
    story: {
      title: 'Laptop & Tech Support',
      titleHi: 'लैपटॉप और टेक सपोर्ट',
      intro: 'Basic tech knowledge can help many people! Software issues, password reset, printer setup, WiFi problems - all in demand.',
      introHi: 'बुनियादी तकनीकी ज्ञान कई लोगों की मदद कर सकता है! सॉफ्टवेयर समस्याएं, पासवर्ड रीसेट, प्रिंटर सेटअप, WiFi समस्याएं - सभी की मांग है।',
      income: 'Earn ₹200-1000 per help',
      incomeHi: 'प्रति मदद ₹200-1000 कमाएं',
      incomeRange: '₹200 - ₹1,000/help',
      demand: 'Very high - many non-tech people need help',
      demandHi: 'बहुत ज़्यादा - कई गैर-तकनीकी लोगों को मदद चाहिए'
    },
    steps: [
      { step: 1, title: 'Know Basic Tech', titleHi: 'बेसिक टेक जानें', description: 'Learn: Windows/Mac basics, common errors, software installation', descriptionHi: 'सीखें: Windows/Mac basics, आम एरर्स, सॉफ्टवेयर इंस्टॉलेशन', icon: '💻', tip: 'YouTube has free tutorials', tipHi: 'YouTube पर मुफ्त ट्यूटोरियल हैं' },
      { step: 2, title: 'List Your Skills', titleHi: 'अपने कौशल पोस्ट करें', description: 'Mark which tech issues you can solve on app', descriptionHi: 'ऐप पर चिह्नित करें कि किन तकनीकी समस्याओं को हल कर सकते हैं', icon: '🔧', tip: 'Specialize in 2-3 areas', tipHi: '2-3 क्षेत्रों में विशेषज्ञ बनें' },
      { step: 3, title: 'Diagnose Issue', titleHi: 'समस्या पहचानें', description: 'Understand the problem, ask right questions', descriptionHi: 'समस्या समझें, सही सवाल पूछें', icon: '🔍', tip: 'Ask for screenshots or error messages', tipHi: 'स्क्रीनशॉट या एरर मैसेज मांगें' },
      { step: 4, title: 'Fix the Problem', titleHi: 'समस्या ठीक करें', description: 'Remote help via call or visit in person', descriptionHi: 'कॉल से रिमोट मदद या व्यक्तिगत रूप से जाएं', icon: '🛠️', tip: 'Carry bootable USB with tools', tipHi: 'टूल्स के साथ बूटेबल USB रखें' },
      { step: 5, title: 'Document & Get Paid', titleHi: 'दस्तावेज़ और भुगतान', description: 'Explain what was wrong, how to avoid, get payment', descriptionHi: 'बताएं क्या गलत था, कैसे बचें, भुगतान पाएं', icon: '💰', tip: 'Give tips to prevent future issues', tipHi: 'भविष्य की समस्याओं को रोकने के टिप्स दें' }
    ],
    resources: [
      { name: 'Tech Knowledge', nameHi: 'तकनीकी ज्ञान', icon: '🧠', income: '₹200-1000/help', difficulty: 'Medium' },
      { name: 'Bootable USB', nameHi: 'बूटेबल USB', icon: '💾', income: '₹100-300/repair', difficulty: 'Medium' },
      { name: 'Screwdriver Set', nameHi: 'स्क्रूड्राइवर सेट', icon: '🔧', income: '₹200-500/hardware', difficulty: 'Medium' },
      { name: 'External Hard Drive', nameHi: 'एक्सटर्नल हार्ड ड्राइव', icon: '💿', income: '₹100-200/backup', difficulty: 'Low' },
      { name: 'Software Tools', nameHi: 'सॉफ्टवेयर टूल्स', icon: '💿', income: 'Free', difficulty: 'Low' },
      { name: 'Remote Desktop App', nameHi: 'रिमोट डेस्कटॉप ऐप', icon: '🖥️', income: 'Work from home', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Skill Matching', titleHi: 'कौशल मिलान', description: 'App matches problems with your expertise', descriptionHi: 'ऐप समस्याओं को आपकी विशेषज्ञता से मिलाता है' },
      { title: 'Remote Help', titleHi: 'रिमोट मदद', description: 'Secure screen sharing through app', descriptionHi: 'ऐप के माध्यम से सुरक्षित स्क्रीन शेयरिंग' },
      { title: 'Problem Templates', titleHi: 'समस्या टेम्पलेट', description: 'Common solutions ready to share', descriptionHi: 'सामान्य समाधान साझा करने के लिए तैयार' },
      { title: 'Certification', titleHi: 'प्रमाणन', description: 'Get verified for specific tech skills', descriptionHi: 'विशिष्ट तकनीकी कौशल के लिए सत्यापित हों' }
    ]
  },

  // ========== MEDICAL & HEALTH (Row 5) ==========

  // 13. Medicine Delivery
  'medicine-delivery': {
    story: {
      title: 'Medicine Delivery Service',
      titleHi: 'दवाई डिलीवरी सेवा',
      intro: 'Help elderly and sick people get medicines delivered! A simple bike/scooter and you can earn ₹50-200 per delivery.',
      introHi: 'बुजुर्गों और बीमार लोगों को दवाई पहुंचाने में मदद करें! एक साधारण बाइक/स्कूटर और आप प्रति डिलीवरी ₹50-200 कमा सकते हैं।',
      income: 'Earn ₹50-200 per delivery',
      incomeHi: 'प्रति डिलीवरी ₹50-200 कमाएं',
      incomeRange: '₹50 - ₹200/delivery',
      demand: 'Very high - elderly and sick people need daily',
      demandHi: 'बहुत ज़्यादा - बुजुर्गों और बीमार लोगों को रोज़ चाहिए'
    },
    steps: [
      { step: 1, title: 'Get Delivery Request', titleHi: 'डिलीवरी अनुरोध पाएं', description: 'See medicine delivery requests nearby on app', descriptionHi: 'ऐप पर पास के दवाई डिलीवरी अनुरोध देखें', icon: '💊', tip: 'Quick response wins the job', tipHi: 'तेज़ प्रतिक्रिया से काम मिलता है' },
      { step: 2, title: 'Get Prescription', titleHi: 'प्रिस्क्रिप्शन लें', description: 'Collect prescription photo or list from client', descriptionHi: 'क्लाइंट से प्रिस्क्रिप्शन फोटो या सूची लें', icon: '📄', tip: 'Check for pharmacy location preference', tipHi: 'फार्मेसी स्थान पसंद चेक करें' },
      { step: 3, title: 'Buy Medicines', titleHi: 'दवाई खरीदें', description: 'Go to medical store, buy exact medicines, get bill', descriptionHi: 'मेडिकल स्टोर जाएं, सही दवाई खरीदें, बिल लें', icon: '🏪', tip: 'Check expiry dates', tipHi: 'एक्सपायरी डेट चेक करें' },
      { step: 4, title: 'Deliver Carefully', titleHi: 'सावधानी से पहुंचाएं', description: 'Reach address, hand over medicines with bill', descriptionHi: 'पते पर पहुंचें, बिल के साथ दवाई सौंपें', icon: '📦', tip: 'Handle fragile items carefully', tipHi: 'नाजुक आइटम सावधानी से पकड़ें' },
      { step: 5, title: 'Collect Payment', titleHi: 'भुगतान लें', description: 'Medicine cost + delivery charge, accept UPI/cash', descriptionHi: 'दवाई लागत + डिलीवरी शुल्क, UPI/कैश स्वीकार करें', icon: '💵', tip: 'Build regular customers', tipHi: 'नियमित ग्राहक बनाएं' }
    ],
    resources: [
      { name: 'Bike/Scooter', nameHi: 'बाइक/स्कूटर', icon: '🏍️', income: 'Fast delivery', difficulty: 'Required' },
      { name: 'Phone with Camera', nameHi: 'कैमरा वाला फोन', icon: '📱', income: 'For prescription photos', difficulty: 'Required' },
      { name: 'Carry Bag', nameHi: 'कैरी बैग', icon: '🛍️', income: 'Safe transport', difficulty: 'Very Low' },
      { name: 'Local Area Knowledge', nameHi: 'स्थानीय क्षेत्र ज्ञान', icon: '📍', income: 'Faster delivery', difficulty: 'Low' },
      { name: 'UPI Payment', nameHi: 'UPI पेमेंट', icon: '💳', income: 'Easy transactions', difficulty: 'Very Low' },
      { name: 'Cooler Bag (optional)', nameHi: 'कूलर बैग', icon: '❄️', income: 'Temp-sensitive medicines', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Nearby Pharmacies', titleHi: 'पास की फार्मेसी', description: 'App shows nearest medical stores', descriptionHi: 'ऐप निकटतम मेडिकल स्टोर दिखाता है' },
      { title: 'Prescription Storage', titleHi: 'प्रिस्क्रिप्शन स्टोरेज', description: 'Save prescriptions for repeat orders', descriptionHi: 'दोहराए ऑर्डर के लिए प्रिस्क्रिप्शन सेव करें' },
      { title: 'Delivery Tracking', titleHi: 'डिलीवरी ट्रैकिंग', description: 'Client can track your location', descriptionHi: 'क्लाइंट आपका स्थान ट्रैक कर सकता है' },
      { title: 'Earnings Dashboard', titleHi: 'कमाई डैशबोर्ड', description: 'Track daily/weekly earnings', descriptionHi: 'दैनिक/साप्ताहिक कमाई ट्रैक करें' }
    ]
  },

  // 14. First Aid
  'first-aid': {
    story: {
      title: 'First Aid Help Service',
      titleHi: 'फर्स्ट एड मदद सेवा',
      intro: 'Basic first aid knowledge can save lives! Help people with minor injuries, cuts, burns and earn their gratitude + money.',
      introHi: 'बुनियादी फर्स्ट एड ज्ञान जान बचा सकता है! छोटी चोटों, कटने, जलने में लोगों की मदद करें और उनकी कृतज्ञता + पैसे कमाएं।',
      income: 'Earn ₹100-500 per help',
      incomeHi: 'प्रति मदद ₹100-500 कमाएं',
      incomeRange: '₹100 - ₹500/help',
      demand: 'Immediate help needed - daily incidents',
      demandHi: 'तत्काल मदद चाहिए - रोज़ की घटनाएं'
    },
    steps: [
      { step: 1, title: 'Learn First Aid', titleHi: 'फर्स्ट एड सीखें', description: 'Take basic first aid course or learn online', descriptionHi: 'बेसिक फर्स्ट एड कोर्स करें या ऑनलाइन सीखें', icon: '📚', tip: 'Red Cross offers free courses', tipHi: 'Red Cross मुफ्त कोर्स देता है' },
      { step: 2, title: 'Carry First Aid Kit', titleHi: 'फर्स्ट एड किट रखें', description: 'Bandages, antiseptic, gauze, scissors, gloves', descriptionHi: 'बैंडेज, एंटीसेप्टिक, गॉज, कैंची, दस्ताने', icon: '🩹', tip: 'Keep kit in bike/car always', tipHi: 'किट हमेशा बाइक/कार में रखें' },
      { step: 3, title: 'Get Alert', titleHi: 'अलर्ट पाएं', description: 'See nearby first aid requests, reach quickly', descriptionHi: 'पास के फर्स्ट एड अनुरोध देखें, जल्दी पहुंचें', icon: '🚨', tip: 'First responder gets priority', tipHi: 'पहले पहुंचने वाले को प्राथमिकता' },
      { step: 4, title: 'Provide Help', titleHi: 'मदद प्रदान करें', description: 'Clean wound, apply bandage, give basic care', descriptionHi: 'घाव साफ करें, बैंडेज लगाएं, बेसिक देखभाल दें', icon: '🩹', tip: 'Call ambulance for serious cases', tipHi: 'गंभीर मामलों में एम्बुलेंस बुलाएं' },
      { step: 5, title: 'Follow Up', titleHi: 'फॉलो अप करें', description: 'Check on person, suggest doctor if needed', descriptionHi: 'व्यक्ति को चेक करें, जरूरत हो तो डॉक्टर सुझाएं', icon: '❤️', tip: 'Good care = tips and blessings', tipHi: 'अच्छी देखभाल = टिप्स और आशीर्वाद' }
    ],
    resources: [
      { name: 'First Aid Kit', nameHi: 'फर्स्ट एड किट', icon: '🩹', income: '₹100-300/help', difficulty: 'Low' },
      { name: 'Bandages Set', nameHi: 'बैंडेज सेट', icon: '🩹', income: '₹20-50/use', difficulty: 'Very Low' },
      { name: 'Antiseptic Cream', nameHi: 'एंटीसेप्टिक क्रीम', icon: '💊', income: '₹20-30/use', difficulty: 'Very Low' },
      { name: 'Gloves (Disposable)', nameHi: 'दस्ताने', icon: '🧤', income: 'Safety', difficulty: 'Very Low' },
      { name: 'Scissors & Tweezers', nameHi: 'कैंची और पिनसेट', icon: '✂️', income: 'Required', difficulty: 'Low' },
      { name: 'CPR Mask', nameHi: 'CPR मास्क', icon: '😷', income: 'Emergency use', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Emergency Alert', titleHi: 'आपातकालीन अलर्ट', description: 'Get notified instantly for nearby emergencies', descriptionHi: 'पास की आपातकालीन स्थितियों के लिए तुरंत सूचना पाएं' },
      { title: 'GPS Location', titleHi: 'GPS लोकेशन', description: 'Navigate to exact location quickly', descriptionHi: 'सही स्थान पर जल्दी जाएं' },
      { title: 'First Aid Guide', titleHi: 'फर्स्ट एड गाइड', description: 'Quick reference for common injuries', descriptionHi: 'आम चोटों के लिए त्वरित संदर्भ' },
      { title: 'Ambulance Connect', titleHi: 'एम्बुलेंस कनेक्ट', description: 'One-tap to call ambulance for serious cases', descriptionHi: 'गंभीर मामलों के लिए एक टैप में एम्बुलेंस कॉल' }
    ]
  },

  // 15. Hospital Route
  'hospital-route': {
    story: {
      title: 'Hospital Navigation & Escort',
      titleHi: 'अस्पताल नेविगेशन और एस्कॉर्ट',
      intro: 'Many people are new to big hospitals. Guide them to right departments, help with registration and earn!',
      introHi: 'कई लोग बड़े अस्पतालों में नए होते हैं। उन्हें सही विभागों में गाइड करें, पंजीकरण में मदद करें और कमाएं!',
      income: 'Earn ₹200-500 per help',
      incomeHi: 'प्रति मदद ₹200-500 कमाएं',
      incomeRange: '₹200 - ₹500/help',
      demand: 'Daily hundreds need hospital guidance',
      demandHi: 'रोज़ सैकड़ों को अस्पताल मार्गदर्शन चाहिए'
    },
    steps: [
      { step: 1, title: 'Know Local Hospitals', titleHi: 'स्थानीय अस्पताल जानें', description: 'Learn layouts of major hospitals, departments, timings', descriptionHi: 'प्रमुख अस्पतालों, विभागों, समय का लेआउट सीखें', icon: '🏥', tip: 'Focus on 2-3 hospitals first', tipHi: 'पहले 2-3 अस्पतालों पर ध्यान केंद्रित करें' },
      { step: 2, title: 'Get Request', titleHi: 'अनुरोध पाएं', description: 'See navigation help requests, understand patient need', descriptionHi: 'नेविगेशन मदद अनुरोध देखें, मरीज की जरूरत समझें', icon: '📱', tip: 'Ask about medical condition for right department', tipHi: 'सही विभाग के लिए चिकित्सा स्थिति पूछें' },
      { step: 3, title: 'Meet & Guide', titleHi: 'मिलें और गाइड करें', description: 'Meet at hospital gate, guide to right department', descriptionHi: 'अस्पताल गेट पर मिलें, सही विभाग में गाइड करें', icon: '🚶', tip: 'Help with wheelchair if needed', tipHi: 'जरूरत हो तो व्हीलचेयर में मदद करें' },
      { step: 4, title: 'Registration Help', titleHi: 'पंजीकरण मदद', description: 'Help fill forms, get OPD card, find doctor cabin', descriptionHi: 'फॉर्म भरने में मदद, OPD कार्ड लें, डॉक्टर कैबिन खोजें', icon: '📝', tip: 'Know which counter for what', tipHi: 'कौन सा काउंटर किसके लिए है जानें' },
      { step: 5, title: 'Complete Service', titleHi: 'सेवा पूरी करें', description: 'Stay till patient meets doctor, help with next steps', descriptionHi: 'मरीज के डॉक्टर से मिलने तक रहें, अगले कदमों में मदद करें', icon: '✅', tip: 'Offer pharmacy/lab guidance too', tipHi: 'फार्मेसी/लैब गाइडेंस भी दें' }
    ],
    resources: [
      { name: 'Hospital Layout Knowledge', nameHi: 'अस्पताल लेआउट ज्ञान', icon: '🏥', income: '₹200-500/help', difficulty: 'Medium' },
      { name: 'Time Availability', nameHi: 'समय उपलब्धता', icon: '⏰', income: '₹200-400/task', difficulty: 'Very Low' },
      { name: 'Local Language', nameHi: 'स्थानीय भाषा', icon: '🗣️', income: 'Better communication', difficulty: 'Low' },
      { name: 'Mobile Phone', nameHi: 'मोबाइल फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: 'Reach quickly', difficulty: 'Low' },
      { name: 'Wheelchair Pushing', nameHi: 'व्हीलचेयर धक्का', icon: '♿', income: 'Extra ₹50-100', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Hospital Directory', titleHi: 'अस्पताल डायरेक्टरी', description: 'App shows departments and doctors', descriptionHi: 'ऐप विभाग और डॉक्टर दिखाता है' },
      { title: 'Queue Status', titleHi: 'कतार स्थिति', description: 'Real-time OPD queue information', descriptionHi: 'रियल-टाइम OPD कतार जानकारी' },
      { title: 'Navigation Maps', titleHi: 'नेविगेशन मैप्स', description: 'Indoor hospital maps', descriptionHi: 'अस्पताल के अंदर के मैप' },
      { title: 'Feedback System', titleHi: 'फीडबैक सिस्टम', description: 'Ratings from patients helped', descriptionHi: 'मदद किए गए मरीजों से रेटिंग्स' }
    ]
  },

  // ========== HOME & REPAIRS (Row 6) ==========

  // 16. Tools Rental
  'tools-needed': {
    story: {
      title: 'Tools & Equipment Rental',
      titleHi: 'टूल्स और उपकरण किराये पर',
      intro: 'Your toolbox can earn money! Drills, hammers, spanners, ladders - people need tools for small repairs.',
      introHi: 'आपका टूलबॉक्स पैसे कमा सकता है! ड्रिल, हथौड़े, स्पैनर, सीढ़ी - लोगों को छोटी मरम्मत के लिए टूल्स चाहिए।',
      income: 'Earn ₹50-500 per day',
      incomeHi: 'रोज़ ₹50-500 कमाएं',
      incomeRange: '₹50 - ₹500/day',
      demand: 'Daily 50+ people need tools nearby',
      demandHi: 'रोज़ 50+ लोगों को पास में टूल्स चाहिए'
    },
    steps: [
      { step: 1, title: 'Organize Tools', titleHi: 'टूल्स व्यवस्थित करें', description: 'List all tools you have: drill, hammer, screwdriver set, pliers', descriptionHi: 'आपके पास जो भी टूल्स हैं उनकी सूची बनाएं: ड्रिल, हथौड़ा, स्क्रूड्राइवर सेट, प्लायर', icon: '🔧', tip: 'Take photos of each tool', tipHi: 'हर टूल की फोटो लें' },
      { step: 2, title: 'Set Rental Rates', titleHi: 'किराया दरें तय करें', description: 'Set daily/hourly rates, security deposit for each tool', descriptionHi: 'प्रति दिन/घंटे की दरें, हर टूल के लिए सिक्योरिटी डिपॉजिट तय करें', icon: '💰', tip: 'Higher value tools = higher deposit', tipHi: 'ज़्यादा कीमत वाले टूल्स = ज़्यादा जमानत' },
      { step: 3, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Upload photos, add availability, location for pickup', descriptionHi: 'फोटो अपलोड करें, उपलब्धता, पिकअप की जगह जोड़ें', icon: '📱', tip: 'Mention tool condition (new/used)', tipHi: 'टूल की स्थिति बताएं (नया/पुराना)' },
      { step: 4, title: 'Handover Safely', titleHi: 'सुरक्षित हैंडओवर', description: 'Show working condition, give usage tips, take ID proof', descriptionHi: 'काम करने की स्थिति दिखाएं, उपयोग के टिप्स दें, ID प्रूफ लें', icon: '🤝', tip: 'Demo the tool before handing over', tipHi: 'देने से पहले टूल का डेमो दें' },
      { step: 5, title: 'Return & Check', titleHi: 'वापसी और जांच', description: 'Check tool condition, return deposit, get rated', descriptionHi: 'टूल की स्थिति जांचें, जमानत वापस करें, रेटिंग पाएं', icon: '✅', tip: 'Keep spare parts for common tools', tipHi: 'आम टूल्स के लिए स्पेयर पार्ट्स रखें' }
    ],
    resources: [
      { name: 'Drill Machine', nameHi: 'ड्रिल मशीन', icon: '🔨', income: '₹200-500/day', difficulty: 'Medium' },
      { name: 'Tool Box Set', nameHi: 'टूल बॉक्स सेट', icon: '🧰', income: '₹100-200/day', difficulty: 'Low' },
      { name: 'Hammer Set', nameHi: 'हथौड़ा सेट', icon: '🔨', income: '₹50-100/day', difficulty: 'Very Low' },
      { name: 'Spanner Set', nameHi: 'स्पैनर सेट', icon: '🔧', income: '₹50-100/day', difficulty: 'Low' },
      { name: 'Screwdriver Set', nameHi: 'स्क्रूड्राइवर सेट', icon: '🪛', income: '₹30-50/day', difficulty: 'Very Low' },
      { name: 'Pliers Set', nameHi: 'प्लायर सेट', icon: '🔧', income: '₹30-50/day', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Tool Directory', titleHi: 'टूल डायरेक्टरी', description: 'People search for specific tools', descriptionHi: 'लोग विशिष्ट टूल्स खोजते हैं' },
      { title: 'Condition Photos', titleHi: 'स्थिति फोटो', description: 'Record tool condition at handover', descriptionHi: 'हैंडओवर पर टूल की स्थिति रिकॉर्ड करें' },
      { title: 'Deposit Protection', titleHi: 'जमानत सुरक्षा', description: 'Fair deposit calculation help', descriptionHi: 'उचित जमानत गणना में मदद' },
      { title: 'Rental History', titleHi: 'किराया इतिहास', description: 'Track all your tool rentals', descriptionHi: 'सभी टूल किराया ट्रैक करें' }
    ]
  },

  // 17. Ladder Rental
  'ladder-needed': {
    story: {
      title: 'Ladder Rental Service',
      titleHi: 'सीढ़ी किराया सेवा',
      intro: 'A simple ladder (₹1000-3000) can earn ₹100-300 daily! People need ladders for cleaning, repairs, decorations.',
      introHi: 'एक साधारण सीढ़ी (₹1000-3000) रोज़ ₹100-300 कमा सकती है! लोगों को सफाई, मरम्मत, सजावट के लिए सीढ़ी चाहिए।',
      income: 'Earn ₹100-300 per day',
      incomeHi: 'रोज़ ₹100-300 कमाएं',
      incomeRange: '₹100 - ₹300/day',
      demand: 'Weekly need in every household',
      demandHi: 'हर घर में साप्ताहिक जरूरत'
    },
    steps: [
      { step: 1, title: 'Have Ladder Ready', titleHi: 'सीढ़ी तैयार रखें', description: 'Keep ladder clean, check for damage, ensure safety', descriptionHi: 'सीढ़ी साफ रखें, नुकसान की जांच करें, सुरक्षा सुनिश्चित करें', icon: '🪜', tip: 'Multiple sizes = more customers', tipHi: 'कई साइज = ज़्यादा ग्राहक' },
      { step: 2, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Add height, type (step/extension), max load', descriptionHi: 'ऊंचाई, प्रकार (स्टेप/एक्सटेंशन), अधिकतम भार जोड़ें', icon: '📱', tip: 'Include safety tips in listing', tipHi: 'लिस्टिंग में सुरक्षा टिप्स शामिल करें' },
      { step: 3, title: 'Coordinate Pickup', titleHi: 'पिकअप का समन्वय', description: 'Fix time, location for handover, explain usage', descriptionHi: 'हैंडओवर का समय, स्थान तय करें, उपयोग समझाएं', icon: '📍', tip: 'Show safety features', tipHi: 'सुरक्षा फीचर दिखाएं' },
      { step: 4, title: 'Take Deposit', titleHi: 'जमानत लें', description: 'Take security deposit (₹500-1000), note condition', descriptionHi: 'सिक्योरिटी डिपॉजिट लें (₹500-1000), स्थिति नोट करें', icon: '💰', tip: 'Get ID proof for safety', tipHi: 'सुरक्षा के लिए ID प्रूफ लें' },
      { step: 5, title: 'Return & Review', titleHi: 'वापसी और समीक्षा', description: 'Check condition, return deposit, get rated', descriptionHi: 'स्थिति जांचें, जमानत वापस करें, रेटिंग पाएं', icon: '⭐', tip: 'Offer delivery for extra charge', tipHi: 'अतिरिक्त शुल्क पर डिलीवरी की पेशकश करें' }
    ],
    resources: [
      { name: 'Step Ladder 6ft', nameHi: 'स्टेप लैडर 6ft', icon: '🪜', income: '₹100-150/day', difficulty: 'Low' },
      { name: 'Extension Ladder 15ft', nameHi: 'एक्सटेंशन लैडर 15ft', icon: '🪜', income: '₹200-300/day', difficulty: 'Medium' },
      { name: 'Telescopic Ladder', nameHi: 'टेलीस्कोपिक लैडर', icon: '🪜', income: '₹200-350/day', difficulty: 'Medium' },
      { name: 'Aluminium Scaffolding', nameHi: 'एल्युमिनियम स्कैफोल्डिंग', icon: '🏗️', income: '₹500-800/day', difficulty: 'High' },
      { name: 'Stool/Step Stool', nameHi: 'स्टूल', icon: '🪑', income: '₹50-80/day', difficulty: 'Very Low' },
      { name: 'Roof Access Ladder', nameHi: 'रूफ एक्सेस लैडर', icon: '🪜', income: '₹300-500/day', difficulty: 'High' }
    ],
    appHelp: [
      { title: 'Height Calculator', titleHi: 'ऊंचाई कैलकुलेटर', description: 'Help renters choose right ladder size', descriptionHi: 'किराएदारों को सही लैडर साइज चुनने में मदद' },
      { title: 'Safety Guidelines', titleHi: 'सुरक्षा दिशा-निर्देश', description: 'Share ladder safety tips', descriptionHi: 'लैडर सुरक्षा टिप्स साझा करें' },
      { title: 'Delivery Option', titleHi: 'डिलीवरी विकल्प', description: 'Offer home delivery for extra fee', descriptionHi: 'अतिरिक्त शुल्क पर होम डिलीवरी' },
      { title: 'Insurance Option', titleHi: 'बीमा विकल्प', description: 'Optional damage protection', descriptionHi: 'वैकल्पिक क्षति सुरक्षा' }
    ]
  },

  // 18. Electric Issue
  'electric-issue': {
    story: {
      title: 'Electrical Repair Help',
      titleHi: 'इलेक्ट्रिकल रिपेयर मदद',
      intro: 'Basic electrical knowledge can help many homes! Switch repair, fan installation, wiring help - all in demand.',
      introHi: 'बुनियादी इलेक्ट्रिकल ज्ञान कई घरों की मदद कर सकता है! स्विच रिपेयर, पंखा इंस्टॉलेशन, वायरिंग मदद - सभी की मांग है।',
      income: 'Earn ₹200-1000 per help',
      incomeHi: 'प्रति मदद ₹200-1000 कमाएं',
      incomeRange: '₹200 - ₹1,000/help',
      demand: 'Daily electrical issues in every area',
      demandHi: 'हर क्षेत्र में रोज़ इलेक्ट्रिकल समस्याएं'
    },
    steps: [
      { step: 1, title: 'Know Basics', titleHi: 'बेसिक्स जानें', description: 'Learn: wiring, switch repair, fan/AC basics, safety', descriptionHi: 'सीखें: वायरिंग, स्विच रिपेयर, पंखा/AC बेसिक्स, सुरक्षा', icon: '📚', tip: 'Safety first - always check power off!', tipHi: 'सुरक्षा पहले - हमेशा पावर ऑफ चेक करें!' },
      { step: 2, title: 'Carry Tools', titleHi: 'टूल्स रखें', description: 'Wire cutter, tester, screwdriver, insulation tape, pliers', descriptionHi: 'वायर कटर, टेस्टर, स्क्रूड्राइवर, इंसुलेशन टेप, प्लायर', icon: '🔧', tip: 'Keep spare switches, wires', tipHi: 'स्पेयर स्विच, वायर रखें' },
      { step: 3, title: 'Get Requests', titleHi: 'अनुरोध पाएं', description: 'See nearby electrical help requests, understand issue', descriptionHi: 'पास के इलेक्ट्रिकल मदद अनुरोध देखें, समस्या समझें', icon: '📱', tip: 'Ask for issue details before going', tipHi: 'जाने से पहले समस्या का विवरण पूछें' },
      { step: 4, title: 'Diagnose & Fix', titleHi: 'पहचानें और ठीक करें', description: 'Check problem, explain solution, fix safely', descriptionHi: 'समस्या जांचें, समाधान समझाएं, सुरक्षित रूप से ठीक करें', icon: '⚡', tip: 'Test after repair, give warranty', tipHi: 'रिपेयर के बाद टेस्ट करें, वारंटी दें' },
      { step: 5, title: 'Get Paid', titleHi: 'भुगतान पाएं', description: 'Charge for labor + materials used', descriptionHi: 'मेहनत + इस्तेमाल की सामग्री का शुल्क लें', icon: '💰', tip: 'Provide bill for materials', tipHi: 'सामग्री के लिए बिल दें' }
    ],
    resources: [
      { name: 'Electrical Toolkit', nameHi: 'इलेक्ट्रिकल टूलकिट', icon: '🔧', income: '₹200-500/help', difficulty: 'Medium' },
      { name: 'Wire Stripper/Cutter', nameHi: 'वायर स्ट्रिपर/कटर', icon: '✂️', income: 'Required', difficulty: 'Low' },
      { name: 'Voltage Tester', nameHi: 'वोल्टेज टेस्टर', icon: '⚡', income: 'Safety', difficulty: 'Very Low' },
      { name: 'Spare Wires/Switches', nameHi: 'स्पेयर वायर/स्विच', icon: '🔌', income: '₹50-200/material', difficulty: 'Low' },
      { name: 'Insulation Tape', nameHi: 'इंसुलेशन टेप', icon: '🩹', income: '₹10-20/use', difficulty: 'Very Low' },
      { name: 'Multimeter', nameHi: 'मल्टीमीटर', icon: '📊', income: '₹100-200/diagnose', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Issue Categorization', titleHi: 'समस्या वर्गीकरण', description: 'Filter by electrical issue type', descriptionHi: 'इलेक्ट्रिकल समस्या प्रकार के अनुसार फ़िल्टर करें' },
      { title: 'Safety Checklist', titleHi: 'सुरक्षा चेकलिस्ट', description: 'Safety steps before starting work', descriptionHi: 'काम शुरू करने से पहले सुरक्षा चरण' },
      { title: 'Material Calculator', titleHi: 'सामग्री कैलकुलेटर', description: 'Estimate materials needed', descriptionHi: 'आवश्यक सामग्री का अनुमान' },
      { title: 'Verified Electrician Badge', titleHi: 'वेरिफाइड इलेक्ट्रीशियन बैज', description: 'Get certified for more trust', descriptionHi: 'ज़्यादा विश्वास के लिए प्रमाणित हों' }
    ]
  },

  // ========== DELIVERY & PICKUP (Row 7) ==========

  // 19. Parcel Pickup
  'parcel-pickup': {
    story: {
      title: 'Parcel Pickup & Drop Service',
      titleHi: 'पार्सल पिकअप और ड्रॉप सेवा',
      intro: 'Your bike/scooter can deliver parcels! Pickup from shops, deliver to homes, earn per delivery.',
      introHi: 'आपकी बाइक/स्कूटर पार्सल डिलीवर कर सकती है! दुकानों से पिकअप, घरों में डिलीवर, प्रति डिलीवरी कमाएं।',
      income: 'Earn ₹30-100 per parcel',
      incomeHi: 'प्रति पार्सल ₹30-100 कमाएं',
      incomeRange: '₹30 - ₹100/parcel',
      demand: 'Daily 100s of parcels need delivery',
      demandHi: 'रोज़ सैकड़ों पार्सल की डिलीवरी चाहिए'
    },
    steps: [
      { step: 1, title: 'Get Request', titleHi: 'अनुरोध पाएं', description: 'See parcel pickup requests, check pickup/drop location', descriptionHi: 'पार्सल पिकअप अनुरोध देखें, पिकअप/ड्रॉप लोकेशन चेक करें', icon: '📦', tip: 'Multiple parcels in same area = more earning', tipHi: 'एक ही क्षेत्र में कई पार्सल = ज़्यादा कमाई' },
      { step: 2, title: 'Reach Pickup', titleHi: 'पिकअप पर पहुंचें', description: 'Go to shop/home, collect parcel with care', descriptionHi: 'दुकान/घर पर जाएं, पार्सल सावधानी से लें', icon: '📍', tip: 'Verify parcel details before taking', tipHi: 'लेने से पहले पार्सल विवरण सत्यापित करें' },
      { step: 3, title: 'Secure Parcel', titleHi: 'पार्सल सुरक्षित करें', description: 'Handle with care, use bag/box for transport', descriptionHi: 'सावधानी से पकड़ें, परिवहन के लिए बैग/बॉक्स का उपयोग करें', icon: '🛍️', tip: 'Fragile items need extra care', tipHi: 'नाजुक आइटम को अतिरिक्त देखभाल चाहिए' },
      { step: 4, title: 'Deliver to Address', titleHi: 'पते पर डिलीवर करें', description: 'Navigate to address, hand over to right person', descriptionHi: 'पते पर जाएं, सही व्यक्ति को सौंपें', icon: '🏠', tip: 'Take photo as proof of delivery', tipHi: 'डिलीवरी के प्रमाण के रूप में फोटो लें' },
      { step: 5, title: 'Get Payment', titleHi: 'भुगतान पाएं', description: 'Collect delivery charge + COD if applicable', descriptionHi: 'डिलीवरी शुल्क लें + COD यदि लागू', icon: '💵', tip: 'Build regular pickup routes', tipHi: 'नियमित पिकअप रूट बनाएं' }
    ],
    resources: [
      { name: 'Bike/Scooter', nameHi: 'बाइक/स्कूटर', icon: '🏍️', income: 'Fast delivery', difficulty: 'Required' },
      { name: 'Delivery Bag', nameHi: 'डिलीवरी बैग', icon: '🛍️', income: 'Safe transport', difficulty: 'Low' },
      { name: 'Phone with GPS', nameHi: 'GPS वाला फोन', icon: '📱', income: 'Navigation', difficulty: 'Required' },
      { name: 'Helmet', nameHi: 'हेलमेट', icon: '🪖', income: 'Safety', difficulty: 'Required' },
      { name: 'Rain Cover', nameHi: 'रेन कवर', icon: '☔', income: 'Weather protection', difficulty: 'Low' },
      { name: 'Mobile Holder', nameHi: 'मोबाइल होल्डर', icon: '📱', income: 'Easy navigation', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Route Optimization', titleHi: 'रूट ऑप्टिमाइज़ेशन', description: 'Multiple parcels on same route', descriptionHi: 'एक ही रूट पर कई पार्सल' },
      { title: 'Live Tracking', titleHi: 'लाइव ट्रैकिंग', description: 'Sender/receiver can track you', descriptionHi: 'भेजने वाला/पाने वाला आपको ट्रैक कर सकता है' },
      { title: 'COD Collection', titleHi: 'COD कलेक्शन', description: 'Record cash on delivery payments', descriptionHi: 'कैश ऑन डिलीवरी भुगतान रिकॉर्ड करें' },
      { title: 'Delivery Proof', titleHi: 'डिलीवरी प्रूफ', description: 'Photo confirmation at delivery', descriptionHi: 'डिलीवरी पर फोटो पुष्टि' }
    ]
  },

  // 20. Grocery Delivery
  'grocery-needed': {
    story: {
      title: 'Grocery Shopping & Delivery',
      titleHi: 'किराना खरीदारी और डिलीवरी',
      intro: 'Help families with grocery shopping! Get their list, shop, deliver - earn per order.',
      introHi: 'परिवारों को किराना खरीदने में मदद करें! उनकी सूची लें, खरीदें, डिलीवर करें - प्रति ऑर्डर कमाएं।',
      income: 'Earn ₹50-200 per order',
      incomeHi: 'प्रति ऑर्डर ₹50-200 कमाएं',
      incomeRange: '₹50 - ₹200/order',
      demand: 'Daily need - elderly and busy professionals',
      demandHi: 'रोज़ की जरूरत - बुजुर्ग और व्यस्त पेशेवर'
    },
    steps: [
      { step: 1, title: 'Get Shopping List', titleHi: 'खरीदारी सूची पाएं', description: 'Receive list via app/chat, clarify any items', descriptionHi: 'ऐप/चैट से सूची प्राप्त करें, किसी भी आइटम को स्पष्ट करें', icon: '📋', tip: 'Ask for brand preferences', tipHi: 'ब्रांड पसंद पूछें' },
      { step: 2, title: 'Go to Store', titleHi: 'स्टोर जाएं', description: 'Visit preferred store or nearest market', descriptionHi: 'पसंदीदा स्टोर या निकटतम बाजार जाएं', icon: '🏪', tip: 'Go to stores you know well', tipHi: 'जिन स्टोर को अच्छे से जानते हैं वहां जाएं' },
      { step: 3, title: 'Shop Carefully', titleHi: 'सावधानी से खरीदें', description: 'Check quality, compare prices, buy exact items', descriptionHi: 'गुणवत्ता जांचें, कीमतें तुलना करें, सही आइटम खरीदें', icon: '🛒', tip: 'Check expiry dates', tipHi: 'एक्सपायरी डेट चेक करें' },
      { step: 4, title: 'Keep Bill', titleHi: 'बिल रखें', description: 'Get proper bill, share photo with client', descriptionHi: 'सही बिल लें, क्लाइंट के साथ फोटो शेयर करें', icon: '📄', tip: 'Take photo of all items', tipHi: 'सभी आइटम की फोटो लें' },
      { step: 5, title: 'Deliver & Get Paid', titleHi: 'डिलीवर करें और पैसे पाएं', description: 'Deliver items with bill, get shopping cost + delivery fee', descriptionHi: 'बिल के साथ आइटम डिलीवर करें, खरीदारी लागत + डिलीवरी शुल्क पाएं', icon: '💰', tip: 'Build regular customers for steady income', tipHi: 'स्थिर आय के लिए नियमित ग्राहक बनाएं' }
    ],
    resources: [
      { name: 'Shopping Bag', nameHi: 'शॉपिंग बैग', icon: '🛍️', income: 'Carry items', difficulty: 'Very Low' },
      { name: 'Bike/Scooter', nameHi: 'बाइक/स्कूटर', icon: '🏍️', income: 'Fast delivery', difficulty: 'Low' },
      { name: 'Local Market Knowledge', nameHi: 'स्थानीय बाजार ज्ञान', icon: '🏪', income: 'Best prices', difficulty: 'Low' },
      { name: 'Phone with Camera', nameHi: 'कैमरा वाला फोन', icon: '📱', income: 'For photos', difficulty: 'Required' },
      { name: 'UPI Payment', nameHi: 'UPI पेमेंट', icon: '💳', income: 'Easy transactions', difficulty: 'Very Low' },
      { name: 'Insulated Bag', nameHi: 'इंसुलेटेड बैग', icon: '❄️', income: 'Cold items', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Shopping List Template', titleHi: 'खरीदारी सूची टेम्पलेट', description: 'Easy list creation for clients', descriptionHi: 'क्लाइंट के लिए आसान सूची बनाना' },
      { title: 'Price Comparison', titleHi: 'कीमत तुलना', description: 'Compare prices across stores', descriptionHi: 'स्टोर में कीमतों की तुलना करें' },
      { title: 'Order History', titleHi: 'ऑर्डर इतिहास', description: 'Save regular lists for repeat orders', descriptionHi: 'दोहराए ऑर्डर के लिए नियमित सूची सेव करें' },
      { title: 'Payment Tracking', titleHi: 'भुगतान ट्रैकिंग', description: 'Track all shopping payments', descriptionHi: 'सभी खरीदारी भुगतान ट्रैक करें' }
    ]
  },

  // 21. Document Delivery
  'document-delivery': {
    story: {
      title: 'Document & Paper Delivery',
      titleHi: 'दस्तावेज़ और कागज डिलीवरी',
      intro: 'Important documents need safe delivery! Legal papers, agreements, certificates - careful handling required.',
      introHi: 'महत्वपूर्ण दस्तावेज़ों को सुरक्षित डिलीवरी चाहिए! कानूनी कागज, समझौते, प्रमाणपत्र - सावधानीपूर्वक प्रबंधन आवश्यक।',
      income: 'Earn ₹100-300 per delivery',
      incomeHi: 'प्रति डिलीवरी ₹100-300 कमाएं',
      incomeRange: '₹100 - ₹300/delivery',
      demand: 'Daily need for offices and individuals',
      demandHi: 'कार्यालयों और व्यक्तियों के लिए दैनिक जरूरत'
    },
    steps: [
      { step: 1, title: 'Get Pickup Request', titleHi: 'पिकअप अनुरोध पाएं', description: 'See document delivery requests, confirm urgency', descriptionHi: 'दस्तावेज़ डिलीवरी अनुरोध देखें, तत्कालता की पुष्टि करें', icon: '📄', tip: 'Ask about document type for handling', tipHi: 'हैंडलिंग के लिए दस्तावेज़ प्रकार पूछें' },
      { step: 2, title: 'Collect Document', titleHi: 'दस्तावेज़ लें', description: 'Pickup from home/office, verify document count', descriptionHi: 'घर/ऑफिस से लें, दस्तावेज़ गिनती सत्यापित करें', icon: '📍', tip: 'Take photo before pickup', tipHi: 'पिकअप से पहले फोटो लें' },
      { step: 3, title: 'Secure Transport', titleHi: 'सुरक्षित परिवहन', description: 'Keep in waterproof folder, handle carefully', descriptionHi: 'वाटरप्रूफ फोल्डर में रखें, सावधानी से पकड़ें', icon: '📁', tip: 'Don\'t fold or damage', tipHi: 'मत फोल्ड करें या नुकसान न पहुंचाएं' },
      { step: 4, title: 'Deliver to Recipient', titleHi: 'प्राप्तकर्ता को दें', description: 'Reach destination, hand to right person only', descriptionHi: 'गंतव्य पर पहुंचें, केवल सही व्यक्ति को दें', icon: '🏢', tip: 'Get signature/acknowledgment', tipHi: 'हस्ताक्षर/पावती लें' },
      { step: 5, title: 'Confirm Delivery', titleHi: 'डिलीवरी की पुष्टि करें', description: 'Take photo of handover, get payment', descriptionHi: 'हैंडओवर की फोटो लें, भुगतान पाएं', icon: '✅', tip: 'Share delivery confirmation with sender', tipHi: 'भेजने वाले के साथ डिलीवरी पुष्टि साझा करें' }
    ],
    resources: [
      { name: 'Waterproof Folder', nameHi: 'वाटरप्रूफ फोल्डर', icon: '📁', income: 'Safe transport', difficulty: 'Very Low' },
      { name: 'Bike/Scooter', nameHi: 'बाइक/स्कूटर', icon: '🏍️', income: 'Fast delivery', difficulty: 'Low' },
      { name: 'Phone with Camera', nameHi: 'कैमरा वाला फोन', icon: '📱', income: 'Proof photos', difficulty: 'Required' },
      { name: 'Bag for Documents', nameHi: 'दस्तावेज़ बैग', icon: '💼', income: 'Safe carrying', difficulty: 'Very Low' },
      { name: 'Local Area Knowledge', nameHi: 'स्थानीय क्षेत्र ज्ञान', icon: '📍', income: 'Quick delivery', difficulty: 'Low' },
      { name: 'Receipt Book', nameHi: 'रसीद बुक', icon: '📝', income: 'Professional look', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Document Tracking', titleHi: 'दस्तावेज़ ट्रैकिंग', description: 'Real-time location sharing', descriptionHi: 'रियल-टाइम लोकेशन शेयरिंग' },
      { title: 'Signature Capture', titleHi: 'हस्ताक्षर कैप्चर', description: 'Digital acknowledgment', descriptionHi: 'डिजिटल पावती' },
      { title: 'Photo Proof', titleHi: 'फोटो प्रूफ', description: 'Document condition proof', descriptionHi: 'दस्तावेज़ स्थिति प्रमाण' },
      { title: 'Urgent Delivery', titleHi: 'तत्काल डिलीवरी', description: 'Priority option for urgent docs', descriptionHi: 'जल्दी दस्तावेज़ों के लिए प्राथमिकता विकल्प' }
    ]
  },

  // ========== EVENTS & EQUIPMENT (Row 8) ==========

  // 22. Tent Rental
  'tent-event': {
    story: {
      title: 'Tent & Canopy Rental',
      titleHi: 'टेंट और कैनोपी किराया',
      intro: 'Tents for weddings, parties, functions! One-time investment, regular income during event seasons.',
      introHi: 'शादी, पार्टी, समारोहों के लिए टेंट! एक बार का निवेश, इवेंट सीजन में नियमित आय।',
      income: 'Earn ₹500-5000 per event',
      incomeHi: 'प्रति इवेंट ₹500-5000 कमाएं',
      incomeRange: '₹500 - ₹5,000/event',
      demand: 'Peak in wedding and festive seasons',
      demandHi: 'शादी और त्योहार के सीजन में पीक'
    },
    steps: [
      { step: 1, title: 'Have Tent Inventory', titleHi: 'टेंट इन्वेंटरी रखें', description: 'Small to large tents, canopy, pegs, ropes', descriptionHi: 'छोटे से बड़े टेंट, कैनोपी, पेग, रस्सियां', icon: '⛺', tip: 'Different sizes for different events', tipHi: 'अलग-अलग इवेंट के लिए अलग साइज' },
      { step: 2, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Add tent sizes, capacity, setup service', descriptionHi: 'टेंट साइज, क्षमता, सेटअप सेवा जोड़ें', icon: '📱', tip: 'Include setup/dismantling charges', tipHi: 'सेटअप/हटाने का शुल्क शामिल करें' },
      { step: 3, title: 'Visit Location', titleHi: 'जगह पर जाएं', description: 'Check venue, measure space, plan setup', descriptionHi: 'वेन्यू चेक करें, जगह मापें, सेटअप प्लान करें', icon: '📍', tip: 'Take advance payment', tipHi: 'अग्रिम भुगतान लें' },
      { step: 4, title: 'Setup Tent', titleHi: 'टेंट लगाएं', description: 'Setup day before event, ensure stability', descriptionHi: 'इवेंट से एक दिन पहले सेटअप करें, स्थिरता सुनिश्चित करें', icon: '🔨', tip: 'Check weather forecast', tipHi: 'मौसम पूर्वानुमान चेक करें' },
      { step: 5, title: 'Dismantle & Collect', titleHi: 'हटाएं और लें', description: 'Remove after event, collect payment, get rated', descriptionHi: 'इवेंट के बाद हटाएं, भुगतान लें, रेटिंग पाएं', icon: '💰', tip: 'Check for damages before leaving', tipHi: 'जाने से पहले नुकसान की जांच करें' }
    ],
    resources: [
      { name: 'Small Tent (20 people)', nameHi: 'छोटा टेंट (20 लोग)', icon: '⛺', income: '₹500-1000/event', difficulty: 'Medium' },
      { name: 'Medium Tent (50 people)', nameHi: 'मध्यम टेंट (50 लोग)', icon: '⛺', income: '₹1000-2000/event', difficulty: 'Medium' },
      { name: 'Large Tent (100+ people)', nameHi: 'बड़ा टेंट (100+ लोग)', icon: '⛺', income: '₹2000-5000/event', difficulty: 'High' },
      { name: 'Canopy/Shamiana', nameHi: 'कैनोपी/शामियाना', icon: '🎪', income: '₹800-1500/event', difficulty: 'Medium' },
      { name: 'Pegs & Ropes', nameHi: 'पेग और रस्सियां', icon: '🔗', income: 'Included', difficulty: 'Low' },
      { name: 'Setup Tools', nameHi: 'सेटअप टूल्स', icon: '🔧', income: 'Setup service', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Event Calendar', titleHi: 'इवेंट कैलेंडर', description: 'See upcoming events in area', descriptionHi: 'क्षेत्र में आगामी इवेंट देखें' },
      { title: 'Size Calculator', titleHi: 'साइज कैलकुलेटर', description: 'Help clients choose right tent size', descriptionHi: 'क्लाइंट को सही टेंट साइज चुनने में मदद' },
      { title: 'Weather Alert', titleHi: 'मौसम अलर्ट', description: 'Weather warnings for outdoor events', descriptionHi: 'आउटडोर इवेंट के लिए मौसम चेतावनी' },
      { title: 'Setup Team', titleHi: 'सेटअप टीम', description: 'Find helpers for large setups', descriptionHi: 'बड़े सेटअप के लिए मददगार खोजें' }
    ]
  },

  // 23. Chairs Rental
  'chairs-needed': {
    story: {
      title: 'Chairs & Tables Rental',
      titleHi: 'कुर्सियां और मेज किराया',
      intro: 'Plastic chairs and tables for functions! Buy once, rent multiple times. Simple and profitable.',
      introHi: 'फंक्शन के लिए प्लास्टिक की कुर्सियां और मेज! एक बार खरीदें, कई बार किराये पर दें। सरल और लाभदायक।',
      income: 'Earn ₹5-20 per chair/day',
      incomeHi: 'प्रति कुर्सी/दिन ₹5-20 कमाएं',
      incomeRange: '₹5 - ₹20/chair/day',
      demand: 'Every function needs seating',
      demandHi: 'हर फंक्शन को बैठने की जगह चाहिए'
    },
    steps: [
      { step: 1, title: 'Build Inventory', titleHi: 'इन्वेंटरी बनाएं', description: 'Buy chairs (plastic/folding), tables in bulk', descriptionHi: 'कुर्सियां (प्लास्टिक/फोल्डिंग), मेज थोक में खरीदें', icon: '🪑', tip: 'Start with 50 chairs, 10 tables', tipHi: '50 कुर्सियों, 10 मेज से शुरू करें' },
      { step: 2, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Add quantity available, rental rates, delivery option', descriptionHi: 'उपलब्ध मात्रा, किराया दरें, डिलीवरी विकल्प जोड़ें', icon: '📱', tip: 'Minimum booking quantity helps', tipHi: 'न्यूनतम बुकिंग मात्रा मदद करती है' },
      { step: 3, title: 'Take Booking', titleHi: 'बुकिंग लें', description: 'Confirm quantity, dates, location, advance payment', descriptionHi: 'मात्रा, तारीखें, स्थान, अग्रिम भुगतान की पुष्टि करें', icon: '📝', tip: 'Get 50% advance', tipHi: '50% अग्रिम लें' },
      { step: 4, title: 'Deliver & Setup', titleHi: 'डिलीवर और सेटअप करें', description: 'Transport to venue, arrange as needed', descriptionHi: 'वेन्यू तक परिवहन, आवश्यकतानुसार व्यवस्थित करें', icon: '🚚', tip: 'Charge extra for delivery/setup', tipHi: 'डिलीवरी/सेटअप के लिए अतिरिक्त शुल्क लें' },
      { step: 5, title: 'Collect After Event', titleHi: 'इवेंट के बाद लें', description: 'Pickup chairs, check for damages, collect balance', descriptionHi: 'कुर्सियां वापस लें, नुकसान जांचें, बैलेंस लें', icon: '✅', tip: 'Count before leaving venue', tipHi: 'वेन्यू छोड़ने से पहले गिनें' }
    ],
    resources: [
      { name: 'Plastic Chairs', nameHi: 'प्लास्टिक कुर्सियां', icon: '🪑', income: '₹5-10/chair/day', difficulty: 'Low' },
      { name: 'Folding Chairs', nameHi: 'फोल्डिंग कुर्सियां', icon: '🪑', income: '₹8-15/chair/day', difficulty: 'Low' },
      { name: 'Plastic Tables', nameHi: 'प्लास्टिक मेज', icon: '🪑', income: '₹20-40/table/day', difficulty: 'Low' },
      { name: 'Round Tables', nameHi: 'गोल मेज', icon: '⭕', income: '₹30-50/table/day', difficulty: 'Medium' },
      { name: 'Chair Covers', nameHi: 'कुर्सी कवर', icon: '🛋️', income: '₹5-10/cover', difficulty: 'Very Low' },
      { name: 'Transport Vehicle', nameHi: 'परिवहन वाहन', icon: '🚚', income: 'Delivery charges', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Quantity Calculator', titleHi: 'मात्रा कैलकुलेटर', description: 'Help estimate chairs needed for guests', descriptionHi: 'मेहमानों के लिए जरूरी कुर्सियों का अनुमान' },
      { title: 'Booking Calendar', titleHi: 'बुकिंग कैलेंडर', description: 'Track all your bookings', descriptionHi: 'सभी बुकिंग ट्रैक करें' },
      { title: 'Delivery Scheduler', titleHi: 'डिलीवरी शेड्यूलर', description: 'Plan multiple deliveries', descriptionHi: 'कई डिलीवरी की योजना बनाएं' },
      { title: 'Damage Calculator', titleHi: 'क्षति कैलकुलेटर', description: 'Fair damage charges calculation', descriptionHi: 'उचित क्षति शुल्क गणना' }
    ]
  },

  // 24. Sound System
  'sound-system': {
    story: {
      title: 'Sound System & DJ Equipment Rental',
      titleHi: 'साउंड सिस्टम और DJ उपकरण किराया',
      intro: 'Speakers, mics, DJ setup for events! Technical skill + equipment = high earning.',
      introHi: 'इवेंट के लिए स्पीकर, माइक, DJ सेटअप! तकनीकी कौशल + उपकरण = उच्च कमाई।',
      income: 'Earn ₹1000-10000 per event',
      incomeHi: 'प्रति इवेंट ₹1000-10000 कमाएं',
      incomeRange: '₹1,000 - ₹10,000/event',
      demand: 'Every event needs sound',
      demandHi: 'हर इवेंट को साउंड चाहिए'
    },
    steps: [
      { step: 1, title: 'Get Sound Equipment', titleHi: 'साउंड उपकरण लें', description: 'Speakers, amplifier, mics, mixer, cables', descriptionHi: 'स्पीकर, एम्पलीफायर, माइक, मिक्सर, केबल', icon: '🔊', tip: 'Start small, expand gradually', tipHi: 'छोटे से शुरू करें, धीरे-धीरे बढ़ाएं' },
      { step: 2, title: 'Learn Setup', titleHi: 'सेटअप सीखें', description: 'Learn to connect, balance sound, troubleshoot', descriptionHi: 'कनेक्ट करना, साउंड बैलेंस, समस्या हल करना सीखें', icon: '🎧', tip: 'Practice at home events first', tipHi: 'पहले घरेलू इवेंट में अभ्यास करें' },
      { step: 3, title: 'List Services', titleHi: 'सेवाएं पोस्ट करें', description: 'Add equipment list, rates, delivery option', descriptionHi: 'उपकरण सूची, दरें, डिलीवरी विकल्प जोड़ें', icon: '📱', tip: 'Include operator service', tipHi: 'ऑपरेटर सेवा शामिल करें' },
      { step: 4, title: 'Setup at Venue', titleHi: 'वेन्यू पर सेटअप', description: 'Reach early, setup and test all equipment', descriptionHi: 'जल्दी पहुंचें, सभी उपकरण सेटअप और टेस्ट करें', icon: '🎚️', tip: 'Keep spare cables and mics', tipHi: 'स्पेयर केबल और माइक रखें' },
      { step: 5, title: 'Manage Event & Pack', titleHi: 'इवेंट मैनेज और पैक करें', description: 'Monitor sound during event, pack safely after', descriptionHi: 'इवेंट के दौरान साउंड मॉनिटर करें, बाद में सुरक्षित पैक करें', icon: '📦', tip: 'Get full payment before leaving', tipHi: 'जाने से पहले पूरा भुगतान लें' }
    ],
    resources: [
      { name: 'PA System (2 speakers)', nameHi: 'PA सिस्टम (2 स्पीकर)', icon: '🔊', income: '₹1000-3000/event', difficulty: 'Medium' },
      { name: 'DJ Console', nameHi: 'DJ कंसोल', icon: '🎚️', income: '₹2000-5000/event', difficulty: 'High' },
      { name: 'Wireless Mics', nameHi: 'वायरलेस माइक', icon: '🎤', income: '₹500-1000/event', difficulty: 'Low' },
      { name: 'Subwoofer', nameHi: 'सबवूफर', icon: '🔈', income: '₹1000-2000/event', difficulty: 'Medium' },
      { name: 'Lighting Setup', nameHi: 'लाइटिंग सेटअप', icon: '💡', income: '₹1000-3000/event', difficulty: 'Medium' },
      { name: 'Generator (backup)', nameHi: 'जनरेटर (बैकअप)', icon: '⚡', income: '₹500-1000/event', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'Equipment Calculator', titleHi: 'उपकरण कैलकुलेटर', description: 'Suggest setup based on venue size', descriptionHi: 'वेन्यू साइज के आधार पर सेटअप सुझाएं' },
      { title: 'Song Request', titleHi: 'गाना अनुरोध', description: 'Collect song requests from clients', descriptionHi: 'क्लाइंट से गाने के अनुरोध एकत्र करें' },
      { title: 'Setup Checklist', titleHi: 'सेटअप चेकलिस्ट', description: 'Don\'t forget any equipment', descriptionHi: 'कोई उपकरण न भूलें' },
      { title: 'Backup Finder', titleHi: 'बैकअप खोजें', description: 'Find backup equipment nearby', descriptionHi: 'पास में बैकअप उपकरण खोजें' }
    ]
  },

  // ========== SPORTS & FITNESS (Row 9) ==========

  // 25. Sports Gear
  'sports-gear': {
    story: {
      title: 'Sports Equipment Rental',
      titleHi: 'खेल उपकरण किराया',
      intro: 'Cricket bats, footballs, badminton rackets - rent them out! Weekend demand is high.',
      introHi: 'क्रिकेट बैट, फुटबॉल, बैडमिंटन रैकेट - किराये पर दें! सप्ताहांत की मांग ज़्यादा है।',
      income: 'Earn ₹50-500 per day',
      incomeHi: 'रोज़ ₹50-500 कमाएं',
      incomeRange: '₹50 - ₹500/day',
      demand: 'Weekend sports - high demand',
      demandHi: 'सप्ताहांत खेल - उच्च मांग'
    },
    steps: [
      { step: 1, title: 'Collect Equipment', titleHi: 'उपकरण एकत्र करें', description: 'Cricket kit, football, volleyball, badminton, etc.', descriptionHi: 'क्रिकेट किट, फुटबॉल, वॉलीबॉल, बैडमिंटन आदि।', icon: '⚽', tip: 'Quality equipment = more rentals', tipHi: 'गुणवत्ता उपकरण = ज़्यादा किराया' },
      { step: 2, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Add items with condition photos, rental rates', descriptionHi: 'स्थिति फोटो, किराया दरों के साथ आइटम जोड़ें', icon: '📱', tip: 'Bundle deals work well (cricket kit)', tipHi: 'बंडल डील अच्छी रहती है (क्रिकेट किट)' },
      { step: 3, title: 'Rent Out', titleHi: 'किराये पर दें', description: 'Verify person, take deposit, explain usage', descriptionHi: 'व्यक्ति सत्यापित करें, जमानत लें, उपयोग समझाएं', icon: '🤝', tip: 'Check ID for expensive items', tipHi: 'महंगे आइटम के लिए ID चेक करें' },
      { step: 4, title: 'Return Check', titleHi: 'वापसी जांच', description: 'Check condition, return deposit, get rated', descriptionHi: 'स्थिति जांचें, जमानत वापस करें, रेटिंग पाएं', icon: '✅', tip: 'Clean equipment between rentals', tipHi: 'किराये के बीच उपकरण साफ करें' },
      { step: 5, title: 'Maintain Equipment', titleHi: 'उपकरण बनाए रखें', description: 'Regular maintenance, replace worn items', descriptionHi: 'नियमित रखरखाव, घिसे हुए आइटम बदलें', icon: '🔧', tip: 'Keep repair kit handy', tipHi: 'रिपेयर किट रखें' }
    ],
    resources: [
      { name: 'Cricket Kit (Bat+Ball+Stumps)', nameHi: 'क्रिकेट किट', icon: '🏏', income: '₹100-200/day', difficulty: 'Low' },
      { name: 'Football', nameHi: 'फुटबॉल', icon: '⚽', income: '₹50-100/day', difficulty: 'Very Low' },
      { name: 'Badminton Rackets', nameHi: 'बैडमिंटन रैकेट', icon: '🏸', income: '₹50-100/day', difficulty: 'Very Low' },
      { name: 'Volleyball Set', nameHi: 'वॉलीबॉल सेट', icon: '🏐', income: '₹100-150/day', difficulty: 'Low' },
      { name: 'Table Tennis Set', nameHi: 'टेबल टेनिस सेट', icon: '🏓', income: '₹80-150/day', difficulty: 'Low' },
      { name: 'Tennis Racket', nameHi: 'टेनिस रैकेट', icon: '🎾', income: '₹100-200/day', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Equipment Directory', titleHi: 'उपकरण डायरेक्टरी', description: 'Browse all available sports gear', descriptionHi: 'सभी उपलब्ध खेल उपकरण ब्राउज़ करें' },
      { title: 'Bundle Deals', titleHi: 'बंडल डील', description: 'Create combo offers', descriptionHi: 'कॉम्बो ऑफर बनाएं' },
      { title: 'Booking Calendar', titleHi: 'बुकिंग कैलेंडर', description: 'Track all rentals', descriptionHi: 'सभी किराया ट्रैक करें' },
      { title: 'Condition Photos', titleHi: 'स्थिति फोटो', description: 'Record equipment condition', descriptionHi: 'उपकरण स्थिति रिकॉर्ड करें' }
    ]
  },

  // 26. Gym Equipment
  'gym-equipment': {
    story: {
      title: 'Gym & Fitness Equipment Rental',
      titleHi: 'जिम और फिटनेस उपकरण किराया',
      intro: 'Dumbbells, yoga mats, resistance bands - rent to home exercisers! Growing market.',
      introHi: 'डंबल, योगा मैट, रेसिस्टेंस बैंड - घर पर व्यायाम करने वालों को किराये पर दें! बढ़ता बाजार।',
      income: 'Earn ₹50-500 per day',
      incomeHi: 'रोज़ ₹50-500 कमाएं',
      incomeRange: '₹50 - ₹500/day',
      demand: 'Home workout trend increasing',
      demandHi: 'होम वर्कआउट ट्रेंड बढ़ रहा है'
    },
    steps: [
      { step: 1, title: 'Get Equipment', titleHi: 'उपकरण लें', description: 'Dumbbells, yoga mat, bands, jump rope, kettlebell', descriptionHi: 'डंबल, योगा मैट, बैंड, जंप रोप, केटलबेल', icon: '🏋️', tip: 'Start with popular items', tipHi: 'लोकप्रिय आइटम से शुरू करें' },
      { step: 2, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Add weights, condition, weekly/monthly rates', descriptionHi: 'वजन, स्थिति, साप्ताहिक/मासिक दरें जोड़ें', icon: '📱', tip: 'Monthly packages attract serious renters', tipHi: 'मासिक पैकेज गंभीर किराएदार आकर्षित करते हैं' },
      { step: 3, title: 'Deliver or Pickup', titleHi: 'डिलीवर या पिकअप', description: 'Offer home delivery or pickup point', descriptionHi: 'होम डिलीवरी या पिकअप पॉइंट की पेशकश करें', icon: '🚚', tip: 'Delivery earns extra', tipHi: 'डिलीवरी से अतिरिक्त कमाई' },
      { step: 4, title: 'Demo Usage', titleHi: 'उपयोग डेमो', description: 'Show proper form, share workout tips', descriptionHi: 'सही फॉर्म दिखाएं, वर्कआउट टिप्स साझा करें', icon: '💪', tip: 'Share video tutorials', tipHi: 'वीडियो ट्यूटोरियल साझा करें' },
      { step: 5, title: 'Collect & Maintain', titleHi: 'लें और बनाए रखें', description: 'Check condition, clean, repair if needed', descriptionHi: 'स्थिति जांचें, साफ करें, जरूरत हो तो रिपेयर करें', icon: '🔧', tip: 'Sanitize after each rental', tipHi: 'हर किराये के बाद सेनिटाइज करें' }
    ],
    resources: [
      { name: 'Dumbbell Set (2-20kg)', nameHi: 'डंबल सेट (2-20kg)', icon: '🏋️', income: '₹100-300/week', difficulty: 'Medium' },
      { name: 'Yoga Mat', nameHi: 'योगा मैट', icon: '🧘', income: '₹20-50/day', difficulty: 'Very Low' },
      { name: 'Resistance Bands Set', nameHi: 'रेसिस्टेंस बैंड सेट', icon: '🎗️', income: '₹30-60/day', difficulty: 'Very Low' },
      { name: 'Jump Rope', nameHi: 'जंप रोप', icon: '⏭️', income: '₹10-20/day', difficulty: 'Very Low' },
      { name: 'Kettlebell', nameHi: 'केटलबेल', icon: '🏋️', income: '₹50-100/day', difficulty: 'Low' },
      { name: 'Pull-up Bar', nameHi: 'पुल-अप बार', icon: '🏋️', income: '₹50-100/day', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Workout Plans', titleHi: 'वर्कआउट प्लान', description: 'Share sample workout routines', descriptionHi: 'सैंपल वर्कआउट रूटीन साझा करें' },
      { title: 'Video Tutorials', titleHi: 'वीडियो ट्यूटोरियल', description: 'Link to exercise videos', descriptionHi: 'व्यायाम वीडियो से लिंक' },
      { title: 'Progress Tracker', titleHi: 'प्रोग्रेस ट्रैकर', description: 'Renters can track fitness', descriptionHi: 'किराएदार फिटनेस ट्रैक कर सकते हैं' },
      { title: 'Package Builder', titleHi: 'पैकेज बिल्डर', description: 'Create custom equipment bundles', descriptionHi: 'कस्टम उपकरण बंडल बनाएं' }
    ]
  },

  // 27. Cycle Rental
  'cycle-needed': {
    story: {
      title: 'Bicycle Rental Service',
      titleHi: 'साइकिल किराया सेवा',
      intro: 'Rent cycles for exercise, errands, or fun! One cycle can earn ₹500-1000 per month.',
      introHi: 'व्यायाम, काम या मज़े के लिए साइकिल किराये पर दें! एक साइकिल ₹500-1000 प्रति माह कमा सकती है।',
      income: 'Earn ₹50-200 per day',
      incomeHi: 'रोज़ ₹50-200 कमाएं',
      incomeRange: '₹50 - ₹200/day',
      demand: 'Eco-friendly transport growing',
      demandHi: 'पर्यावरण-अनुकूल परिवहन बढ़ रहा है'
    },
    steps: [
      { step: 1, title: 'Have Cycle Ready', titleHi: 'साइकिल तैयार रखें', description: 'Good condition cycle, lock, helmet, bell', descriptionHi: 'अच्छी स्थिति में साइकिल, ताला, हेलमेट, घंटी', icon: '🚴', tip: 'Keep spare tubes and pump', tipHi: 'स्पेयर ट्यूब और पंप रखें' },
      { step: 2, title: 'List on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Add cycle type, gear info, hourly/daily rates', descriptionHi: 'साइकिल प्रकार, गियर जानकारी, प्रति घंटे/दिन की दरें जोड़ें', icon: '📱', tip: 'Mention height suitability', tipHi: 'ऊंचाई उपयुक्तता बताएं' },
      { step: 3, title: 'Verify Renter', titleHi: 'किराएदार सत्यापित करें', description: 'Check ID, take deposit, explain rules', descriptionHi: 'ID चेक करें, जमानत लें, नियम समझाएं', icon: '🪪', tip: 'Take photo of cycle condition', tipHi: 'साइकिल स्थिति की फोटो लें' },
      { step: 4, title: 'Handover with Lock', titleHi: 'ताले के साथ सौंपें', description: 'Give cycle, lock, helmet; share return time', descriptionHi: 'साइकिल, ताला, हेलमेट दें; वापसी का समय बताएं', icon: '🔐', tip: 'Explain lock usage', tipHi: 'ताले का उपयोग समझाएं' },
      { step: 5, title: 'Return Check', titleHi: 'वापसी जांच', description: 'Check condition, return deposit, get rated', descriptionHi: 'स्थिति जांचें, जमानत वापस करें, रेटिंग पाएं', icon: '⭐', tip: 'Regular customers = steady income', tipHi: 'नियमित ग्राहक = स्थिर आय' }
    ],
    resources: [
      { name: 'Regular Cycle', nameHi: 'साधारण साइकिल', icon: '🚴', income: '₹50-100/day', difficulty: 'Low' },
      { name: 'Gear Cycle', nameHi: 'गियर साइकिल', icon: '🚴', income: '₹100-200/day', difficulty: 'Medium' },
      { name: 'Kids Cycle', nameHi: 'बच्चों की साइकिल', icon: '🚲', income: '₹30-60/day', difficulty: 'Low' },
      { name: 'Helmet', nameHi: 'हेलमेट', icon: '🪖', income: '₹20-30/day', difficulty: 'Very Low' },
      { name: 'Cycle Lock', nameHi: 'साइकिल ताला', icon: '🔐', income: 'Included', difficulty: 'Very Low' },
      { name: 'Repair Kit', nameHi: 'रिपेयर किट', icon: '🔧', income: 'Emergency use', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Route Suggestions', titleHi: 'रूट सुझाव', description: 'Safe cycling routes in area', descriptionHi: 'क्षेत्र में सुरक्षित साइकिलिंग रूट' },
      { title: 'Height Match', titleHi: 'ऊंचाई मिलान', description: 'Match cycle to rider height', descriptionHi: 'साइकिल को सवारी की ऊंचाई से मिलाएं' },
      { title: 'Safety Guidelines', titleHi: 'सुरक्षा दिशा-निर्देश', description: 'Traffic rules and safety tips', descriptionHi: 'ट्रैफिक नियम और सुरक्षा टिप्स' },
      { title: 'Booking Calendar', titleHi: 'बुकिंग कैलेंडर', description: 'Track all cycle rentals', descriptionHi: 'सभी साइकिल किराया ट्रैक करें' }
    ]
  },

  // ========== MISCELLANEOUS (Row 10) ==========

  // 28. Pet Care
  'pet-care': {
    story: {
      title: 'Pet Care & Sitting Service',
      titleHi: 'पालतू देखभाल और सिटिंग सेवा',
      intro: 'Love pets? Help busy owners! Dog walking, feeding, sitting when they travel - all in demand.',
      introHi: 'पालतू प्यार करते हैं? व्यस्त मालिकों की मदद करें! कुत्ते को घुमाना, खिलाना, यात्रा पर सिटिंग - सभी की मांग।',
      income: 'Earn ₹200-1000 per day',
      incomeHi: 'रोज़ ₹200-1000 कमाएं',
      incomeRange: '₹200 - ₹1,000/day',
      demand: 'Growing pet ownership = growing demand',
      demandHi: 'बढ़ते पालतू स्वामित्व = बढ़ती मांग'
    },
    steps: [
      { step: 1, title: 'Know Pet Care', titleHi: 'पालतू देखभाल जानें', description: 'Learn basic pet handling, feeding, walking', descriptionHi: 'बेसिक पालतू हैंडलिंग, खिलाना, चलना सीखें', icon: '🐕', tip: 'Start with friendly pets', tipHi: 'दोस्ताना पालतू से शुरू करें' },
      { step: 2, title: 'List Services', titleHi: 'सेवाएं पोस्ट करें', description: 'Add: dog walking, feeding, sitting, grooming', descriptionHi: 'जोड़ें: कुत्ता चलाना, खिलाना, सिटिंग, ग्रूमिंग', icon: '📱', tip: 'Specify which pets you can handle', tipHi: 'बताएं कि किन पालतू को संभाल सकते हैं' },
      { step: 3, title: 'Meet Pet & Owner', titleHi: 'पालतू और मालिक से मिलें', description: 'Understand pet\'s habits, food schedule, commands', descriptionHi: 'पालतू की आदतें, खाने का समय, कमांड समझें', icon: '🤝', tip: 'Spend time to bond with pet', tipHi: 'पालतू से जुड़ने में समय बिताएं' },
      { step: 4, title: 'Provide Care', titleHi: 'देखभाल प्रदान करें', description: 'Walk, feed, play, give medicine if needed', descriptionHi: 'चलाएं, खिलाएं, खेलें, जरूरत हो तो दवाई दें', icon: '❤️', tip: 'Send photos to owner regularly', tipHi: 'मालिक को नियमित रूप से फोटो भेजें' },
      { step: 5, title: 'Complete & Get Paid', titleHi: 'पूरा करें और पैसे पाएं', description: 'Handover pet safely, collect payment, get rated', descriptionHi: 'पालतू सुरक्षित सौंपें, भुगतान लें, रेटिंग पाएं', icon: '💰', tip: 'Build trust for repeat business', tipHi: 'दोहराए व्यापार के लिए विश्वास बनाएं' }
    ],
    resources: [
      { name: 'Pet Knowledge', nameHi: 'पालतू ज्ञान', icon: '🧠', income: '₹200-500/task', difficulty: 'Medium' },
      { name: 'Dog Leash', nameHi: 'कुत्ते की पट्टी', icon: '🦮', income: '₹50-100/walk', difficulty: 'Very Low' },
      { name: 'Pet Treats', nameHi: 'पालतू ट्रीट्स', icon: '🦴', income: 'Bonus for good behavior', difficulty: 'Very Low' },
      { name: 'Time Availability', nameHi: 'समय उपलब्धता', icon: '⏰', income: '₹200-1000/day', difficulty: 'Low' },
      { name: 'Pet Carrier', nameHi: 'पालतू कैरियर', icon: '🧳', income: '₹100-200/trip', difficulty: 'Low' },
      { name: 'Cleaning Supplies', nameHi: 'सफाई सामग्री', icon: '🧹', income: 'Hygiene', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Pet Profile', titleHi: 'पालतू प्रोफाइल', description: 'View pet details before accepting', descriptionHi: 'स्वीकार करने से पहले पालतू विवरण देखें' },
      { title: 'Photo Updates', titleHi: 'फोटो अपडेट', description: 'Share real-time pet photos', descriptionHi: 'रियल-टाइम पालतू फोटो साझा करें' },
      { title: 'Vet Contacts', titleHi: 'वेट संपर्क', description: 'Emergency vet information', descriptionHi: 'आपातकालीन वेट जानकारी' },
      { title: 'Care Instructions', titleHi: 'देखभाल निर्देश', description: 'Digital care guide from owner', descriptionHi: 'मालिक से डिजिटल देखभाल गाइड' }
    ]
  },

  // 29. Plant Care
  'plant-care': {
    story: {
      title: 'Plant Care & Gardening Help',
      titleHi: 'पौधे की देखभाल और बागवानी मदद',
      intro: 'Help plant lovers when they travel! Watering, pruning, fertilizing - simple tasks, good pay.',
      introHi: 'यात्रा के दौरान पौधे प्रेमियों की मदद करें! पानी देना, छंटाई, खाद डालना - सरल काम, अच्छा भुगतान।',
      income: 'Earn ₹100-500 per visit',
      incomeHi: 'प्रति विज़िट ₹100-500 कमाएं',
      incomeRange: '₹100 - ₹500/visit',
      demand: 'Growing plant parent community',
      demandHi: 'बढ़ता पौधे माता-पिता समुदाय'
    },
    steps: [
      { step: 1, title: 'Know Plant Care', titleHi: 'पौधे की देखभाल जानें', description: 'Learn watering needs, sunlight, common issues', descriptionHi: 'पानी की जरूरत, धूप, आम समस्याएं सीखें', icon: '🌱', tip: 'Start with common indoor plants', tipHi: 'आम इनडोर पौधों से शुरू करें' },
      { step: 2, title: 'List Services', titleHi: 'सेवाएं पोस्ट करें', description: 'Add: watering, pruning, repotting, pest control', descriptionHi: 'जोड़ें: पानी, छंटाई, रिपॉटिंग, कीट नियंत्रण', icon: '📱', tip: 'Mention plants you know well', tipHi: 'जिन पौधों को अच्छे से जानते हैं उनका उल्लेख करें' },
      { step: 3, title: 'Visit & Assess', titleHi: 'विज़िट और आकलन', description: 'Check plants, understand owner\'s routine', descriptionHi: 'पौधे चेक करें, मालिक की दिनचर्या समझें', icon: '🔍', tip: 'Take before/after photos', tipHi: 'पहले/बाद की फोटो लें' },
      { step: 4, title: 'Provide Care', titleHi: 'देखभाल प्रदान करें', description: 'Water, prune, check for pests, clean leaves', descriptionHi: 'पानी दें, छंटाई करें, कीट जांचें, पत्ते साफ करें', icon: '💧', tip: 'Don\'t overwater!', tipHi: 'ज़्यादा पानी न दें!' },
      { step: 5, title: 'Report & Get Paid', titleHi: 'रिपोर्ट और भुगतान', description: 'Share update with photos, collect payment', descriptionHi: 'फोटो के साथ अपडेट साझा करें, भुगतान लें', icon: '💰', tip: 'Regular clients = steady income', tipHi: 'नियमित क्लाइंट = स्थिर आय' }
    ],
    resources: [
      { name: 'Gardening Knowledge', nameHi: 'बागवानी ज्ञान', icon: '🧠', income: '₹100-300/visit', difficulty: 'Medium' },
      { name: 'Watering Can', nameHi: 'पानी वाला कैन', icon: '🚿', income: '₹20-30/use', difficulty: 'Very Low' },
      { name: 'Pruning Shears', nameHi: 'छंटाई कैंची', icon: '✂️', income: '₹50-100/service', difficulty: 'Low' },
      { name: 'Spray Bottle', nameHi: 'स्प्रे बॉटल', icon: '🧴', income: '₹10-20/use', difficulty: 'Very Low' },
      { name: 'Fertilizer Pack', nameHi: 'खाद पैक', icon: '💩', income: '₹50-100/application', difficulty: 'Low' },
      { name: 'Plant Care Guide', nameHi: 'पौधे देखभाल गाइड', icon: '📖', income: 'Reference', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Plant Database', titleHi: 'पौधा डेटाबेस', description: 'Care instructions for common plants', descriptionHi: 'आम पौधों के लिए देखभाल निर्देश' },
      { title: 'Care Schedule', titleHi: 'देखभाल शेड्यूल', description: 'Set reminders for visits', descriptionHi: 'विज़िट के लिए रिमाइंडर सेट करें' },
      { title: 'Problem Diagnosis', titleHi: 'समस्या निदान', description: 'Identify plant issues', descriptionHi: 'पौधे की समस्याएं पहचानें' },
      { title: 'Photo Journal', titleHi: 'फोटो जर्नल', description: 'Track plant progress', descriptionHi: 'पौधे की प्रगति ट्रैक करें' }
    ]
  },

  // 30. Photography
  'photo-needed': {
    story: {
      title: 'Photography Services',
      titleHi: 'फोटोग्राफी सेवाएं',
      intro: 'Good with camera/phone? People need photos for events, products, profiles! Turn your skill into income.',
      introHi: 'कैमरा/फोन से अच्छे फोटो लेते हैं? लोगों को इवेंट, प्रोडक्ट, प्रोफाइल के लिए फोटो चाहिए! अपने कौशल को आय में बदलें।',
      income: 'Earn ₹500-5000 per event',
      incomeHi: 'प्रति इवेंट ₹500-5000 कमाएं',
      incomeRange: '₹500 - ₹5,000/event',
      demand: 'Every moment needs capture',
      demandHi: 'हर पल को कैद करने की जरूरत'
    },
    steps: [
      { step: 1, title: 'Have Equipment', titleHi: 'उपकरण रखें', description: 'Good camera or smartphone with portrait mode', descriptionHi: 'अच्छा कैमरा या पोर्ट्रेट मोड वाला स्मार्टफोन', icon: '📸', tip: 'Phone cameras are good enough to start', tipHi: 'शुरू करने के लिए फोन कैमरे काफी अच्छे हैं' },
      { step: 2, title: 'Build Portfolio', titleHi: 'पोर्टफोलियो बनाएं', description: 'Take sample photos, edit well, post on app', descriptionHi: 'सैंपल फोटो लें, अच्छे से एडिट करें, ऐप पर पोस्ट करें', icon: '🖼️', tip: 'Show variety of styles', tipHi: 'विभिन्न शैलियों दिखाएं' },
      { step: 3, title: 'Get Booking', titleHi: 'बुकिंग पाएं', description: 'See photography requests, discuss requirements', descriptionHi: 'फोटोग्राफी अनुरोध देखें, आवश्यकताएं चर्चा करें', icon: '📱', tip: 'Clarify deliverables and timeline', tipHi: 'डिलीवरेबल और समय सीमा स्पष्ट करें' },
      { step: 4, title: 'Shoot Photos', titleHi: 'फोटो शूट करें', description: 'Reach venue, take quality photos, be professional', descriptionHi: 'वेन्यू पर पहुंचें, गुणवत्ता वाले फोटो लें, पेशेवर रहें', icon: '📷', tip: 'Take more photos than needed', tipHi: 'जरूरत से ज़्यादा फोटो लें' },
      { step: 5, title: 'Edit & Deliver', titleHi: 'एडिट और डिलीवर', description: 'Edit best photos, share via app/drive, get paid', descriptionHi: 'सर्वश्रेष्ठ फोटो एडिट करें, ऐप/ड्राइव से साझा करें, भुगतान पाएं', icon: '✨', tip: 'Quick delivery impresses clients', tipHi: 'तेज़ डिलीवरी क्लाइंट को प्रभावित करती है' }
    ],
    resources: [
      { name: 'Smartphone with Good Camera', nameHi: 'अच्छे कैमरे वाला स्मार्टफोन', icon: '📱', income: '₹500-2000/event', difficulty: 'Low' },
      { name: 'DSLR/Mirrorless Camera', nameHi: 'DSLR/मिररलेस कैमरा', icon: '📷', income: '₹2000-5000/event', difficulty: 'High' },
      { name: 'Photo Editing App', nameHi: 'फोटो एडिटिंग ऐप', icon: '✨', income: 'Better quality', difficulty: 'Medium' },
      { name: 'Tripod', nameHi: 'ट्राइपॉड', icon: '🎥', income: 'Stable shots', difficulty: 'Low' },
      { name: 'Ring Light', nameHi: 'रिंग लाइट', icon: '💡', income: '₹200-300/session', difficulty: 'Low' },
      { name: 'Memory Cards', nameHi: 'मेमोरी कार्ड', icon: '💾', income: 'More storage', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Portfolio Builder', titleHi: 'पोर्टफोलियो बिल्डर', description: 'Showcase your best work', descriptionHi: 'अपना सर्वश्रेष्ठ काम दिखाएं' },
      { title: 'Booking Calendar', titleHi: 'बुकिंग कैलेंडर', description: 'Manage all your shoots', descriptionHi: 'अपने सभी शूट मैनेज करें' },
      { title: 'Delivery System', titleHi: 'डिलीवरी सिस्टम', description: 'Share photos securely', descriptionHi: 'फोटो सुरक्षित रूप से साझा करें' },
      { title: 'Review System', titleHi: 'समीक्षा प्रणाली', description: 'Build reputation with reviews', descriptionHi: 'समीक्षाओं से प्रतिष्ठा बनाएं' }
    ]
  },

  // ========== DAILY NEED HELP CATEGORIES (15 FOUNDATION CATEGORIES) ==========

  // DN-1. Line & Presence Help
  'line-presence': {
    story: {
      title: 'Line & Presence Help Service',
      titleHi: 'लाइन और उपस्थिति सेवा',
      intro: 'Many official tasks require someone to stand in line. Your time can help busy people and earn you money! Bank, hospital, govt office, ration - all need human presence.',
      introHi: 'कई आधिकारिक कामों के लिए किसी को लाइन में खड़े होने की जरूरत होती है। आपका समय व्यस्त लोगों की मदद कर सकता है और आपको पैसे कमा सकता है!',
      income: 'Earn ₹200-800 per task',
      incomeHi: 'प्रति काम ₹200-800 कमाएं',
      incomeRange: '₹200 - ₹800/task',
      demand: 'Daily 100s of people need line help',
      demandHi: 'रोज़ सैकड़ों लोगों को लाइन मदद चाहिए'
    },
    steps: [
      { step: 1, title: 'Mark Availability', titleHi: 'उपलब्धता दर्ज करें', description: 'Set your free hours, preferred locations on app', descriptionHi: 'अपने खाली घंटे, पसंदीदा स्थान ऐप पर सेट करें', icon: '🕐', tip: 'Early morning hours pay more', tipHi: 'सुबह के घंटों में ज़्यादा भुगतान' },
      { step: 2, title: 'Accept Task', titleHi: 'काम स्वीकार करें', description: 'See nearby line tasks, accept quickly for priority', descriptionHi: 'पास के लाइन काम देखें, प्राथमिकता के लिए जल्दी स्वीकार करें', icon: '✅', tip: 'First 5 get phone number access', tipHi: 'पहले 5 को फोन नंबर मिलता है' },
      { step: 3, title: 'Reach & Stand', titleHi: 'पहुंचें और खड़े रहें', description: 'Go to location, get token, wait in queue', descriptionHi: 'स्थान पर जाएं, टोकन लें, कतार में प्रतीक्षा करें', icon: '🧍', tip: 'Carry water, phone, charger', tipHi: 'पानी, फोन, चार्जर रखें' },
      { step: 4, title: 'Keep Updating', titleHi: 'अपडेट देते रहें', description: 'Send queue position updates to client', descriptionHi: 'क्लाइंट को कतार की स्थिति भेजते रहें', icon: '📱', tip: 'Share live location for trust', tipHi: 'विश्वास के लिए लाइव लोकेशन शेयर करें' },
      { step: 5, title: 'Complete & Earn', titleHi: 'पूरा करें और कमाएं', description: 'Hand over token or complete work, get paid', descriptionHi: 'टोकन सौंपें या काम पूरा करें, भुगतान पाएं', icon: '💰', tip: 'Good reviews = more tasks', tipHi: 'अच्छी समीक्षा = ज़्यादा काम' }
    ],
    resources: [
      { name: 'Your Free Time', nameHi: 'आपका खाली समय', icon: '⏰', income: '₹200-500/task', difficulty: 'Very Low' },
      { name: 'Mobile Phone', nameHi: 'मोबाइल फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Water Bottle', nameHi: 'पानी की बोतल', icon: '💧', income: 'Comfort', difficulty: 'Very Low' },
      { name: 'Portable Charger', nameHi: 'पोर्टेबल चार्जर', icon: '🔋', income: 'Essential', difficulty: 'Low' },
      { name: 'Umbrella', nameHi: 'छाता', icon: '☂️', income: 'Weather protection', difficulty: 'Very Low' },
      { name: 'ID Proof', nameHi: 'ID प्रूफ', icon: '🪪', income: 'May be needed', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Task Matching', titleHi: 'काम मिलान', description: 'App matches your availability with needs', descriptionHi: 'ऐप आपकी उपलब्धता को जरूरतों से मिलाता है' },
      { title: 'Queue Updates', titleHi: 'कतार अपडेट', description: 'Easy templates for position updates', descriptionHi: 'स्थिति अपडेट के लिए आसान टेम्पलेट' },
      { title: 'Secure Payment', titleHi: 'सुरक्षित भुगतान', description: 'Guaranteed payment after task', descriptionHi: 'काम के बाद गारंटीड भुगतान' },
      { title: 'Trust Score', titleHi: 'ट्रस्ट स्कोर', description: 'Build reputation for better rates', descriptionHi: 'बेहतर दरों के लिए प्रतिष्ठा बनाएं' }
    ]
  },

  // DN-2. Emergency Road Help
  'emergency-road': {
    story: {
      title: 'Emergency Road Help Service',
      titleHi: 'आपातकालीन सड़क मदद सेवा',
      intro: 'Vehicles break down unexpectedly. Puncture, dead battery, empty fuel - all need immediate help. Your tools and skills can save stranded people!',
      introHi: 'वाहन अचानक खराब हो जाते हैं। पंक्चर, डेड बैटरी, खाली ईंधन - सभी को तत्काल मदद चाहिए। आपके टूल्स और कौशल फंसे लोगों को बचा सकते हैं!',
      income: 'Earn ₹100-1000 per help',
      incomeHi: 'प्रति मदद ₹100-1000 कमाएं',
      incomeRange: '₹100 - ₹1,000/help',
      demand: 'Daily 50-100+ breakdowns in every city',
      demandHi: 'हर शहर में रोज़ 50-100+ ब्रेकडाउन'
    },
    steps: [
      { step: 1, title: 'Get Equipped', titleHi: 'सामान तैयार करें', description: 'Keep puncture kit, jump cables, fuel can in vehicle', descriptionHi: 'पंक्चर किट, जंप केबल, फ्यूल कैन वाहन में रखें', icon: '🔧', tip: 'Practice repairs at home', tipHi: 'घर पर मरम्मत का अभ्यास करें' },
      { step: 2, title: 'Enable Alerts', titleHi: 'अलर्ट चालू करें', description: 'Turn on notifications for nearby SOS', descriptionHi: 'पास के SOS के लिए नोटिफिकेशन चालू करें', icon: '🔔', tip: 'Quick response = first priority', tipHi: 'तेज़ जवाब = पहली प्राथमिकता' },
      { step: 3, title: 'Navigate & Reach', titleHi: 'नेविगेट और पहुंचें', description: 'Use GPS, call if needed, reach quickly', descriptionHi: 'GPS का उपयोग करें, जरूरत हो तो कॉल करें, जल्दी पहुंचें', icon: '📍', tip: 'First 5 helpers get contact access', tipHi: 'पहले 5 मददगारों को संपर्क मिलता है' },
      { step: 4, title: 'Fix the Problem', titleHi: 'समस्या ठीक करें', description: 'Repair puncture, jump start, or deliver fuel', descriptionHi: 'पंक्चर ठीक करें, जंप स्टार्ट करें, या ईंधन पहुंचाएं', icon: '🛠️', tip: 'Check for multiple issues', tipHi: 'कई समस्याओं की जांच करें' },
      { step: 5, title: 'Payment & Review', titleHi: 'भुगतान और समीक्षा', description: 'Accept UPI/cash, get rated', descriptionHi: 'UPI/कैश स्वीकार करें, रेटिंग पाएं', icon: '💰', tip: 'Good service = tips', tipHi: 'अच्छी सेवा = टिप्स' }
    ],
    resources: [
      { name: 'Puncture Repair Kit', nameHi: 'पंक्चर किट', icon: '🔧', income: '₹100-300/repair', difficulty: 'Low' },
      { name: 'Jump Start Cables', nameHi: 'जंप केबल', icon: '⚡', income: '₹200-400/start', difficulty: 'Low' },
      { name: 'Jerry Can (Fuel)', nameHi: 'जेरी कैन', icon: '⛽', income: '₹100-300/delivery', difficulty: 'Low' },
      { name: 'Air Pump', nameHi: 'एयर पंप', icon: '💨', income: '₹50-100/fill', difficulty: 'Very Low' },
      { name: 'Basic Toolkit', nameHi: 'बेसिक टूलकिट', icon: '🧰', income: '₹100-300/help', difficulty: 'Medium' },
      { name: 'Tow Rope', nameHi: 'टो रोप', icon: '🔗', income: '₹300-500/tow', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'SOS Alerts', titleHi: 'SOS अलर्ट', description: 'Instant notification for nearby emergencies', descriptionHi: 'पास की आपातकालीन स्थिति की तुरंत सूचना' },
      { title: 'GPS Navigation', titleHi: 'GPS नेविगेशन', description: 'One-tap directions to stranded person', descriptionHi: 'फंसे व्यक्ति तक एक टैप दिशा' },
      { title: 'Contact Access', titleHi: 'संपर्क पहुंच', description: 'First 5 get phone number', descriptionHi: 'पहले 5 को फोन नंबर मिलता है' },
      { title: 'Service History', titleHi: 'सेवा इतिहास', description: 'Track all your road assists', descriptionHi: 'अपनी सभी सड़क सहायता ट्रैक करें' }
    ]
  },

  // DN-3. Elderly Assistance
  'elderly-assist': {
    story: {
      title: 'Elderly Assistance Service',
      titleHi: 'वृद्ध सहायता सेवा',
      intro: 'Elderly people often need a companion for hospital visits, medicine pickup, form filling, or just a walk. Your time and care can earn while helping seniors!',
      introHi: 'वृद्ध लोगों को अक्सर अस्पताल जाने, दवाई लाने, फॉर्म भरने या सिर्फ सैर के लिए साथी की जरूरत होती है। आपका समय और देखभाल कमा सकती है!',
      income: 'Earn ₹200-1000 per task',
      incomeHi: 'प्रति काम ₹200-1000 कमाएं',
      incomeRange: '₹200 - ₹1,000/task',
      demand: 'Growing elderly population needs support',
      demandHi: 'बढ़ती वृद्ध आबादी को सहायता चाहिए'
    },
    steps: [
      { step: 1, title: 'Create Profile', titleHi: 'प्रोफाइल बनाएं', description: 'List your patient nature, languages known, areas', descriptionHi: 'अपनी धैर्य, जानी भाषाएं, क्षेत्र दर्ज करें', icon: '👴', tip: 'Mention any elder care experience', tipHi: 'कोई वृद्ध देखभाल अनुभव बताएं' },
      { step: 2, title: 'Get Request', titleHi: 'अनुरोध पाएं', description: 'See elderly assistance needs near you', descriptionHi: 'अपने पास वृद्ध सहायता जरूरतें देखें', icon: '📱', tip: 'Respond quickly and politely', tipHi: 'जल्दी और विनम्रता से जवाब दें' },
      { step: 3, title: 'Meet & Understand', titleHi: 'मिलें और समझें', description: 'Visit, understand exact need, build comfort', descriptionHi: 'मिलें, सही जरूरत समझें, आराम बनाएं', icon: '🤝', tip: 'Be patient and respectful', tipHi: 'धैर्यवान और सम्मानजनक रहें' },
      { step: 4, title: 'Provide Assistance', titleHi: 'सहायता प्रदान करें', description: 'Help with hospital visit, medicine, forms, or walk', descriptionHi: 'अस्पताल, दवाई, फॉर्म या सैर में मदद करें', icon: '🏥', tip: 'Keep family updated', tipHi: 'परिवार को अपडेट रखें' },
      { step: 5, title: 'Complete & Earn', titleHi: 'पूरा करें और कमाएं', description: 'Finish task, get payment, build relationship', descriptionHi: 'काम पूरा करें, भुगतान पाएं, रिश्ता बनाएं', icon: '💰', tip: 'Regular clients = steady income', tipHi: 'नियमित क्लाइंट = स्थिर आय' }
    ],
    resources: [
      { name: 'Patient Nature', nameHi: 'धैर्यवान स्वभाव', icon: '🧘', income: '₹300-800/task', difficulty: 'Medium' },
      { name: 'Vehicle Access', nameHi: 'वाहन पहुंच', icon: '🏍️', income: '₹100-200/trip', difficulty: 'Low' },
      { name: 'Local Language', nameHi: 'स्थानीय भाषा', icon: '🗣️', income: 'Better connection', difficulty: 'Low' },
      { name: 'Phone & Internet', nameHi: 'फोन और इंटरनेट', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'First Aid Knowledge', nameHi: 'प्राथमिक चिकित्सा ज्ञान', icon: '🩹', income: 'Emergency ready', difficulty: 'Medium' },
      { name: 'Time Availability', nameHi: 'समय उपलब्धता', icon: '⏰', income: '₹200-500/task', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Verified Profiles', titleHi: 'सत्यापित प्रोफाइल', description: 'Families can see your background', descriptionHi: 'परिवार आपकी पृष्ठभूमि देख सकते हैं' },
      { title: 'Task Calendar', titleHi: 'काम कैलेंडर', description: 'Schedule recurring visits', descriptionHi: 'आवर्ती विज़िट शेड्यूल करें' },
      { title: 'Family Updates', titleHi: 'परिवार अपडेट', description: 'Share photos and status', descriptionHi: 'फोटो और स्थिति साझा करें' },
      { title: 'Emergency Alert', titleHi: 'आपातकालीन अलर्ट', description: 'Quick access to emergency services', descriptionHi: 'आपातकालीन सेवाओं तक त्वरित पहुंच' }
    ]
  },

  // DN-4. Patient & Medical Support
  'patient-medical': {
    story: {
      title: 'Patient & Medical Support',
      titleHi: 'मरीज और चिकित्सा सहायता',
      intro: 'Patients need help with doctor appointments, test collections, medicine pickup, hospital stays. Your support can make healthcare accessible!',
      introHi: 'मरीजों को डॉक्टर के अपॉइंटमेंट, टेस्ट संग्रह, दवाई पिकअप, अस्पताल ठहरने में मदद चाहिए। आपका समर्थन स्वास्थ्य सेवा सुलभ बना सकता है!',
      income: 'Earn ₹200-800 per task',
      incomeHi: 'प्रति काम ₹200-800 कमाएं',
      incomeRange: '₹200 - ₹800/task',
      demand: 'Healthcare needs are constant',
      demandHi: 'स्वास्थ्य सेवा जरूरतें निरंतर'
    },
    steps: [
      { step: 1, title: 'List Services', titleHi: 'सेवाएं पोस्ट करें', description: 'Mark: appointments, test pickup, medicine, hospital stay', descriptionHi: 'चिह्नित करें: अपॉइंटमेंट, टेस्ट पिकअप, दवाई, अस्पताल ठहरना', icon: '🏥', tip: 'Mention hospital areas you know', tipHi: 'जिन अस्पताल क्षेत्रों को जानते हैं बताएं' },
      { step: 2, title: 'Get Request', titleHi: 'अनुरोध पाएं', description: 'See patient support needs near you', descriptionHi: 'अपने पास मरीज सहायता जरूरतें देखें', icon: '📱', tip: 'Quick response for urgent needs', tipHi: 'तत्काल जरूरतों के लिए तेज़ जवाब' },
      { step: 3, title: 'Coordinate', titleHi: 'समन्वय करें', description: 'Call patient/family, understand requirements', descriptionHi: 'मरीज/परिवार को कॉल करें, आवश्यकताएं समझें', icon: '📞', tip: 'Confirm details before starting', tipHi: 'शुरू करने से पहले विवरण कन्फर्म करें' },
      { step: 4, title: 'Complete Task', titleHi: 'काम पूरा करें', description: 'Pickup medicine, collect reports, stand in queue', descriptionHi: 'दवाई लें, रिपोर्ट लें, कतार में खड़े रहें', icon: '💊', tip: 'Keep receipts organized', tipHi: 'रसीदें व्यवस्थित रखें' },
      { step: 5, title: 'Deliver & Earn', titleHi: 'डिलीवर और कमाएं', description: 'Hand over items, collect payment', descriptionHi: 'सामान सौंपें, भुगतान लें', icon: '💰', tip: 'Good service = repeat tasks', tipHi: 'अच्छी सेवा = दोहराए काम' }
    ],
    resources: [
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹100-300/trip', difficulty: 'Low' },
      { name: 'Local Hospital Knowledge', nameHi: 'स्थानीय अस्पताल जानकारी', icon: '🏥', income: '₹200-500/task', difficulty: 'Medium' },
      { name: 'Phone & Internet', nameHi: 'फोन और इंटरनेट', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Time Availability', nameHi: 'समय उपलब्धता', icon: '⏰', income: '₹200-500/task', difficulty: 'Very Low' },
      { name: 'Bag for Items', nameHi: 'सामान के लिए बैग', icon: '🎒', income: 'Convenience', difficulty: 'Very Low' },
      { name: 'UPI Payment', nameHi: 'UPI भुगतान', icon: '💳', income: 'Easy transactions', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Hospital Directory', titleHi: 'अस्पताल निर्देशिका', description: 'Find hospitals, labs, pharmacies nearby', descriptionHi: 'पास के अस्पताल, लैब, फार्मेसी खोजें' },
      { title: 'Task Tracking', titleHi: 'काम ट्रैकिंग', description: 'Real-time updates for families', descriptionHi: 'परिवारों के लिए रियल-टाइम अपडेट' },
      { title: 'Secure Delivery', titleHi: 'सुरक्षित डिलीवरी', description: 'Photo proof of delivery', descriptionHi: 'डिलीवरी का फोटो प्रूफ' },
      { title: 'Medical Emergency', titleHi: 'चिकित्सा आपातकाल', description: 'Quick access to ambulance services', descriptionHi: 'एम्बुलेंस सेवाओं तक त्वरित पहुंच' }
    ]
  },

  // DN-5. Child & Family Help
  'child-family': {
    story: {
      title: 'Child & Family Help',
      titleHi: 'बच्चे और परिवार मदद',
      intro: 'Working parents need help with school pickup/drop, babysitting, exam center visits. Your trustworthy presence can help families thrive!',
      introHi: 'कामकाजी माता-पिता को स्कूल पिकअप/ड्रॉप, बेबीसिटिंग, परीक्षा केंद्र जाने में मदद चाहिए। आपकी विश्वसनीय उपस्थिति परिवारों को फलने में मदद कर सकती है!',
      income: 'Earn ₹200-1000 per task',
      incomeHi: 'प्रति काम ₹200-1000 कमाएं',
      incomeRange: '₹200 - ₹1,000/task',
      demand: 'Working parents need trusted help daily',
      demandHi: 'कामकाजी माता-पिता को रोज़ विश्वसनीय मदद चाहिए'
    },
    steps: [
      { step: 1, title: 'Build Trust Profile', titleHi: 'विश्वास प्रोफाइल बनाएं', description: 'Add verification, references, experience with kids', descriptionHi: 'वेरिफिकेशन, रेफरेंस, बच्चों के साथ अनुभव जोड़ें', icon: '👶', tip: 'Background check increases trust', tipHi: 'बैकग्राउंड चेक विश्वास बढ़ाता है' },
      { step: 2, title: 'Set Availability', titleHi: 'उपलब्धता सेट करें', description: 'Mark hours: morning pickup, afternoon, evening', descriptionHi: 'घंटे चिह्नित करें: सुबह पिकअप, दोपहर, शाम', icon: '🕐', tip: 'Consistent timing builds clients', tipHi: 'निरंतर समय क्लाइंट बनाता है' },
      { step: 3, title: 'Meet Family', titleHi: 'परिवार से मिलें', description: 'Introduce yourself, understand child needs', descriptionHi: 'अपना परिचय दें, बच्चे की जरूरतें समझें', icon: '👨‍👩‍👧', tip: 'Be warm but professional', tipHi: 'गर्म लेकिन पेशेवर रहें' },
      { step: 4, title: 'Provide Service', titleHi: 'सेवा प्रदान करें', description: 'Pickup, drop, babysit with care', descriptionHi: 'पिकअप, ड्रॉप, बेबीसिट ध्यान से करें', icon: '🚗', tip: 'Keep parents updated', tipHi: 'माता-पिता को अपडेट रखें' },
      { step: 5, title: 'Complete & Build', titleHi: 'पूरा करें और बनाएं', description: 'Handover safely, get paid, build relationship', descriptionHi: 'सुरक्षित सौंपें, भुगतान पाएं, रिश्ता बनाएं', icon: '💰', tip: 'Families prefer consistency', tipHi: 'परिवार निरंतरता पसंद करते हैं' }
    ],
    resources: [
      { name: 'Trustworthy Nature', nameHi: 'विश्वसनीय स्वभाव', icon: '🤝', income: '₹300-800/task', difficulty: 'Medium' },
      { name: 'Vehicle (for pickup)', nameHi: 'वाहन (पिकअप के लिए)', icon: '🏍️', income: '₹100-200/trip', difficulty: 'Low' },
      { name: 'Phone with Location', nameHi: 'लोकेशन वाला फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Clean Background', nameHi: 'साफ़ बैकग्राउंड', icon: '✅', income: 'Trust factor', difficulty: 'Low' },
      { name: 'Patience with Kids', nameHi: 'बच्चों के साथ धैर्य', icon: '🧘', income: 'Better service', difficulty: 'Medium' },
      { name: 'Emergency Contacts', nameHi: 'आपातकालीन संपर्क', icon: '📞', income: 'Safety', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Trust Verification', titleHi: 'विश्वास सत्यापन', description: 'Verified profiles for families', descriptionHi: 'परिवारों के लिए सत्यापित प्रोफाइल' },
      { title: 'Live Tracking', titleHi: 'लाइव ट्रैकिंग', description: 'Share real-time location during pickup', descriptionHi: 'पिकअप के दौरान रियल-टाइम लोकेशन शेयर करें' },
      { title: 'Schedule Manager', titleHi: 'शेड्यूल मैनेजर', description: 'Manage multiple families efficiently', descriptionHi: 'कई परिवारों को कुशलता से मैनेज करें' },
      { title: 'Safety Alerts', titleHi: 'सुरक्षा अलर्ट', description: 'Emergency buttons for quick help', descriptionHi: 'त्वरित मदद के लिए आपातकालीन बटन' }
    ]
  },

  // DN-6. Temporary Manpower
  'temp-manpower': {
    story: {
      title: 'Temporary Manpower Service',
      titleHi: 'अस्थायी मजदूरी सेवा',
      intro: 'Weddings, shifting, events need extra hands! Your physical help can earn ₹300-800 per task. Manual work is always in demand.',
      introHi: 'शादियां, शिफ्टिंग, इवेंट को अतिरिक्त हाथों की जरूरत होती है! आपकी शारीरिक मदद प्रति काम ₹300-800 कमा सकती है।',
      income: 'Earn ₹300-1000 per task',
      incomeHi: 'प्रति काम ₹300-1000 कमाएं',
      incomeRange: '₹300 - ₹1,000/task',
      demand: 'Daily events and shifting needs',
      demandHi: 'रोज़ इवेंट और शिफ्टिंग जरूरतें'
    },
    steps: [
      { step: 1, title: 'Mark Availability', titleHi: 'उपलब्धता दर्ज करें', description: 'Set free hours, area preference, work type', descriptionHi: 'खाली घंटे, क्षेत्र प्राथमिकता, काम का प्रकार सेट करें', icon: '💪', tip: 'Weekends have more work', tipHi: 'सप्ताहांत में ज़्यादा काम' },
      { step: 2, title: 'See Requests', titleHi: 'अनुरोध देखें', description: 'Check manpower needs: wedding, shifting, loading', descriptionHi: 'मजदूरी जरूरतें देखें: शादी, शिफ्टिंग, लोडिंग', icon: '📱', tip: 'Quick response gets priority', tipHi: 'तेज़ जवाब प्राथमिकता पाता है' },
      { step: 3, title: 'Reach Location', titleHi: 'स्थान पर पहुंचें', description: 'Get address, reach on time, meet coordinator', descriptionHi: 'पता पाएं, समय पर पहुंचें, समन्वयक से मिलें', icon: '📍', tip: 'Dress appropriately for work', tipHi: 'काम के लिए उचित कपड़े पहनें' },
      { step: 4, title: 'Work Diligently', titleHi: 'मेहनत से काम करें', description: 'Load, unload, setup, cleanup as needed', descriptionHi: 'लोड, अनलोड, सेटअप, क्लीनअप जरूरत के अनुसार', icon: '🛠️', tip: 'Take care of items', tipHi: 'सामान का ध्यान रखें' },
      { step: 5, title: 'Complete & Get Paid', titleHi: 'पूरा करें और पैसे पाएं', description: 'Finish work, collect payment, get rated', descriptionHi: 'काम खत्म करें, भुगतान लें, रेटिंग पाएं', icon: '💰', tip: 'Ask for tip if good work', tipHi: 'अच्छे काम के लिए टिप मांगें' }
    ],
    resources: [
      { name: 'Physical Strength', nameHi: 'शारीरिक शक्ति', icon: '💪', income: '₹300-800/task', difficulty: 'Medium' },
      { name: 'Time Availability', nameHi: 'समय उपलब्धता', icon: '⏰', income: '₹300-500/task', difficulty: 'Very Low' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹50-100/trip', difficulty: 'Low' },
      { name: 'Work Gloves', nameHi: 'काम के दस्ताने', icon: '🧤', income: 'Hand protection', difficulty: 'Very Low' },
      { name: 'Phone', nameHi: 'फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Good Attitude', nameHi: 'अच्छा रवैया', icon: '😊', income: 'Better tips', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Task Matching', titleHi: 'काम मिलान', description: 'App finds work near your location', descriptionHi: 'ऐप आपके स्थान के पास काम खोजता है' },
      { title: 'Work History', titleHi: 'काम इतिहास', description: 'Track completed tasks', descriptionHi: 'पूरे किए गए काम ट्रैक करें' },
      { title: 'Payment Security', titleHi: 'भुगतान सुरक्षा', description: 'Guaranteed payment after work', descriptionHi: 'काम के बाद गारंटीड भुगतान' },
      { title: 'Rating System', titleHi: 'रेटिंग सिस्टम', description: 'Good ratings = more work', descriptionHi: 'अच्छी रेटिंग = ज़्यादा काम' }
    ]
  },

  // DN-7. Household Immediate Help
  'household-help': {
    story: {
      title: 'Household Immediate Help',
      titleHi: 'घर की तत्काल मदद',
      intro: 'Home emergencies happen! Gas cylinder change, water issue, electric problem, furniture move - all need immediate help. Your skills can save the day!',
      introHi: 'घर की आपातकालीन स्थिति होती है! गैस सिलेंडर बदलना, पानी की समस्या, बिजली की परेशानी, फर्नीचर मूव - सभी को तत्काल मदद चाहिए।',
      income: 'Earn ₹100-500 per help',
      incomeHi: 'प्रति मदद ₹100-500 कमाएं',
      incomeRange: '₹100 - ₹500/help',
      demand: 'Home emergencies happen daily',
      demandHi: 'घर की आपातकालीन स्थिति रोज़ होती है'
    },
    steps: [
      { step: 1, title: 'Know Basic Skills', titleHi: 'बुनियादी कौशल जानें', description: 'Learn: gas fitting, electric basics, plumbing basics', descriptionHi: 'सीखें: गैस फिटिंग, बिजली बेसिक्स, प्लंबिंग बेसिक्स', icon: '🏠', tip: 'YouTube tutorials help', tipHi: 'YouTube ट्यूटोरियल मदद करते हैं' },
      { step: 2, title: 'List Your Skills', titleHi: 'अपने कौशल पोस्ट करें', description: 'Mark which household tasks you can do', descriptionHi: 'चिह्नित करें कि कौन से घर के काम कर सकते हैं', icon: '📋', tip: 'Add photos of your tools', tipHi: 'अपने टूल्स की फोटो जोड़ें' },
      { step: 3, title: 'Get SOS Alert', titleHi: 'SOS अलर्ट पाएं', description: 'Receive immediate household help requests', descriptionHi: 'तत्काल घरेलू मदद अनुरोध प्राप्त करें', icon: '🔔', tip: 'Quick response = more jobs', tipHi: 'तेज़ जवाब = ज़्यादा काम' },
      { step: 4, title: 'Fix the Problem', titleHi: 'समस्या ठीक करें', description: 'Change cylinder, fix leak, move furniture', descriptionHi: 'सिलेंडर बदलें, लीक ठीक करें, फर्नीचर मूव करें', icon: '🔧', tip: 'Carry basic tools', tipHi: 'बेसिक टूल्स रखें' },
      { step: 5, title: 'Payment & Review', titleHi: 'भुगतान और समीक्षा', description: 'Collect payment, get good rating', descriptionHi: 'भुगतान लें, अच्छी रेटिंग पाएं', icon: '💰', tip: 'Satisfied customers call again', tipHi: 'संतुष्ट ग्राहक फिर बुलाते हैं' }
    ],
    resources: [
      { name: 'Basic Tools Kit', nameHi: 'बेसिक टूल्स किट', icon: '🔧', income: '₹100-300/help', difficulty: 'Low' },
      { name: 'Gas Fitting Key', nameHi: 'गैस फिटिंग कुंजी', icon: '🔑', income: '₹50-100/cylinder', difficulty: 'Very Low' },
      { name: 'Electrician Skills', nameHi: 'इलेक्ट्रीशियन कौशल', icon: '⚡', income: '₹200-500/fix', difficulty: 'Medium' },
      { name: 'Physical Strength', nameHi: 'शारीरिक शक्ति', icon: '💪', income: '₹100-200/move', difficulty: 'Low' },
      { name: 'Plumbing Basics', nameHi: 'प्लंबिंग बेसिक्स', icon: '🚿', income: '₹150-300/fix', difficulty: 'Medium' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹50-100/trip', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'SOS Alerts', titleHi: 'SOS अलर्ट', description: 'Instant notification for emergencies', descriptionHi: 'आपातकालीन स्थिति की तुरंत सूचना' },
      { title: 'Skill Matching', titleHi: 'कौशल मिलान', description: 'Jobs matched to your abilities', descriptionHi: 'आपकी क्षमताओं से मिलान काम' },
      { title: 'Navigation Help', titleHi: 'नेविगेशन मदद', description: 'Quick directions to home', descriptionHi: 'घर तक त्वरित दिशा-निर्देश' },
      { title: 'Service History', titleHi: 'सेवा इतिहास', description: 'Track your household helps', descriptionHi: 'अपनी घरेलू मदद ट्रैक करें' }
    ]
  },

  // DN-8. Vehicle & Transport Assistance
  'vehicle-transport': {
    story: {
      title: 'Vehicle & Transport Help',
      titleHi: 'वाहन और परिवहन मदद',
      intro: 'People need lifts, airport/station drops, heavy item transport, night travel support. Your vehicle can become a steady income source!',
      introHi: 'लोगों को लिफ्ट, हवाईअड्डा/स्टेशन ड्रॉप, भारी सामान परिवहन, रात की यात्रा सहायता चाहिए। आपका वाहन स्थिर आय स्रोत बन सकता है!',
      income: 'Earn ₹100-1000 per trip',
      incomeHi: 'प्रति ट्रिप ₹100-1000 कमाएं',
      incomeRange: '₹100 - ₹1,000/trip',
      demand: 'Transport needs are constant',
      demandHi: 'परिवहन जरूरतें निरंतर'
    },
    steps: [
      { step: 1, title: 'Have Vehicle Ready', titleHi: 'वाहन तैयार रखें', description: 'Bike, scooter, car, or tempo - any works', descriptionHi: 'बाइक, स्कूटर, कार, या टेम्पो - कोई भी काम करता है', icon: '🏍️', tip: 'Clean vehicle impresses', tipHi: 'साफ़ वाहन प्रभावित करता है' },
      { step: 2, title: 'Set Availability', titleHi: 'उपलब्धता सेट करें', description: 'Mark your driving hours and area', descriptionHi: 'अपने ड्राइविंग घंटे और क्षेत्र चिह्नित करें', icon: '🕐', tip: 'Early morning/late night pays more', tipHi: 'सुबह/देर रात ज़्यादा भुगतान' },
      { step: 3, title: 'Get Trip Request', titleHi: 'ट्रिप अनुरोध पाएं', description: 'See transport needs: lift, drop, item delivery', descriptionHi: 'परिवहन जरूरतें देखें: लिफ्ट, ड्रॉप, सामान डिलीवरी', icon: '📱', tip: 'Accept quickly for priority', tipHi: 'प्राथमिकता के लिए जल्दी स्वीकार करें' },
      { step: 4, title: 'Complete Trip Safely', titleHi: 'सुरक्षित ट्रिप पूरा करें', description: 'Pick up, transport, drop safely', descriptionHi: 'पिकअप, परिवहन, सुरक्षित ड्रॉप', icon: '🚗', tip: 'Follow traffic rules always', tipHi: 'हमेशा ट्रैफिक नियमों का पालन करें' },
      { step: 5, title: 'Payment & Rating', titleHi: 'भुगतान और रेटिंग', description: 'Collect fare, get rated, build reputation', descriptionHi: 'किराया लें, रेटिंग पाएं, प्रतिष्ठा बनाएं', icon: '💰', tip: 'Good ratings = more bookings', tipHi: 'अच्छी रेटिंग = ज़्यादा बुकिंग' }
    ],
    resources: [
      { name: 'Two Wheeler', nameHi: 'दोपहिया वाहन', icon: '🏍️', income: '₹100-300/trip', difficulty: 'Low' },
      { name: 'Four Wheeler', nameHi: 'चार पहिया वाहन', icon: '🚗', income: '₹300-800/trip', difficulty: 'Medium' },
      { name: 'Commercial Vehicle', nameHi: 'वाणिज्यिक वाहन', icon: '🚚', income: '₹500-1500/trip', difficulty: 'High' },
      { name: 'Valid License', nameHi: 'वैध लाइसेंस', icon: '📄', income: 'Required', difficulty: 'Required' },
      { name: 'Helmet/Seatbelt', nameHi: 'हेलमेट/सीटबेल्ट', icon: '⛑️', income: 'Safety', difficulty: 'Very Low' },
      { name: 'Phone Mount', nameHi: 'फोन माउंट', icon: '📱', income: 'Navigation', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Trip Matching', titleHi: 'ट्रिप मिलान', description: 'Rides matched to your vehicle type', descriptionHi: 'आपके वाहन प्रकार से मिलान' },
      { title: 'Route Navigation', titleHi: 'रूट नेविगेशन', description: 'Best route suggestions', descriptionHi: 'सर्वश्रेष्ठ मार्ग सुझाव' },
      { title: 'Fare Calculator', titleHi: 'किराया कैलकुलेटर', description: 'Fair pricing based on distance', descriptionHi: 'दूरी के आधार पर उचित मूल्य' },
      { title: 'Safety Features', titleHi: 'सुरक्षा सुविधाएं', description: 'SOS button, live tracking', descriptionHi: 'SOS बटन, लाइव ट्रैकिंग' }
    ]
  },

  // DN-9. Item / Resource Sharing
  'item-sharing': {
    story: {
      title: 'Item & Resource Sharing',
      titleHi: 'सामान और संसाधन साझा',
      intro: 'Items lying unused can generate income! Tools, clothes, jewellery, appliances - rent them out and earn. Your unused items become income sources!',
      introHi: 'पड़े हुए सामान आय दे सकते हैं! टूल्स, कपड़े, गहने, उपकरण - किराये पर दें और कमाएं। आपके अप्रयुक्त सामान आय स्रोत बन जाते हैं!',
      income: 'Earn ₹50-3000 per day',
      incomeHi: 'रोज़ ₹50-3000 कमाएं',
      incomeRange: '₹50 - ₹3,000/day',
      demand: 'People prefer renting over buying',
      demandHi: 'लोग खरीदने के बजाय किराये को पसंद करते हैं'
    },
    steps: [
      { step: 1, title: 'Inventory Items', titleHi: 'सामान की सूची बनाएं', description: 'List: tools, clothes, jewellery, appliances at home', descriptionHi: 'सूची बनाएं: घर पर टूल्स, कपड़े, गहने, उपकरण', icon: '📦', tip: 'Click clear photos', tipHi: 'स्पष्ट फोटो लें' },
      { step: 2, title: 'Post on App', titleHi: 'ऐप पर पोस्ट करें', description: 'Upload photos, set rent, deposit, conditions', descriptionHi: 'फोटो अपलोड करें, किराया, जमानत, शर्तें सेट करें', icon: '📱', tip: 'Be specific about condition', tipHi: 'स्थिति के बारे में विशिष्ट रहें' },
      { step: 3, title: 'Verify Renter', titleHi: 'किराएदार वेरिफाई करें', description: 'Check ID, take deposit, note condition', descriptionHi: 'ID चेक करें, जमानत लें, स्थिति नोट करें', icon: '🤝', tip: 'Take photos at handover', tipHi: 'हैंडओवर पर फोटो लें' },
      { step: 4, title: 'Track Usage', titleHi: 'उपयोग ट्रैक करें', description: 'Know when item returns, check condition', descriptionHi: 'जानें कब सामान लौटता है, स्थिति चेक करें', icon: '📋', tip: 'Set return deadline clearly', tipHi: 'वापसी की समय सीमा स्पष्ट रखें' },
      { step: 5, title: 'Return & Review', titleHi: 'वापसी और समीक्षा', description: 'Check item, return deposit, rate renter', descriptionHi: 'सामान चेक करें, जमानत वापस करें, रेट करें', icon: '⭐', tip: 'Good items = repeat rentals', tipHi: 'अच्छे सामान = दोहराए किराये' }
    ],
    resources: [
      { name: 'Power Tools', nameHi: 'पावर टूल्स', icon: '🔧', income: '₹100-500/day', difficulty: 'Medium' },
      { name: 'Ladder', nameHi: 'सीढ़ी', icon: '🪜', income: '₹50-150/day', difficulty: 'Low' },
      { name: 'Designer Clothes', nameHi: 'डिज़ाइनर कपड़े', icon: '👗', income: '₹200-1000/day', difficulty: 'Medium' },
      { name: 'Jewellery', nameHi: 'गहने', icon: '💎', income: '₹100-500/day', difficulty: 'High' },
      { name: 'Appliances', nameHi: 'उपकरण', icon: '📺', income: '₹100-300/day', difficulty: 'Low' },
      { name: 'Party Supplies', nameHi: 'पार्टी सामान', icon: '🎉', income: '₹200-500/event', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Photo Verification', titleHi: 'फोटो वेरिफिकेशन', description: 'Document item condition', descriptionHi: 'सामान की स्थिति दस्तावेज़ करें' },
      { title: 'Deposit Protection', titleHi: 'जमानत सुरक्षा', description: 'Fair deposit calculation', descriptionHi: 'उचित जमानत गणना' },
      { title: 'Renter History', titleHi: 'किराएदार इतिहास', description: 'See renter\'s past rentals', descriptionHi: 'किराएदार के पिछले किराये देखें' },
      { title: 'Earnings Tracker', titleHi: 'कमाई ट्रैकर', description: 'Track monthly rental income', descriptionHi: 'मासिक किराया आय ट्रैक करें' }
    ]
  },

  // DN-10. Digital & Form Help
  'digital-form': {
    story: {
      title: 'Digital & Form Help Service',
      titleHi: 'डिजिटल और फॉर्म मदद सेवा',
      intro: 'Many people struggle with online forms, UPI, mobile setup. Your digital literacy can bridge the technology gap and earn you money!',
      introHi: 'कई लोग ऑनलाइन फॉर्म, UPI, मोबाइल सेटअप से परेशान रहते हैं। आपकी डिजिटल साक्षरता तकनीकी अंतर को पाट सकती है और आपको पैसे कमा सकती है!',
      income: 'Earn ₹50-500 per task',
      incomeHi: 'प्रति काम ₹50-500 कमाएं',
      incomeRange: '₹50 - ₹500/task',
      demand: 'Digital divide affects millions',
      demandHi: 'डिजिटल विभाजन लाखों को प्रभावित करता है'
    },
    steps: [
      { step: 1, title: 'Know Digital Tasks', titleHi: 'डिजिटल काम जानें', description: 'Learn: online forms, UPI setup, mobile basics, booking', descriptionHi: 'सीखें: ऑनलाइन फॉर्म, UPI सेटअप, मोबाइल बेसिक्स, बुकिंग', icon: '📱', tip: 'Practice common government sites', tipHi: 'आम सरकारी साइटों का अभ्यास करें' },
      { step: 2, title: 'List Services', titleHi: 'सेवाएं पोस्ट करें', description: 'Mark which digital tasks you can help with', descriptionHi: 'चिह्नित करें कि किन डिजिटल कामों में मदद कर सकते हैं', icon: '📋', tip: 'Mention languages you know', tipHi: 'जो भाषाएं जानते हैं बताएं' },
      { step: 3, title: 'Get Request', titleHi: 'अनुरोध पाएं', description: 'See digital help needs near you', descriptionHi: 'अपने पास डिजिटल मदद जरूरतें देखें', icon: '🔔', tip: 'Respond patiently', tipHi: 'धैर्य से जवाब दें' },
      { step: 4, title: 'Help with Task', titleHi: 'काम में मदद करें', description: 'Fill form, setup UPI, book ticket, guide phone', descriptionHi: 'फॉर्म भरें, UPI सेटअप करें, टिकट बुक करें, फोन गाइड करें', icon: '💻', tip: 'Explain steps clearly', tipHi: 'चरण स्पष्ट रूप से समझाएं' },
      { step: 5, title: 'Complete & Payment', titleHi: 'पूरा करें और भुगतान', description: 'Finish task, collect payment, rate', descriptionHi: 'काम पूरा करें, भुगतान लें, रेटिंग दें', icon: '💰', tip: 'Offer follow-up support', tipHi: 'फॉलो-अप सहायता की पेशकश करें' }
    ],
    resources: [
      { name: 'Smartphone', nameHi: 'स्मार्टफोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Internet Data', nameHi: 'इंटरनेट डेटा', icon: '📶', income: '₹50-100/month', difficulty: 'Very Low' },
      { name: 'Digital Knowledge', nameHi: 'डिजिटल ज्ञान', icon: '🧠', income: '₹100-500/task', difficulty: 'Medium' },
      { name: 'Patience', nameHi: 'धैर्य', icon: '🧘', income: 'Better service', difficulty: 'Low' },
      { name: 'Local Language', nameHi: 'स्थानीय भाषा', icon: '🗣️', income: 'Better communication', difficulty: 'Low' },
      { name: 'Banking Knowledge', nameHi: 'बैंकिंग ज्ञान', icon: '🏦', income: '₹50-200/task', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Form Templates', titleHi: 'फॉर्म टेम्पलेट', description: 'Common forms ready to use', descriptionHi: 'आम फॉर्म उपयोग के लिए तैयार' },
      { title: 'Video Guides', titleHi: 'वीडियो गाइड', description: 'Step-by-step tutorials', descriptionHi: 'चरण-दर-चरण ट्यूटोरियल' },
      { title: 'Secure Access', titleHi: 'सुरक्षित पहुंच', description: 'Never store passwords', descriptionHi: 'पासवर्ड कभी न संग्रहीत करें' },
      { title: 'Task History', titleHi: 'काम इतिहास', description: 'Track completed helps', descriptionHi: 'पूर्ण मदद ट्रैक करें' }
    ]
  },

  // DN-11. Local Knowledge Help
  'local-knowledge': {
    story: {
      title: 'Local Knowledge Help',
      titleHi: 'स्थानीय जानकारी मदद',
      intro: 'New to area? Need right shop, doctor, office? Your local knowledge can guide people and earn! Be a local expert!',
      introHi: 'क्षेत्र में नए? सही दुकान, डॉक्टर, कार्यालय चाहिए? आपकी स्थानीय जानकारी लोगों का मार्गदर्शन कर सकती है और कमा सकती है!',
      income: 'Earn ₹50-300 per guidance',
      incomeHi: 'प्रति मार्गदर्शन ₹50-300 कमाएं',
      incomeRange: '₹50 - ₹300/help',
      demand: 'People need local guidance daily',
      demandHi: 'लोगों को रोज़ स्थानीय मार्गदर्शन चाहिए'
    },
    steps: [
      { step: 1, title: 'Build Knowledge', titleHi: 'ज्ञान बनाएं', description: 'Know: best shops, doctors, offices, routes', descriptionHi: 'जानें: सर्वश्रेष्ठ दुकानें, डॉक्टर, कार्यालय, मार्ग', icon: '🗺️', tip: 'Stay updated with new places', tipHi: 'नई जगहों से अपडेट रहें' },
      { step: 2, title: 'Share Availability', titleHi: 'उपलब्धता साझा करें', description: 'Mark your area expertise on app', descriptionHi: 'अपनी क्षेत्र विशेषज्ञता ऐप पर चिह्नित करें', icon: '📍', tip: 'Add specific expertise areas', tipHi: 'विशिष्ट विशेषज्ञता क्षेत्र जोड़ें' },
      { step: 3, title: 'Get Question', titleHi: 'प्रश्न पाएं', description: 'See local guidance requests nearby', descriptionHi: 'पास के स्थानीय मार्गदर्शन अनुरोध देखें', icon: '❓', tip: 'Respond quickly and accurately', tipHi: 'जल्दी और सटीक जवाब दें' },
      { step: 4, title: 'Guide Person', titleHi: 'व्यक्ति का मार्गदर्शन करें', description: 'Give directions, recommendations, contacts', descriptionHi: 'दिशा-निर्देश, सिफारिशें, संपर्क दें', icon: '🧭', tip: 'Offer to accompany if needed', tipHi: 'जरूरत हो तो साथ जाने की पेशकश करें' },
      { step: 5, title: 'Payment & Thanks', titleHi: 'भुगतान और धन्यवाद', description: 'Collect payment, get rating', descriptionHi: 'भुगतान लें, रेटिंग पाएं', icon: '💰', tip: 'Share contact for future help', tipHi: 'भविष्य की मदद के लिए संपर्क साझा करें' }
    ],
    resources: [
      { name: 'Local Area Knowledge', nameHi: 'स्थानीय क्षेत्र ज्ञान', icon: '🧠', income: '₹50-300/task', difficulty: 'Medium' },
      { name: 'Contact List', nameHi: 'संपर्क सूची', icon: '📞', income: 'Speed bonus', difficulty: 'Low' },
      { name: 'Phone', nameHi: 'फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹50-100/trip', difficulty: 'Low' },
      { name: 'Language Skills', nameHi: 'भाषा कौशल', icon: '🗣️', income: 'Better service', difficulty: 'Low' },
      { name: 'Time', nameHi: 'समय', icon: '⏰', income: '₹50-150/hour', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'Knowledge Base', titleHi: 'ज्ञान आधार', description: 'Share and access local info', descriptionHi: 'स्थानीय जानकारी साझा और एक्सेस करें' },
      { title: 'Q&A System', titleHi: 'प्रश्न-उत्तर प्रणाली', description: 'Answer questions easily', descriptionHi: 'आसानी से सवालों के जवाब दें' },
      { title: 'Location Share', titleHi: 'लोकेशन शेयर', description: 'Send exact locations', descriptionHi: 'सही लोकेशन भेजें' },
      { title: 'Rating System', titleHi: 'रेटिंग सिस्टम', description: 'Build reputation as guide', descriptionHi: 'गाइड के रूप में प्रतिष्ठा बनाएं' }
    ]
  },

  // DN-12. Pet & Animal Help
  'pet-animal': {
    story: {
      title: 'Pet & Animal Help Service',
      titleHi: 'पालतू और जानवर मदद सेवा',
      intro: 'Pet owners need help with dog walking, vet visits, pet sitting. Your love for animals can become income!',
      introHi: 'पालतू जानवरों के मालिकों को कुत्ते की सैर, पशु चिकित्सक विज़िट, पेट सिटिंग में मदद चाहिए। जानवरों के प्रति आपका प्यार आय बन सकता है!',
      income: 'Earn ₹100-500 per task',
      incomeHi: 'प्रति काम ₹100-500 कमाएं',
      incomeRange: '₹100 - ₹500/task',
      demand: 'Growing pet ownership needs support',
      demandHi: 'बढ़ते पालतू स्वामित्व को सहायता चाहिए'
    },
    steps: [
      { step: 1, title: 'Love Animals', titleHi: 'जानवरों से प्यार', description: 'Have genuine care and comfort with pets', descriptionHi: 'पालतू जानवरों के साथ वास्तविक देखभाल और आराम हो', icon: '🐕', tip: 'Know basic pet handling', tipHi: 'बुनियादी पालतू हैंडलिंग जानें' },
      { step: 2, title: 'List Services', titleHi: 'सेवाएं पोस्ट करें', description: 'Offer: walking, vet visit, pet sitting, grooming help', descriptionHi: 'पेशकश करें: सैर, वेट विज़िट, पेट सिटिंग, ग्रूमिंग मदद', icon: '📋', tip: 'Mention pet types you\'re comfortable with', tipHi: 'जिन पालतू प्रकारों के साथ आराम है बताएं' },
      { step: 3, title: 'Meet Pet & Owner', titleHi: 'पालतू और मालिक से मिलें', description: 'Visit, understand pet nature, build trust', descriptionHi: 'मिलें, पालतू का स्वभाव समझें, विश्वास बनाएं', icon: '🤝', tip: 'Be gentle and patient', tipHi: 'कोमल और धैर्यवान रहें' },
      { step: 4, title: 'Provide Care', titleHi: 'देखभाल प्रदान करें', description: 'Walk, feed, play, or accompany to vet', descriptionHi: 'सैर कराएं, खिलाएं, खेलें, या वेट के साथ जाएं', icon: '🦮', tip: 'Keep owner updated with photos', tipHi: 'मालिक को फोटो के साथ अपडेट रखें' },
      { step: 5, title: 'Complete & Earn', titleHi: 'पूरा करें और कमाएं', description: 'Finish task safely, collect payment', descriptionHi: 'सुरक्षित रूप से काम पूरा करें, भुगतान लें', icon: '💰', tip: 'Regular pet walking = steady income', tipHi: 'नियमित पालतू सैर = स्थिर आय' }
    ],
    resources: [
      { name: 'Love for Animals', nameHi: 'जानवरों से प्यार', icon: '❤️', income: '₹100-300/task', difficulty: 'Medium' },
      { name: 'Leash/Collar', nameHi: 'पट्टा/कॉलर', icon: '🦮', income: '₹50-100/walk', difficulty: 'Very Low' },
      { name: 'Basic Pet Knowledge', nameHi: 'बुनियादी पालतू ज्ञान', icon: '🧠', income: 'Better service', difficulty: 'Low' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹50-100/trip', difficulty: 'Low' },
      { name: 'Treats', nameHi: 'ट्रीट्स', icon: '🦴', income: 'Better pet handling', difficulty: 'Very Low' },
      { name: 'Phone', nameHi: 'फोन', icon: '📱', income: 'For updates', difficulty: 'Required' }
    ],
    appHelp: [
      { title: 'Pet Profiles', titleHi: 'पालतू प्रोफाइल', description: 'View pet details before task', descriptionHi: 'काम से पहले पालतू विवरण देखें' },
      { title: 'Vet Directory', titleHi: 'वेट निर्देशिका', description: 'Find nearby veterinarians', descriptionHi: 'पास के पशु चिकित्सक खोजें' },
      { title: 'Photo Updates', titleHi: 'फोटो अपडेट', description: 'Share moments with owners', descriptionHi: 'मालिकों के साथ पल साझा करें' },
      { title: 'Emergency Alert', titleHi: 'आपातकालीन अलर्ट', description: 'Quick access to vet help', descriptionHi: 'वेट मदद तक त्वरित पहुंच' }
    ]
  },

  // DN-13. Safety & Escort Help
  'safety-escort': {
    story: {
      title: 'Safety & Escort Help',
      titleHi: 'सुरक्षा और एस्कॉर्ट मदद',
      intro: 'People need safe company - night travel, unknown area, women safety. Your presence can provide security and peace of mind!',
      introHi: 'लोगों को सुरक्षित साथ चाहिए - रात की यात्रा, अज्ञात क्षेत्र, महिला सुरक्षा। आपकी उपस्थिति सुरक्षा और मन की शांति दे सकती है!',
      income: 'Earn ₹200-800 per escort',
      incomeHi: 'प्रति एस्कॉर्ट ₹200-800 कमाएं',
      incomeRange: '₹200 - ₹800/escort',
      demand: 'Safety concerns create constant need',
      demandHi: 'सुरक्षा चिंताएं निरंतर जरूरत पैदा करती हैं'
    },
    steps: [
      { step: 1, title: 'Build Trust Profile', titleHi: 'विश्वास प्रोफाइल बनाएं', description: 'Add verification, ID proof, references', descriptionHi: 'वेरिफिकेशन, ID प्रूफ, रेफरेंस जोड़ें', icon: '🛡️', tip: 'High trust score = more bookings', tipHi: 'उच्च ट्रस्ट स्कोर = ज़्यादा बुकिंग' },
      { step: 2, title: 'Set Availability', titleHi: 'उपलब्धता सेट करें', description: 'Mark hours for escort: day, evening, night', descriptionHi: 'एस्कॉर्ट के घंटे चिह्नित करें: दिन, शाम, रात', icon: '🕐', tip: 'Night hours pay more', tipHi: 'रात के घंटे ज़्यादा भुगतान देते हैं' },
      { step: 3, title: 'Get Request', titleHi: 'अनुरोध पाएं', description: 'See safety escort needs near you', descriptionHi: 'अपने पास सुरक्षा एस्कॉर्ट जरूरतें देखें', icon: '📱', tip: 'Respond quickly and professionally', tipHi: 'जल्दी और पेशेवर रूप से जवाब दें' },
      { step: 4, title: 'Provide Escort', titleHi: 'एस्कॉर्ट प्रदान करें', description: 'Accompany safely, be alert, stay with person', descriptionHi: 'सुरक्षित रूप से साथ रहें, सतर्क रहें, व्यक्ति के साथ रहें', icon: '🚶', tip: 'Keep emergency contacts ready', tipHi: 'आपातकालीन संपर्क तैयार रखें' },
      { step: 5, title: 'Complete Safely', titleHi: 'सुरक्षित रूप से पूरा करें', description: 'Ensure person reaches destination, collect payment', descriptionHi: 'व्यक्ति का गंतव्य पहुंच सुनिश्चित करें, भुगतान लें', icon: '💰', tip: 'Confirm safe arrival message', tipHi: 'सुरक्षित पहुंच का संदेश कन्फर्म करें' }
    ],
    resources: [
      { name: 'Trustworthy Presence', nameHi: 'विश्वसनीय उपस्थिति', icon: '🤝', income: '₹200-500/escort', difficulty: 'Medium' },
      { name: 'ID Verification', nameHi: 'ID वेरिफिकेशन', icon: '🪪', income: 'Trust factor', difficulty: 'Low' },
      { name: 'Phone', nameHi: 'फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Local Area Knowledge', nameHi: 'स्थानीय क्षेत्र ज्ञान', icon: '🗺️', income: 'Better service', difficulty: 'Low' },
      { name: 'Physical Fitness', nameHi: 'शारीरिक फिटनेस', icon: '💪', income: 'Reliable presence', difficulty: 'Medium' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹100-200/trip', difficulty: 'Low' }
    ],
    appHelp: [
      { title: 'Verified Profiles', titleHi: 'सत्यापित प्रोफाइल', description: 'Build trust with verification', descriptionHi: 'सत्यापन के साथ विश्वास बनाएं' },
      { title: 'Live Tracking', titleHi: 'लाइव ट्रैकिंग', description: 'Share location during escort', descriptionHi: 'एस्कॉर्ट के दौरान लोकेशन शेयर करें' },
      { title: 'SOS Button', titleHi: 'SOS बटन', description: 'Quick emergency access', descriptionHi: 'त्वरित आपातकालीन पहुंच' },
      { title: 'Safe Zones', titleHi: 'सुरक्षित क्षेत्र', description: 'Know safer routes', descriptionHi: 'सुरक्षित मार्ग जानें' }
    ]
  },

  // DN-14. Shopping & Errand Help
  'shopping-errand': {
    story: {
      title: 'Shopping & Errand Help',
      titleHi: 'खरीदारी और दौड़ मदद',
      intro: 'Busy people need grocery runs, medicine purchase, hardware shopping. Your time can help them and earn you money!',
      introHi: 'व्यस्त लोगों को किराना दौड़, दवाई खरीद, हार्डवेयर खरीदारी चाहिए। आपका समय उनकी मदद कर सकता है और आपको पैसे कमा सकता है!',
      income: 'Earn ₹100-500 per errand',
      incomeHi: 'प्रति दौड़ ₹100-500 कमाएं',
      incomeRange: '₹100 - ₹500/errand',
      demand: 'Daily errands need helpers',
      demandHi: 'रोज़ के कामों को मददगार चाहिए'
    },
    steps: [
      { step: 1, title: 'Know Local Markets', titleHi: 'स्थानीय बाजार जानें', description: 'Familiarize with grocery, medicine, hardware shops', descriptionHi: 'किराना, दवाई, हार्डवेयर दुकानों से परिचित हों', icon: '🛒', tip: 'Know shop timings', tipHi: 'दुकान का समय जानें' },
      { step: 2, title: 'Set Availability', titleHi: 'उपलब्धता सेट करें', description: 'Mark free hours for errand runs', descriptionHi: 'दौड़ के लिए खाली घंटे चिह्नित करें', icon: '🕐', tip: 'Morning and evening are busy', tipHi: 'सुबह और शाम व्यस्त हैं' },
      { step: 3, title: 'Get Errand Request', titleHi: 'दौड़ अनुरोध पाएं', description: 'See shopping needs nearby', descriptionHi: 'पास की खरीदारी जरूरतें देखें', icon: '📱', tip: 'Clarify list and budget', tipHi: 'सूची और बजट स्पष्ट करें' },
      { step: 4, title: 'Purchase Items', titleHi: 'सामान खरीदें', description: 'Go to shop, buy items, keep receipts', descriptionHi: 'दुकान जाएं, सामान खरीदें, रसीदें रखें', icon: '🛍️', tip: 'Video call if unsure', tipHi: 'अनिश्चित होने पर वीडियो कॉल करें' },
      { step: 5, title: 'Deliver & Payment', titleHi: 'डिलीवर और भुगतान', description: 'Deliver items, collect payment + charges', descriptionHi: 'सामान डिलीवर करें, भुगतान + शुल्क लें', icon: '💰', tip: 'Photo of items for proof', tipHi: 'साबित के लिए सामान की फोटो' }
    ],
    resources: [
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: '₹50-150/trip', difficulty: 'Low' },
      { name: 'Local Market Knowledge', nameHi: 'स्थानीय बाजार ज्ञान', icon: '🏪', income: 'Faster shopping', difficulty: 'Low' },
      { name: 'Phone', nameHi: 'फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Carrying Bag', nameHi: 'कैरिंग बैग', icon: '🎒', income: 'Convenience', difficulty: 'Very Low' },
      { name: 'Time', nameHi: 'समय', icon: '⏰', income: '₹100-300/errand', difficulty: 'Very Low' },
      { name: 'UPI Payment', nameHi: 'UPI भुगतान', icon: '💳', income: 'Easy transactions', difficulty: 'Very Low' }
    ],
    appHelp: [
      { title: 'List Templates', titleHi: 'सूची टेम्पलेट', description: 'Common shopping lists ready', descriptionHi: 'आम खरीदारी सूची तैयार' },
      { title: 'Shop Directory', titleHi: 'दुकान निर्देशिका', description: 'Find right shops nearby', descriptionHi: 'पास सही दुकानें खोजें' },
      { title: 'Photo Receipt', titleHi: 'फोटो रसीद', description: 'Upload receipts for transparency', descriptionHi: 'पारदर्शिता के लिए रसीदें अपलोड करें' },
      { title: 'Rating System', titleHi: 'रेटिंग सिस्टम', description: 'Build reputation for errands', descriptionHi: 'दौड़ के लिए प्रतिष्ठा बनाएं' }
    ]
  },

  // DN-15. Critical / SOS Help
  'critical-sos': {
    story: {
      title: 'Critical / SOS Help',
      titleHi: 'महत्वपूर्ण / SOS मदद',
      intro: 'Life-impacting situations need immediate human help. Lost person, disaster, panic - your presence can save lives! This is the most important category.',
      introHi: 'जीवन-प्रभावित करने वाली स्थितियों को तत्काल मानवीय मदद चाहिए। खोया व्यक्ति, आपदा, घबराहट - आपकी उपस्थिति जान बचा सकती है!',
      income: 'Earn ₹500-2000 per help',
      incomeHi: 'प्रति मदद ₹500-2000 कमाएं',
      incomeRange: '₹500 - ₹2,000/help',
      demand: 'SOS situations are unpredictable but critical',
      demandHi: 'SOS स्थितियां अनिश्चित हैं लेकिन महत्वपूर्ण'
    },
    steps: [
      { step: 1, title: 'Stay Alert', titleHi: 'सतर्क रहें', description: 'Keep SOS notifications ON, be ready to help', descriptionHi: 'SOS नोटिफिकेशन चालू रखें, मदद के लिए तैयार रहें', icon: '🆘', tip: 'Know emergency numbers', tipHi: 'आपातकालीन नंबर जानें' },
      { step: 2, title: 'Receive SOS', titleHi: 'SOS प्राप्त करें', description: 'Get critical help alert with location', descriptionHi: 'लोकेशन के साथ महत्वपूर्ण मदद अलर्ट पाएं', icon: '🔔', tip: 'Respond immediately', tipHi: 'तुरंत जवाब दें' },
      { step: 3, title: 'Reach Quickly', titleHi: 'जल्दी पहुंचें', description: 'Navigate to location, call for status', descriptionHi: 'स्थान पर जाएं, स्थिति के लिए कॉल करें', icon: '📍', tip: 'Inform police if needed', tipHi: 'जरूरत हो तो पुलिस को सूचित करें' },
      { step: 4, title: 'Provide Help', titleHi: 'मदद प्रदान करें', description: 'Assess situation, calm person, coordinate help', descriptionHi: 'स्थिति का आकलन करें, व्यक्ति को शांत करें, मदद का समन्वय करें', icon: '🤝', tip: 'Stay calm and focused', tipHi: 'शांत और केंद्रित रहें' },
      { step: 5, title: 'Resolve & Report', titleHi: 'समाधान और रिपोर्ट', description: 'Ensure safety, document incident, get support', descriptionHi: 'सुरक्षा सुनिश्चित करें, घटना दस्तावेज़ करें, सहायता पाएं', icon: '✅', tip: 'Follow up if needed', tipHi: 'जरूरत हो तो फॉलो-अप करें' }
    ],
    resources: [
      { name: 'Quick Response', nameHi: 'त्वरित प्रतिक्रिया', icon: '⚡', income: 'Priceless', difficulty: 'High' },
      { name: 'First Aid Knowledge', nameHi: 'प्राथमिक चिकित्सा ज्ञान', icon: '🩹', income: 'Life saving', difficulty: 'Medium' },
      { name: 'Phone', nameHi: 'फोन', icon: '📱', income: 'Required', difficulty: 'Required' },
      { name: 'Transportation', nameHi: 'परिवहन', icon: '🏍️', income: 'Quick reach', difficulty: 'Low' },
      { name: 'Emergency Contacts', nameHi: 'आपातकालीन संपर्क', icon: '📞', income: 'Essential', difficulty: 'Very Low' },
      { name: 'Calm Mind', nameHi: 'शांत मन', icon: '🧘', income: 'Critical', difficulty: 'Medium' }
    ],
    appHelp: [
      { title: 'SOS Alert', titleHi: 'SOS अलर्ट', description: 'Instant notification with location', descriptionHi: 'लोकेशन के साथ तत्काल अलर्ट' },
      { title: 'Emergency Services', titleHi: 'आपातकालीन सेवाएं', description: 'Quick access to police, ambulance', descriptionHi: 'पुलिस, एम्बुलेंस तक त्वरित पहुंच' },
      { title: 'Location Share', titleHi: 'लोकेशन शेयर', description: 'Real-time location tracking', descriptionHi: 'रियल-टाइम लोकेशन ट्रैकिंग' },
      { title: 'Community Alert', titleHi: 'समुदाय अलर्ट', description: 'Notify nearby helpers', descriptionHi: 'पास के मददगारों को सूचित करें' }
    ]
  }
}

// Export a function to get story by ID with fallback
export function getIncomeStory(categoryId: string): IncomeStory {
  return incomeStories[categoryId] || defaultStory
}

// Default story for unhandled categories
const defaultStory: IncomeStory = {
  story: {
    title: 'Earn From Your Resources',
    titleHi: 'अपने संसाधनों से कमाएं',
    intro: 'Your unused items and skills can generate income!',
    introHi: 'आपके अप्रयुक्त सामान और कौशल आय उत्पन्न कर सकते हैं!',
    income: 'Earn ₹200-1000 per help',
    incomeHi: 'प्रति मदद ₹200-1000 कमाएं',
    incomeRange: '₹200 - ₹1,000/help',
    demand: 'High demand in your area',
    demandHi: 'आपके क्षेत्र में उच्च मांग'
  },
  steps: [
    { step: 1, title: 'List Your Resource', titleHi: 'अपना संसाधन सूचीबद्ध करें', description: 'Post what you can offer on the app', descriptionHi: 'ऐप पर पोस्ट करें कि आप क्या पेशकश कर सकते हैं', icon: '📝' },
    { step: 2, title: 'Get Requests', titleHi: 'अनुरोध प्राप्त करें', description: 'People nearby will see and contact you', descriptionHi: 'पास के लोग देखेंगे और आपसे संपर्क करेंगे', icon: '🔔' },
    { step: 3, title: 'Connect & Help', titleHi: 'जुड़ें और मदद करें', description: 'Coordinate through call or message', descriptionHi: 'कॉल या संदेश के माध्यम से समन्वय करें', icon: '🤝' },
    { step: 4, title: 'Get Paid', titleHi: 'भुगतान प्राप्त करें', description: 'Receive payment after helping', descriptionHi: 'मदद करने के बाद भुगतान प्राप्त करें', icon: '💰' }
  ],
  resources: [
    { name: 'Time', nameHi: 'समय', icon: '⏰', income: '₹200-500/task', difficulty: 'Low' },
    { name: 'Tools', nameHi: 'टूल्स', icon: '🔧', income: '₹100-300/help', difficulty: 'Low' },
    { name: 'Skills', nameHi: 'कौशल', icon: '💡', income: '₹300-1000/task', difficulty: 'Medium' },
    { name: 'Items', nameHi: 'सामान', icon: '📦', income: '₹100-500/use', difficulty: 'Low' },
    { name: 'Vehicle', nameHi: 'वाहन', icon: '🏍️', income: '₹200-800/trip', difficulty: 'Medium' },
    { name: 'Space', nameHi: 'जगह', icon: '🏠', income: '₹100-500/use', difficulty: 'Low' }
  ],
  appHelp: [
    { title: 'Local Network', titleHi: 'स्थानीय नेटवर्क', description: 'Connect with people within 20 KM', descriptionHi: '20 KM के भीतर लोगों से जुड़ें' },
    { title: 'Safe Transactions', titleHi: 'सुरक्षित लेनदेन', description: 'Verified users and trust scores', descriptionHi: 'सत्यापित उपोयक्ता और ट्रस्ट स्कोर' },
    { title: 'Easy Communication', titleHi: 'आसान संचार', description: 'Direct calls and messages', descriptionHi: 'सीधे कॉल और संदेश' },
    { title: 'Track Earnings', titleHi: 'कमाई ट्रैक करें', description: 'See your total earnings in app', descriptionHi: 'ऐप में अपनी कुल कमाई देखें' }
  ]
}
