export const TRAVEL_FACTS = [
  'There are 195 countries in the world — how many have you visited?',
  'The world\'s most visited city is Bangkok with 22 million tourists annually.',
  'Antarctica is the only continent with no permanent human residents.',
  'The Great Wall of China is not visible from space — that\'s a myth!',
  'Iceland has no mosquitoes — it\'s one of the few places on Earth!',
  'France is the most visited country in the world with 90 million tourists.',
  'The shortest commercial flight is just 57 seconds long (Scotland).',
  'Tokyo has more Michelin-star restaurants than Paris.',
  'A "passport" originally meant permission to pass through a port.',
  'Singapore\'s airport has an indoor waterfall 40 meters high.',
];

export const INDIAN_CITIES = [
  'Ahmedabad', 'Amritsar', 'Bangalore', 'Bhopal', 'Bhubaneswar',
  'Chennai', 'Coimbatore', 'Delhi', 'Goa', 'Guwahati',
  'Hyderabad', 'Indore', 'Jaipur', 'Kochi', 'Kolkata',
  'Lucknow', 'Mumbai', 'Nagpur', 'Patna', 'Pune',
  'Srinagar', 'Surat', 'Thiruvananthapuram', 'Vadodara', 'Varanasi',
  'Visakhapatnam', 'Chandigarh', 'Dehradun', 'Jodhpur', 'Udaipur',
];

