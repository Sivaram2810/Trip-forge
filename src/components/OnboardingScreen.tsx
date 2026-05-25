import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS, TRIP_TYPES, INTERESTS } from '../data/constants';
import { OnboardingPreferences } from '../types';

const BUDGET_OPTIONS = [
  { label: 'Budget', range: '< ₹60K', value: 'budget', icon: '💰', desc: 'Value for money travel' },
  { label: 'Moderate', range: '₹60K–₹1.5L', value: 'moderate', icon: '💳', desc: 'Comfort with smart savings' },
  { label: 'Premium', range: '₹1.5L–₹3L', value: 'premium', icon: '💎', desc: 'Enhanced experience' },
  { label: 'Luxury', range: '₹3L+', value: 'luxury', icon: '👑', desc: 'No compromise on quality' },
];

export default function OnboardingScreen() {
  const { user, setUser, setScreen, wishlist, toggleWishlist } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [prefs, setPrefs] = useState<OnboardingPreferences>({
    tripTypes: [],
    interests: [],
    budgetRange: 'moderate',
    preferredDestinations: [],
  });

  const [personalDetails, setPersonalDetails] = useState({
    bio: '',
    city: '',
    dob: '',
  });

  const toggleTripType = (val: string) => {
    setPrefs(p => ({
      ...p,
      tripTypes: p.tripTypes.includes(val) ? p.tripTypes.filter(t => t !== val) : [...p.tripTypes, val],
    }));
  };

  const toggleInterest = (val: string) => {
    setPrefs(p => ({
      ...p,
      interests: p.interests.includes(val) ? p.interests.filter(i => i !== val) : [...p.interests, val],
    }));
  };

  const toggleDestPref = (id: string) => {
    setPrefs(p => ({
      ...p,
      preferredDestinations: p.preferredDestinations.includes(id)
        ? p.preferredDestinations.filter(d => d !== id)
        : [...p.preferredDestinations, id],
    }));
  };

  const handleFinish = () => {
    if (!user) return;

    // Update user with onboarding complete
    const updatedUser = {
      ...user,
      onboardingComplete: true,
      bio: personalDetails.bio || user.bio,
      travelPreferences: prefs,
    };

    // Update localStorage users array
    const stored = localStorage.getItem('tf_users');
    if (stored) {
      const users = JSON.parse(stored);
      const updated = users.map((u: any) =>
        u.id === user.id ? { ...u, ...updatedUser, password: u.password } : u
      );
      localStorage.setItem('tf_users', JSON.stringify(updated));
    }

    setUser(updatedUser);

    // Auto-populate wishlist with preferred destinations (if not already wishlisted)
    prefs.preferredDestinations.forEach(destId => {
      const dest = DESTINATIONS.find(d => d.id === destId);
      if (dest && !wishlist.find(w => w.destinationId === destId)) {
        toggleWishlist(destId, dest.name);
      }
    });

    setScreen('dashboard');
  };

  const canProceed = () => {
    if (step === 1) return true; // personal details optional
    if (step === 2) return prefs.tripTypes.length > 0;
    if (step === 3) return prefs.interests.length > 0;
    if (step === 4) return true;
    return true;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                  {step === 1 ? 'Personal Details' : step === 2 ? 'Travel Style' : step === 3 ? 'Your Interests' : 'Dream Destinations'}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Step {step} of {totalSteps}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (user) {
                  const updatedUser = { ...user, onboardingComplete: true, travelPreferences: prefs };
                  setUser(updatedUser);
                  const stored = localStorage.getItem('tf_users');
                  if (stored) {
                    const users = JSON.parse(stored);
                    const updated = users.map((u: any) => u.id === user.id ? { ...u, ...updatedUser, password: u.password } : u);
                    localStorage.setItem('tf_users', JSON.stringify(updated));
                  }
                  setScreen('dashboard');
                }
              }}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Skip for now
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%`, background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                  👋
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Let's set up your travel profile to personalize your experience.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Your City / Home Base</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Delhi, Bangalore..."
                    value={personalDetails.city}
                    onChange={e => setPersonalDetails(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Date of Birth <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="date"
                    value={personalDetails.dob}
                    onChange={e => setPersonalDetails(p => ({ ...p, dob: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Travel Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    placeholder="Tell us about yourself as a traveller..."
                    value={personalDetails.bio}
                    onChange={e => setPersonalDetails(p => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 resize-none"
                  />
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
                <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
                  🎯 Your profile helps us personalize your homepage, recommendations, and wishlist with destinations that match your travel style.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Trip Types */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">What's your travel style? ✈️</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select all that apply. This helps us personalize your experience.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {TRIP_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => toggleTripType(type.value)}
                    className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      prefs.tripTypes.includes(type.value)
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{type.label.split(' ')[0]}</span>
                    {prefs.tripTypes.includes(type.value) && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {prefs.tripTypes.length === 0 && (
                <p className="text-xs text-red-500 text-center">Please select at least one travel style to continue.</p>
              )}
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">What do you love doing? 🎯</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your interests for personalized itinerary recommendations.</p>
              </div>

              {/* Budget */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">💰 Budget Preference</p>
                <div className="grid grid-cols-2 gap-2">
                  {BUDGET_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setPrefs(p => ({ ...p, budgetRange: opt.value }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        prefs.budgetRange === opt.value
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{opt.icon}</span>
                        <span className="font-bold text-xs text-gray-900 dark:text-white">{opt.label}</span>
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">{opt.range}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🎨 Activities & Interests</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border-2 transition-all ${
                        prefs.interests.includes(interest)
                          ? 'border-orange-400 text-white'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900'
                      }`}
                      style={prefs.interests.includes(interest) ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {prefs.interests.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">Please select at least one interest.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Preferred Destinations */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Dream destinations 🌍</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pick places you'd love to visit. We'll add them to your wishlist!</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DESTINATIONS.map(dest => (
                  <button
                    key={dest.id}
                    onClick={() => toggleDestPref(dest.id)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                      prefs.preferredDestinations.includes(dest.id)
                        ? 'border-orange-400'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="relative h-28">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      {prefs.preferredDestinations.includes(dest.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <p className="text-white font-bold text-sm">{dest.emoji} {dest.name}</p>
                        <p className="text-white/70 text-xs">{dest.country}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {prefs.preferredDestinations.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    ✅ {prefs.preferredDestinations.length} destination{prefs.preferredDestinations.length > 1 ? 's' : ''} selected — will be added to your Wishlist automatically!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              if (step < totalSteps) {
                if (canProceed()) setStep(s => s + 1);
              } else {
                handleFinish();
              }
            }}
            disabled={!canProceed()}
            className="w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            {step < totalSteps ? (
              <>Continue <ArrowRight size={16} /></>
            ) : (
              <>🚀 Start Exploring!</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
