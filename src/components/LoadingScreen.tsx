import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRAVEL_FACTS, FLIGHT_CLASSES, HOTEL_CLASSES, GUIDE_CLASSES, CAB_CLASSES, ITINERARY_ACTIVITIES } from '../data/constants';
import { TripPlan } from '../types';

const LOADING_STEPS = [
  { label: 'Searching best flights...', icon: '✈️', duration: 800 },
  { label: 'Finding perfect hotels...', icon: '🏨', duration: 700 },
  { label: 'Curating local experiences...', icon: '🗺️', duration: 600 },
  { label: 'Checking weather forecasts...', icon: '⛅', duration: 500 },
  { label: 'Applying dynamic pricing...', icon: '💰', duration: 600 },
  { label: 'Building day-wise itinerary...', icon: '📅', duration: 700 },
  { label: 'Finalising your perfect plan...', icon: '🎯', duration: 500 },
];

// Dynamic pricing based on how far in advance the trip is booked
function getDynamicPriceMultiplier(dateStr: string): number {
  if (!dateStr) return 1.0;
  const today = new Date();
  const departure = new Date(dateStr);
  const daysUntil = Math.ceil((departure.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 3) return 1.8;       // Very last minute — highest price
  if (daysUntil <= 7) return 1.5;       // 1 week — high price
  if (daysUntil <= 14) return 1.3;      // 2 weeks
  if (daysUntil <= 30) return 1.15;     // 1 month
  if (daysUntil <= 60) return 1.0;      // 2 months — base
  if (daysUntil <= 90) return 0.95;     // 3 months — slight discount
  return 0.90;                           // 3+ months — best advance price
}

// Destination-based price multiplier for realistic pricing
function getDestinationMultiplier(destName: string): number {
  const multipliers: Record<string, number> = {
    'Bali': 1.0, 'Rajasthan': 0.85, 'Goa': 0.80,
    'Dubai': 1.4, 'Thailand': 0.90,
    'Paris': 1.8, 'Maldives': 2.2, 'Santorini': 1.9, 'Tuscany': 1.7, 'Amalfi Coast': 1.8,
    'Tokyo': 1.5, 'Iceland': 1.9, 'Queenstown': 1.6, 'Machu Picchu': 1.4,
  };
  return multipliers[destName] || 1.1;
}

export default function LoadingScreen() {
  const { currentPrefs, setCurrentPlan, setScreen } = useApp();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [factIndex, setFactIndex] = useState(Math.floor(Math.random() * TRAVEL_FACTS.length));

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex(i => (i + 1) % TRAVEL_FACTS.length);
    }, 2000);
    return () => clearInterval(factInterval);
  }, []);

  useEffect(() => {
    if (!currentPrefs) { setScreen('dashboard'); return; }

    let elapsed = 0;
    const totalTime = LOADING_STEPS.reduce((s, step) => s + step.duration, 0);
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 0;

    LOADING_STEPS.forEach((step, i) => {
      const timer = setTimeout(() => setCurrentStep(i), cumulative);
      stepTimers.push(timer);
      cumulative += step.duration;
    });

    const progressInterval = setInterval(() => {
      elapsed += 50;
      setProgress(Math.min((elapsed / totalTime) * 100, 99));
    }, 50);

    const doneTimer = setTimeout(() => {
      setProgress(100);
      const prefs = currentPrefs;

      // Get itinerary
      const activityPool = ITINERARY_ACTIVITIES[prefs.destination] || ITINERARY_ACTIVITIES['default'];
      const itinerary = Array.from({ length: Math.min(prefs.duration, activityPool.length) }, (_, i) => activityPool[i]);
      while (itinerary.length < prefs.duration) {
        itinerary.push(ITINERARY_ACTIVITIES['default'][itinerary.length % ITINERARY_ACTIVITIES['default'].length]);
      }

      // Pick classes based on priority/budget
      const priorityMap = { budget: 0, comfort: 1, experience: 2 };
      const budgetFactor = priorityMap[prefs.priority] ?? 1;
      const flightIdx = Math.min(budgetFactor, 3);
      const hotelIdx = Math.min(budgetFactor, 3);
      const guideIdx = Math.min(budgetFactor, 3);
      const cabIdx = Math.min(budgetFactor, 3);

      const flight = FLIGHT_CLASSES[flightIdx];
      const hotel = HOTEL_CLASSES[hotelIdx];
      const guide = GUIDE_CLASSES[guideIdx];
      const cab = CAB_CLASSES[cabIdx];

      // Dynamic pricing
      const timeMult = getDynamicPriceMultiplier(prefs.date);
      const destMult = getDestinationMultiplier(prefs.destination);
      // destData used for logging/future use

      const flightCost = Math.round(flight.price * 2 * prefs.travellers * timeMult * destMult);
      const hotelCost = Math.round(hotel.pricePerNight * prefs.duration * Math.ceil(prefs.travellers / 2) * destMult);
      const guideCost = Math.round(guide.price * prefs.duration);
      const cabCost = Math.round(cab.pricePerDay * prefs.duration);

      const totalCost = flightCost + hotelCost + guideCost + cabCost;

      const plan: TripPlan = {
        id: `trip_${Date.now()}`,
        preferences: prefs,
        flight: flight.id,
        hotel: hotel.id,
        guide: guide.id,
        cab: cab.id,
        itinerary,
        totalCost,
        createdAt: new Date().toISOString(),
        status: 'planning',
      };

      setCurrentPlan(plan);
      setTimeout(() => setScreen('plan'), 400);
    }, totalTime);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(progressInterval);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'Inter, sans-serif' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute text-2xl"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.15,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}>
            {['✈️', '🌍', '🏨', '🗺️', '🌺', '⛅', '💺', '🏖️', '🎒', '🧳', '🌊', '🏔️'][i]}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm mx-auto px-6 text-center">
        <div>
          <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-3 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🌍</div>
          <h2 className="text-white text-2xl font-bold">Forging your trip...</h2>
          <p className="text-purple-200/60 text-sm mt-1">{currentPrefs?.from} → {currentPrefs?.destination}</p>
        </div>

        <div className="w-full space-y-2">
          {LOADING_STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
              i === currentStep ? 'bg-white/15 backdrop-blur-sm border border-white/20' : i < currentStep ? 'opacity-40' : 'opacity-20'
            }`}>
              <span className={`text-lg transition-all duration-300 ${i === currentStep ? 'animate-bounce' : ''}`}>{step.icon}</span>
              <span className="text-white/90 text-sm text-left">{step.label}</span>
              {i < currentStep && <span className="ml-auto text-green-400 text-xs font-bold">✓</span>}
              {i === currentStep && (
                <span className="ml-auto">
                  <span className="inline-block w-4 h-4 border-2 border-orange-400/60 border-t-orange-400 rounded-full animate-spin" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="w-full">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-100"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f97316, #ec4899)' }} />
          </div>
          <p className="text-purple-300/60 text-xs mt-2">{Math.round(progress)}% complete</p>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <p className="text-purple-300/70 text-xs uppercase font-semibold tracking-widest mb-1">Travel Fact</p>
          <p className="text-white/80 text-xs leading-relaxed">{TRAVEL_FACTS[factIndex]}</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