export const DESTINATIONS = [
  {
    id: 'd1', name: 'Bali', country: 'Indonesia', emoji: '🌺',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.8, reviewCount: 12840, basePrice: 55000, tag: 'Trending', tagColor: 'from-orange-400 to-rose-500',
    description: 'Tropical paradise with stunning temples and rice terraces',
    category: 'Beach & Culture', bestTime: 'Apr–Oct', temp: '28°C', currency: 'IDR', language: 'Bahasa',
    tripTypes: ['honeymoon', 'family', 'solo', 'cultural', 'adventure'],
    interests: ['Beach & Water', 'Temples & Heritage', 'Yoga & Wellness', 'Food & Cuisine', 'Photography'],
  },
  {
    id: 'd2', name: 'Paris', country: 'France', emoji: '🗼',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.7, reviewCount: 34200, basePrice: 145000, tag: 'Classic', tagColor: 'from-pink-400 to-purple-500',
    description: 'City of lights, love, and world-class cuisine',
    category: 'Culture & Food', bestTime: 'Apr–Jun', temp: '15°C', currency: 'EUR', language: 'French',
    tripTypes: ['honeymoon', 'cultural', 'luxury', 'solo'],
    interests: ['Museums & Art', 'Food & Cuisine', 'Shopping', 'Photography', 'Nightlife'],
  },
  {
    id: 'd3', name: 'Maldives', country: 'Maldives', emoji: '🏝️',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.9, reviewCount: 8920, basePrice: 210000, tag: 'Luxury', tagColor: 'from-cyan-400 to-blue-500',
    description: 'Crystal clear waters, overwater bungalows and coral reefs',
    category: 'Luxury & Beach', bestTime: 'Nov–Apr', temp: '30°C', currency: 'MVR', language: 'Dhivehi',
    tripTypes: ['honeymoon', 'luxury'],
    interests: ['Beach & Water', 'Yoga & Wellness'],
  },
  {
    id: 'd4', name: 'Tokyo', country: 'Japan', emoji: '🗾',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.8, reviewCount: 22100, basePrice: 115000, tag: 'Must Visit', tagColor: 'from-red-400 to-pink-500',
    description: 'Ultra-modern meets ancient tradition in Japan\'s capital',
    category: 'Culture & Tech', bestTime: 'Mar–May', temp: '18°C', currency: 'JPY', language: 'Japanese',
    tripTypes: ['cultural', 'solo', 'family', 'adventure'],
    interests: ['Food & Cuisine', 'Temples & Heritage', 'Shopping', 'Photography', 'Museums & Art'],
  },
  {
    id: 'd5', name: 'Santorini', country: 'Greece', emoji: '🏛️',
    image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.7, reviewCount: 15600, basePrice: 160000, tag: 'Romantic', tagColor: 'from-blue-400 to-indigo-500',
    description: 'Iconic white-washed buildings and breathtaking sunsets',
    category: 'Romantic & Beach', bestTime: 'May–Oct', temp: '25°C', currency: 'EUR', language: 'Greek',
    tripTypes: ['honeymoon', 'luxury', 'solo'],
    interests: ['Beach & Water', 'Photography', 'Food & Cuisine', 'Yoga & Wellness'],
  },
  {
    id: 'd6', name: 'Machu Picchu', country: 'Peru', emoji: '🏔️',
    image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.9, reviewCount: 9870, basePrice: 130000, tag: 'Adventure', tagColor: 'from-green-400 to-teal-500',
    description: 'Ancient Incan citadel set high in the Andes Mountains',
    category: 'Adventure & History', bestTime: 'Apr–Oct', temp: '14°C', currency: 'PEN', language: 'Spanish',
    tripTypes: ['adventure', 'solo', 'cultural'],
    interests: ['Trekking & Hiking', 'Photography', 'Temples & Heritage', 'Wildlife'],
  },
  {
    id: 'd7', name: 'Dubai', country: 'UAE', emoji: '🌆',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.6, reviewCount: 28700, basePrice: 100000, tag: 'Luxury', tagColor: 'from-yellow-400 to-orange-500',
    description: 'Futuristic skyline, luxury shopping and desert adventures',
    category: 'Luxury & Adventure', bestTime: 'Nov–Mar', temp: '25°C', currency: 'AED', language: 'Arabic',
    tripTypes: ['luxury', 'family', 'adventure', 'honeymoon'],
    interests: ['Shopping', 'Adventure Sports', 'Food & Cuisine', 'Nightlife'],
  },
  {
    id: 'd8', name: 'Tuscany', country: 'Italy', emoji: '🍷',
    image: 'https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.7, reviewCount: 11200, basePrice: 140000, tag: 'Scenic', tagColor: 'from-amber-400 to-red-500',
    description: 'Rolling hills, vineyards and Renaissance art and culture',
    category: 'Culture & Food', bestTime: 'Apr–Jun', temp: '20°C', currency: 'EUR', language: 'Italian',
    tripTypes: ['cultural', 'honeymoon', 'luxury'],
    interests: ['Food & Cuisine', 'Museums & Art', 'Photography', 'Local Markets'],
  },
  {
    id: 'd9', name: 'Queenstown', country: 'New Zealand', emoji: '🎿',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.8, reviewCount: 7340, basePrice: 155000, tag: 'Adventure', tagColor: 'from-green-400 to-emerald-500',
    description: 'Adventure capital of the world with stunning fjords',
    category: 'Adventure & Nature', bestTime: 'Dec–Feb', temp: '18°C', currency: 'NZD', language: 'English',
    tripTypes: ['adventure', 'solo'],
    interests: ['Adventure Sports', 'Trekking & Hiking', 'Photography', 'Wildlife'],
  },
  {
    id: 'd10', name: 'Rajasthan', country: 'India', emoji: '🏰',
    image: 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.6, reviewCount: 18900, basePrice: 42000, tag: 'Cultural', tagColor: 'from-orange-400 to-amber-500',
    description: 'Land of maharajas with majestic forts and vibrant culture',
    category: 'Culture & Heritage', bestTime: 'Oct–Mar', temp: '22°C', currency: 'INR', language: 'Hindi',
    tripTypes: ['cultural', 'family', 'honeymoon', 'solo'],
    interests: ['Temples & Heritage', 'Local Markets', 'Photography', 'Food & Cuisine'],
  },
  {
    id: 'd11', name: 'Iceland', country: 'Iceland', emoji: '🌌',
    image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.9, reviewCount: 6230, basePrice: 180000, tag: 'Unique', tagColor: 'from-indigo-400 to-violet-500',
    description: 'Northern lights, geysers, waterfalls and hot springs',
    category: 'Nature & Adventure', bestTime: 'Jun–Aug', temp: '8°C', currency: 'ISK', language: 'Icelandic',
    tripTypes: ['adventure', 'solo', 'honeymoon'],
    interests: ['Trekking & Hiking', 'Photography', 'Wildlife', 'Adventure Sports'],
  },
  {
    id: 'd12', name: 'Amalfi Coast', country: 'Italy', emoji: '🌊',
    image: 'https://images.pexels.com/photos/35493411/pexels-photo-35493411.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    rating: 4.7, reviewCount: 9870, basePrice: 150000, tag: 'Scenic', tagColor: 'from-cyan-400 to-teal-500',
    description: 'Dramatic cliffs, colorful villages and azure Mediterranean waters',
    category: 'Scenic & Romantic', bestTime: 'May–Oct', temp: '24°C', currency: 'EUR', language: 'Italian',
    tripTypes: ['honeymoon', 'luxury', 'cultural'],
    interests: ['Beach & Water', 'Photography', 'Food & Cuisine', 'Yoga & Wellness'],
  },
];

export const PACKAGES = [
  {
    id: 'p1', type: 'honeymoon', icon: '💍', color: 'from-pink-500 to-rose-600',
    title: 'Eternal Romance Package',
    destinations: ['Maldives', 'Bali', 'Santorini'],
    baseDestinations: ['Maldives', 'Bali', 'Santorini'],
    duration: '10 nights', price: 225000, originalPrice: 280000,
    features: ['Private beach villa', 'Candlelit dinners', 'Couple spa', 'Sunset cruise'],
    rating: 4.9, reviews: 2840, badge: 'Best Seller',
    itinerary: ['Arrive Maldives, check into overwater villa', 'Snorkeling & dolphin watching', 'Sunset cruise & spa', 'Fly to Bali', 'Ubud temples & rice terraces', 'Kecak fire dance', 'Fly to Santorini', 'Oia sunset walk', 'Wine tasting & caldera views', 'Departure'],
  },
  {
    id: 'p2', type: 'adventure', icon: '🧗', color: 'from-orange-500 to-amber-600',
    title: 'Thrill Seekers Expedition',
    destinations: ['Queenstown', 'Machu Picchu', 'Iceland'],
    baseDestinations: ['Queenstown', 'Machu Picchu', 'Iceland'],
    duration: '14 nights', price: 260000, originalPrice: 320000,
    features: ['Bungee jumping', 'Glacier trek', 'White water rafting', 'Skydiving'],
    rating: 4.8, reviews: 1920, badge: 'Top Rated',
    itinerary: ['Arrive Queenstown', 'Bungee jump & canyon swing', 'Skydiving experience', 'Fly to Peru', 'Lima city tour', 'Cusco acclimatization', 'Inca Trail trek', 'Machu Picchu sunrise', 'Fly to Iceland', 'Golden Circle tour', 'Northern Lights hunt', 'Glacier hike', 'Blue Lagoon soak', 'Departure'],
  },
  {
    id: 'p3', type: 'family', icon: '👨‍👩‍👧‍👦', color: 'from-violet-500 to-purple-600',
    title: 'Family Fun Vacation',
    destinations: ['Bali', 'Dubai', 'Tokyo'],
    baseDestinations: ['Bali', 'Dubai', 'Tokyo'],
    duration: '8 nights', price: 170000, originalPrice: 215000,
    features: ['Theme park tickets', 'Kid-friendly meals', 'Family suites', 'Guided tours'],
    rating: 4.7, reviews: 3210, badge: 'Family Choice',
    itinerary: ['Arrive Bali, family villa check-in', 'Elephant safari park', 'Fly to Dubai', 'Burj Khalifa visit', 'Dubai Mall & aquarium', 'Desert safari with dinner', 'Fly to Tokyo', 'Disneyland Tokyo', 'Departure'],
  },
  {
    id: 'p4', type: 'cultural', icon: '🏛️', color: 'from-teal-500 to-cyan-600',
    title: 'Heritage Explorer Tour',
    destinations: ['Rajasthan', 'Tuscany', 'Japan'],
    baseDestinations: ['Rajasthan', 'Tuscany', 'Japan'],
    duration: '12 nights', price: 205000, originalPrice: 255000,
    features: ['Heritage hotel stays', 'Expert local guides', 'Cooking classes', 'Museum passes'],
    rating: 4.8, reviews: 1540, badge: 'Curated',
    itinerary: ['Arrive Jaipur, Pink City tour', 'Amber Fort & Jal Mahal', 'Udaipur lake palace', 'Fly to Florence', 'Uffizi Gallery', 'Siena & San Gimignano', 'Cooking class in Chianti', 'Fly to Kyoto', 'Fushimi Inari shrine', 'Nishiki Market', 'Tea ceremony', 'Departure'],
  },
  {
    id: 'p5', type: 'solo', icon: '🎒', color: 'from-green-500 to-emerald-600',
    title: 'Backpacker\'s Discovery',
    destinations: ['Southeast Asia', 'India', 'Nepal'],
    baseDestinations: ['Southeast Asia', 'India', 'Nepal'],
    duration: '21 nights', price: 78000, originalPrice: 100000,
    features: ['Hostel network', 'Rail passes', 'Local food tours', 'Free walking tours'],
    rating: 4.6, reviews: 4780, badge: 'Budget Pick',
    itinerary: ['Bangkok arrival', 'Chiang Mai temples', 'Pai mountain village', 'Vietnam border crossing', 'Hoi An ancient town', 'Cambodia - Angkor Wat', 'Fly to Delhi', 'Varanasi ghats', 'Train to Kathmandu', 'Everest base camp trek', 'Pokhara relaxation', 'Departure'],
  },
  {
    id: 'p6', type: 'luxury', icon: '✨', color: 'from-yellow-500 to-amber-600',
    title: 'Ultra Premium Escape',
    destinations: ['Monaco', 'Dubai', 'Maldives'],
    baseDestinations: ['Monaco', 'Dubai', 'Maldives'],
    duration: '7 nights', price: 530000, originalPrice: 680000,
    features: ['Private jet transfer', '7-star hotels', 'Personal butler', 'Michelin dining'],
    rating: 5.0, reviews: 820, badge: 'Elite',
    itinerary: ['Private jet to Monaco', 'Formula 1 circuit tour', 'Monte Carlo casino evening', 'Fly to Dubai', 'Burj Al Arab stay', 'Helicopter city tour', 'Fly to Maldives', 'Overwater villa farewell'],
  },
];

export const FLIGHT_CLASSES = [
  { id: 'fc1', name: 'Economy', icon: '💺', color: 'from-slate-400 to-slate-600', price: 9500, features: ['Standard seat', '20kg luggage', 'Meal included', 'Window/Aisle choice'], duration: '8h 20m', airline: 'IndiGo', stops: '1 stop' },
  { id: 'fc2', name: 'Premium Economy', icon: '🛫', color: 'from-blue-400 to-blue-600', price: 22000, features: ['Extra legroom', '25kg luggage', 'Premium meal', 'Priority boarding'], duration: '8h 20m', airline: 'Air India', stops: '1 stop' },
  { id: 'fc3', name: 'Business Class', icon: '🥂', color: 'from-violet-400 to-purple-600', price: 52000, features: ['Flat-bed seat', '35kg luggage', 'Gourmet dining', 'Lounge access'], duration: '7h 45m', airline: 'Emirates', stops: 'Non-stop' },
  { id: 'fc4', name: 'First Class', icon: '👑', color: 'from-yellow-400 to-amber-600', price: 110000, features: ['Private suite', '50kg luggage', 'Chef on board', 'Limo transfer'], duration: '7h 45m', airline: 'Singapore Air', stops: 'Non-stop' },
];

export const HOTEL_CLASSES = [
  { id: 'h1', name: 'Budget Stay', icon: '🏠', color: 'from-slate-400 to-slate-600', pricePerNight: 2800, features: ['Clean & comfortable', 'Free WiFi', 'Breakfast included', 'City center'], rating: 3.8, brand: 'OYO Rooms' },
  { id: 'h2', name: 'Standard Hotel', icon: '🏨', color: 'from-blue-400 to-blue-600', pricePerNight: 7500, features: ['Swimming pool', 'Restaurant', 'Gym access', 'Room service'], rating: 4.2, brand: 'Ibis Hotels' },
  { id: 'h3', name: 'Deluxe Resort', icon: '🌴', color: 'from-green-400 to-teal-600', pricePerNight: 18000, features: ['Beachfront property', 'Infinity pool', 'Spa & wellness', 'Multiple dining'], rating: 4.6, brand: 'Marriott' },
  { id: 'h4', name: 'Luxury Villa', icon: '🏰', color: 'from-yellow-400 to-amber-600', pricePerNight: 42000, features: ['Private pool', 'Personal chef', 'Butler service', 'Helicopter pad'], rating: 4.9, brand: 'Four Seasons' },
];

export const GUIDE_CLASSES = [
  { id: 'g1', name: 'Self-Guided', icon: '📱', color: 'from-slate-400 to-slate-600', price: 0, features: ['Digital maps', 'Audio guides', 'Online support', 'Flexible timing'] },
  { id: 'g2', name: 'Group Tour', icon: '👥', color: 'from-blue-400 to-blue-600', price: 3500, features: ['Certified guide', '15-20 people', 'Fixed itinerary', 'Multiple languages'] },
  { id: 'g3', name: 'Private Guide', icon: '🎯', color: 'from-green-400 to-teal-600', price: 9500, features: ['Personal guide', 'Custom itinerary', 'Insider access', 'Full day coverage'] },
  { id: 'g4', name: 'Expert Concierge', icon: '🎩', color: 'from-yellow-400 to-amber-600', price: 22000, features: ['VIP guide', '24/7 assistance', 'Skip-the-line access', 'Exclusive experiences'] },
];

export const CAB_CLASSES = [
  { id: 'c1', name: 'Economy Cab', icon: '🚕', color: 'from-slate-400 to-slate-600', pricePerDay: 1400, features: ['Sedan/Hatchback', 'A/C', '4 passengers', 'GPS navigation'] },
  { id: 'c2', name: 'Comfort SUV', icon: '🚙', color: 'from-blue-400 to-blue-600', pricePerDay: 3200, features: ['Premium SUV', 'A/C + WiFi', '6 passengers', 'Expert driver'] },
  { id: 'c3', name: 'Luxury Car', icon: '🏎️', color: 'from-violet-400 to-purple-600', pricePerDay: 7500, features: ['BMW / Mercedes', 'Champagne bar', '4 passengers', 'Chauffeur service'] },
  { id: 'c4', name: 'Premium Limo', icon: '🚐', color: 'from-yellow-400 to-amber-600', pricePerDay: 18000, features: ['Stretch limousine', 'Minibar + TV', '8 passengers', 'Red carpet service'] },
];

export const WEATHER_DATA: Record<string, { temp: number; condition: string; icon: string; humidity: number; wind: number; forecast: { day: string; high: number; low: number; icon: string }[] }> = {
  'Bali': { temp: 28, condition: 'Partly Cloudy', icon: '⛅', humidity: 75, wind: 14, forecast: [{ day: 'Today', high: 30, low: 24, icon: '⛅' }, { day: 'Tue', high: 29, low: 23, icon: '🌧️' }, { day: 'Wed', high: 31, low: 25, icon: '☀️' }, { day: 'Thu', high: 28, low: 22, icon: '⛅' }, { day: 'Fri', high: 30, low: 24, icon: '☀️' }] },
  'Paris': { temp: 16, condition: 'Light Rain', icon: '🌦️', humidity: 82, wind: 22, forecast: [{ day: 'Today', high: 17, low: 11, icon: '🌦️' }, { day: 'Tue', high: 19, low: 13, icon: '⛅' }, { day: 'Wed', high: 21, low: 15, icon: '☀️' }, { day: 'Thu', high: 18, low: 12, icon: '🌧️' }, { day: 'Fri', high: 20, low: 14, icon: '⛅' }] },
  'Maldives': { temp: 30, condition: 'Sunny', icon: '☀️', humidity: 70, wind: 18, forecast: [{ day: 'Today', high: 31, low: 27, icon: '☀️' }, { day: 'Tue', high: 30, low: 26, icon: '☀️' }, { day: 'Wed', high: 31, low: 27, icon: '⛅' }, { day: 'Thu', high: 29, low: 25, icon: '☀️' }, { day: 'Fri', high: 30, low: 26, icon: '☀️' }] },
  'Tokyo': { temp: 18, condition: 'Clear', icon: '☀️', humidity: 60, wind: 12, forecast: [{ day: 'Today', high: 19, low: 12, icon: '☀️' }, { day: 'Tue', high: 21, low: 14, icon: '☀️' }, { day: 'Wed', high: 20, low: 13, icon: '⛅' }, { day: 'Thu', high: 18, low: 11, icon: '🌧️' }, { day: 'Fri', high: 19, low: 13, icon: '☀️' }] },
  'Dubai': { temp: 35, condition: 'Hot & Sunny', icon: '☀️', humidity: 45, wind: 20, forecast: [{ day: 'Today', high: 37, low: 28, icon: '☀️' }, { day: 'Tue', high: 36, low: 27, icon: '☀️' }, { day: 'Wed', high: 38, low: 29, icon: '☀️' }, { day: 'Thu', high: 35, low: 26, icon: '☀️' }, { day: 'Fri', high: 34, low: 25, icon: '☀️' }] },
  'Rajasthan': { temp: 32, condition: 'Sunny & Dry', icon: '☀️', humidity: 30, wind: 10, forecast: [{ day: 'Today', high: 35, low: 22, icon: '☀️' }, { day: 'Tue', high: 34, low: 21, icon: '☀️' }, { day: 'Wed', high: 36, low: 23, icon: '☀️' }, { day: 'Thu', high: 33, low: 20, icon: '⛅' }, { day: 'Fri', high: 35, low: 22, icon: '☀️' }] },
  'Iceland': { temp: 8, condition: 'Aurora Night', icon: '🌌', humidity: 72, wind: 30, forecast: [{ day: 'Today', high: 9, low: 3, icon: '🌌' }, { day: 'Tue', high: 7, low: 1, icon: '❄️' }, { day: 'Wed', high: 10, low: 4, icon: '⛅' }, { day: 'Thu', high: 8, low: 2, icon: '🌧️' }, { day: 'Fri', high: 9, low: 3, icon: '🌌' }] },
  'default': { temp: 22, condition: 'Pleasant', icon: '⛅', humidity: 65, wind: 16, forecast: [{ day: 'Today', high: 24, low: 18, icon: '⛅' }, { day: 'Tue', high: 25, low: 19, icon: '☀️' }, { day: 'Wed', high: 23, low: 17, icon: '🌧️' }, { day: 'Thu', high: 22, low: 16, icon: '⛅' }, { day: 'Fri', high: 24, low: 18, icon: '☀️' }] },
};

export const CURRENCY_RATES: Record<string, { rate: number; symbol: string; flag: string }> = {
  'INR': { rate: 1, symbol: '₹', flag: '🇮🇳' },
  'USD': { rate: 0.012, symbol: '$', flag: '🇺🇸' },
  'EUR': { rate: 0.011, symbol: '€', flag: '🇪🇺' },
  'GBP': { rate: 0.0095, symbol: '£', flag: '🇬🇧' },
  'JPY': { rate: 1.78, symbol: '¥', flag: '🇯🇵' },
  'AED': { rate: 0.044, symbol: 'د.إ', flag: '🇦🇪' },
  'SGD': { rate: 0.016, symbol: 'S$', flag: '🇸🇬' },
  'AUD': { rate: 0.018, symbol: 'A$', flag: '🇦🇺' },
  'THB': { rate: 0.43, symbol: '฿', flag: '🇹🇭' },
  'IDR': { rate: 195.5, symbol: 'Rp', flag: '🇮🇩' },
};

export const AI_RESPONSES: Record<string, string> = {
  'budget': 'For budget travel, I recommend Southeast Asia destinations like Bali, Thailand, or Vietnam. You can explore these beauties for ₹55,000–₹78,000 for 7 nights. Key money-saving tips: travel in shoulder season, use local transport, and eat at local restaurants! 🎒',
  'honeymoon': 'For an unforgettable honeymoon, the Maldives with overwater bungalows is magical (₹2.1L+). For budget-friendly romance, Bali offers stunning rice terraces and temples (from ₹90K). Santorini\'s sunsets are legendary for couples! What\'s your budget range? 💑',
  'family': 'Family trips need a balance of fun and comfort! Dubai is perfect with theme parks, aquariums, and desert safaris. Bali offers cultural experiences kids love. Tokyo blends technology and tradition. Budget ₹1.7L–₹2.8L for a family of 4 for 7 nights. 👨‍👩‍👧‍👦',
  'adventure': 'Adventure seekers, head to Queenstown NZ (bungee, skydive), Machu Picchu Peru (trek), or Iceland (glacier walk, Northern Lights). Each offers unique thrills! Start with physical preparation 6–8 weeks before departure. 🧗‍♂️',
  'visa': 'Visa requirements vary by destination. Indonesia (Bali) offers visa-on-arrival for Indians. UAE requires prior visa approval. Japan needs pre-approval (takes 5–7 days). European countries need Schengen visa applied 4–6 weeks ahead. 🛂',
  'packing': 'Essential packing tips: Roll clothes instead of folding, use packing cubes, carry universal adapter, download offline maps, bring a basic first aid kit, and always keep important docs in a digital backup! 🧳',
  'safety': 'Stay safe while traveling: Register with your country\'s embassy for long trips, share itinerary with family, use hotel safes for valuables, get travel insurance (highly recommended!), and download local emergency numbers. 🛡️',
  'food': 'Food is a highlight of any trip! Try street food in Thailand, sushi in Japan, pasta in Italy, and kebabs in Turkey. Always check food hygiene ratings, carry basic digestive medicine, and stay hydrated especially in tropical climates! 🍜',
  'weather': 'Best times to visit: Bali (Apr–Oct), Paris (Apr–Jun & Sep–Oct), Maldives (Nov–Apr), Tokyo (Mar–May & Sep–Nov), Dubai (Nov–Mar), Santorini (May–Oct). I can give you more specific weather advice for your destination! 🌤️',
  'flight': 'Best flight booking tips: Book 6–8 weeks in advance, fly mid-week for lower fares, use incognito mode, set price alerts, and consider nearby airports. Business class upgrades are cheapest during off-peak seasons! ✈️',
  'insurance': 'Travel insurance is a must! Comprehensive plans cover: medical emergencies, trip cancellation, lost luggage, and flight delays. For international trips over ₹50K, always opt for comprehensive coverage. Costs ₹500–₹2000 per trip. 🛡️',
  'currency': 'Currency tips: Avoid airport exchange counters (worst rates). Use ATMs at destination for better rates. Inform your bank before travel. Carry some local cash for taxis & small vendors. Cards are widely accepted in most countries. 💳',
  'hello': 'Hello! Welcome to TripForge AI assistant! I\'m here to help you plan your perfect trip. Ask me about destinations, budgets, visa requirements, packing tips, or anything travel-related! 🌍✈️',
  'hi': 'Hi there! I\'m your TripForge travel companion. Ready to help you forge your perfect journey! Ask me anything about travel planning, destinations, or tips. 😊🌍',
  'default': 'I\'m your TripForge AI assistant! I can help you with destination recommendations, travel tips, visa info, packing guides, weather forecasts, budgeting, and much more. What would you like to know about your upcoming adventure? 🌍',
};

export const ACHIEVEMENTS = [
  { id: 'a1', icon: '🌍', title: 'Globe Trotter', desc: '10+ countries visited', earned: true },
  { id: 'a2', icon: '✈️', title: 'Sky Miles Pro', desc: '50,000+ miles flown', earned: true },
  { id: 'a3', icon: '⭐', title: 'Review Master', desc: '25+ reviews written', earned: true },
  { id: 'a4', icon: '💰', title: 'Smart Saver', desc: 'Saved ₹50,000 on bookings', earned: true },
  { id: 'a5', icon: '🏆', title: 'Gold Member', desc: 'Loyalty program milestone', earned: true },
  { id: 'a6', icon: '🎯', title: 'Trip Planner', desc: '20+ trips planned', earned: false },
  { id: 'a7', icon: '🌙', title: 'Night Owl', desc: 'Late night explorer', earned: false },
  { id: 'a8', icon: '📸', title: 'Photographer', desc: 'Share 100 travel photos', earned: false },
];

export const ITINERARY_ACTIVITIES: Record<string, string[][]> = {
  'Bali': [
    ['🌅 Sunrise at Mount Batur', '🏊 Tegallalang Rice Terrace Walk', '🛕 Pura Ulun Danu Temple', '🍜 Ubud Night Market'],
    ['🐬 Snorkeling at Nusa Penida', '🌊 Kelingking Beach', '🧘 Yoga & Wellness Retreat', '🎭 Kecak Fire Dance'],
    ['🛍️ Seminyak Shopping', '🏄 Surf Lessons at Kuta Beach', '💆 Traditional Balinese Massage', '🌺 Tirta Empul Holy Springs'],
    ['🚣 White Water Rafting', '🌴 Monkey Forest Ubud', '🎨 Batik Painting Workshop', '🍹 Rooftop Bar Sunset'],
    ['🐘 Elephant Safari Park', '🏊 Blue Lagoon Snorkeling', '🛕 Tanah Lot Temple Sunset', '🎵 Traditional Music Show'],
    ['🌿 Coffee & Tea Plantation', '🏔️ Mount Agung Hike', '🎁 Souvenir Shopping', '🍽️ Farewell Gala Dinner'],
    ['🚁 Helicopter Island Tour', '💎 Spa & Wellness Day', '📸 Professional Photoshoot', '✈️ Airport Transfer'],
  ],
  'Paris': [
    ['🗼 Eiffel Tower Visit', '🎨 Louvre Museum', '🍷 Seine River Cruise', '🌃 Champs-Élysées Evening'],
    ['🏛️ Notre-Dame Cathedral', '🧇 Breakfast at Café de Flore', '🎭 Moulin Rouge Show', '🍰 Patisserie Tour'],
    ['🛍️ Galeries Lafayette Shopping', '🏰 Palace of Versailles', '🎻 Street Music in Montmartre', '🍾 Champagne Tasting'],
    ['🖼️ Musée d\'Orsay', '🥐 French Cooking Class', '⛲ Luxembourg Gardens', '🌹 Romantic Dinner'],
    ['🚲 Cycling along Seine', '🗿 Sacré-Cœur Basilica', '🧀 Cheese & Wine Tour', '🎪 Paris Night Walk'],
    ['🛒 Local Flea Market', '🏛️ Palais Royal', '💐 Flower Market Visit', '✈️ Farewell'],
    ['📸 Photography Walk', '☕ Hidden Café Tour', '🎁 Souvenir Shopping', '✈️ Airport Transfer'],
  ],
  'Dubai': [
    ['🌆 Burj Khalifa Observation Deck', '🛍️ Dubai Mall', '🌊 Dubai Fountain Show', '🌃 Downtown Dinner'],
    ['🏜️ Desert Safari', '🐪 Camel Riding', '🔥 Bedouin Camp BBQ', '🌌 Stargazing in Desert'],
    ['🏖️ JBR Beach', '🚤 Dhow Cruise Creek', '🏛️ Gold & Spice Souk', '🕌 Grand Mosque'],
    ['🏄 Water Parks', '🐠 Dubai Aquarium', '🎢 IMG Worlds of Adventure', '🍽️ Global Village Dinner'],
    ['✈️ Sky Diving', '🏎️ Ferrari World', '🌴 Palm Jumeirah Tour', '🥂 Atlantis Resort'],
    ['🛒 Deira City Centre', '🌅 Sunrise at Desert', '🎭 Dubai Opera Show', '🍰 Dessert Festival'],
    ['💆 Spa Day', '🚁 Helicopter Tour', '🎁 Last-minute Shopping', '✈️ Airport Transfer'],
  ],
  'Tokyo': [
    ['⛩️ Senso-ji Temple Asakusa', '🏯 Imperial Palace East Gardens', '🍜 Ramen in Shinjuku', '🌃 Tokyo Tower Night View'],
    ['🎮 Akihabara Tech District', '🍣 Tsukiji Fish Market', '🌸 Ueno Park', '🎌 Traditional Tea Ceremony'],
    ['🗻 Mt. Fuji Day Trip', '♨️ Hakone Hot Springs', '🎿 Lake Ashi Cruise', '🌅 Fuji Sunrise View'],
    ['🛍️ Harajuku Fashion Street', '🎨 teamLab Borderless', '🍡 Shibuya Crossing', '🍶 Izakaya Night'],
    ['🌳 Nikko Shrines', '🦌 Nara Deer Park', '⛩️ Fushimi Inari Kyoto', '🎎 Maiko Show'],
    ['🐙 Osaka Street Food Tour', '🏯 Osaka Castle', '🎡 Universal Studios Japan', '🍺 Dotonbori Night'],
    ['🎁 Souvenir Hunting Nakamise', '📸 Odaiba Waterfront', '🤖 Robot Restaurant', '✈️ Departure'],
  ],
  'default': [
    ['🌅 Arrive & Check-in', '🗺️ Orientation Walk', '🍽️ Welcome Dinner', '🌙 Evening Stroll'],
    ['🏛️ Main Attraction Visit', '🍜 Local Cuisine Lunch', '🛍️ Market Shopping', '🎭 Cultural Show'],
    ['🌿 Nature & Outdoors', '📸 Photography Tour', '💆 Relaxation & Spa', '🍹 Sunset Cocktails'],
    ['🎯 Adventure Activity', '🏊 Water Sports', '🎨 Art & Craft Workshop', '🌙 Night Market'],
    ['🚌 Day Trip to Nearby Site', '🥘 Cooking Class', '🛍️ Souvenir Shopping', '🎵 Live Music Evening'],
    ['🚣 Water Excursion', '🌴 Beach Time', '🍦 Dessert Tour', '🎇 Cultural Festival'],
    ['📦 Pack & Checkout', '🛕 Last Temple/Monument', '🍽️ Farewell Lunch', '✈️ Departure'],
  ],
};

export const LIMITED_OFFERS = [
  { id: 'lo1', title: '🔥 Flash Sale', dest: 'Bali', originalPrice: 75000, salePrice: 49000, expiresIn: 86400, discount: '35%' },
  { id: 'lo2', title: '⚡ Last Minute', dest: 'Dubai', originalPrice: 110000, salePrice: 82000, expiresIn: 43200, discount: '25%' },
  { id: 'lo3', title: '🌙 Weekend Deal', dest: 'Goa', originalPrice: 35000, salePrice: 22000, expiresIn: 172800, discount: '37%' },
];

export const TRIP_TYPES = [
  { value: 'honeymoon', label: 'Honeymoon 💍', icon: '💍' },
  { value: 'adventure', label: 'Adventure 🧗', icon: '🧗' },
  { value: 'family', label: 'Family 👨‍👩‍👧‍👦', icon: '👨‍👩‍👧‍👦' },
  { value: 'solo', label: 'Solo 🎒', icon: '🎒' },
  { value: 'cultural', label: 'Cultural 🏛️', icon: '🏛️' },
  { value: 'luxury', label: 'Luxury ✨', icon: '✨' },
  { value: 'wildlife', label: 'Wildlife 🦁', icon: '🦁' },
  { value: 'cruise', label: 'Cruise 🚢', icon: '🚢' },
];

export const INTERESTS = [
  'Food & Cuisine',
  'Temples & Heritage',
  'Beach & Water',
  'Trekking & Hiking',
  'Shopping',
  'Nightlife',
  'Photography',
  'Yoga & Wellness',
  'Wildlife',
  'Museums & Art',
  'Local Markets',
  'Adventure Sports',
];

export const TRAVEL_TIPS = [
  { icon: '📱', tip: 'Download offline maps before you leave. Google Maps and Maps.me work great without internet.' },
  { icon: '💊', tip: 'Carry a basic travel medical kit: antacids, antihistamines, pain relievers, and band-aids.' },
  { icon: '🔌', tip: 'Get a universal travel adapter. Most countries use different plug types.' },
  { icon: '💳', tip: 'Inform your bank about international travel to avoid card blocks abroad.' },
  { icon: '📄', tip: 'Keep digital copies of all documents: passport, visa, insurance, hotel bookings.' },
  { icon: '🌐', tip: 'Get a local SIM or international data plan. Staying connected is crucial for navigation.' },
  { icon: '💰', tip: 'Always have some local cash for emergencies, tips, and small vendors.' },
  { icon: '🏥', tip: 'Purchase comprehensive travel insurance covering medical, cancellation, and baggage.' },
];

export const REWARDS_DATA = {
  points: 4850,
  tier: 'Gold Explorer',
  nextTier: 'Platinum Voyager',
  pointsToNext: 1150,
  recentActivity: [
    { desc: 'Bali trip booking', points: +1200, date: '2 days ago', type: 'earned' },
    { desc: 'Referral bonus - Priya', points: +500, date: '1 week ago', type: 'earned' },
    { desc: 'Redeemed: Flight Upgrade', points: -800, date: '2 weeks ago', type: 'redeemed' },
    { desc: 'Dubai trip booking', points: +1800, date: '1 month ago', type: 'earned' },
    { desc: 'App review bonus', points: +150, date: '1 month ago', type: 'earned' },
  ],
  rewards: [
    { id: 'r1', title: '₹500 Off Next Booking', points: 1000, icon: '🎫', category: 'Discount' },
    { id: 'r2', title: 'Free Airport Transfer', points: 1500, icon: '🚗', category: 'Travel' },
    { id: 'r3', title: 'Lounge Access Pass', points: 2000, icon: '🛋️', category: 'Travel' },
    { id: 'r4', title: '1 Night Free Hotel Stay', points: 3000, icon: '🏨', category: 'Stay' },
    { id: 'r5', title: 'Business Class Upgrade', points: 5000, icon: '🥂', category: 'Flight' },
    { id: 'r6', title: 'Exclusive Spa Package', points: 2500, icon: '💆', category: 'Experience' },
  ],
};
