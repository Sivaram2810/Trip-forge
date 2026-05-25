import { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, DollarSign, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRIP_TYPES, INTERESTS, DESTINATIONS, INDIAN_CITIES } from '../data/constants';
import { TripPreferences, PassengerDetail } from '../types';

export default function PreferencesScreen() {
  const { currentPrefs, setCurrentPrefs, setScreen } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [prefs, setPrefs] = useState<TripPreferences>(currentPrefs || {
    from: '',
    destination: '',
    destinationId: '',
    budget: 100000,
    duration: 7,
    tripType: 'leisure',
    date: '',
    travellers: 2,
    adults: 2,
    children: 0,
    interests: [],
    priority: 'comfort',
    passengers: [],
  });

  const update = <K extends keyof TripPreferences>(key: K, value: TripPreferences[K]) => {
    setPrefs(p => ({ ...p, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setPrefs(p => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter(i => i !== interest)
        : [...p.interests, interest],
    }));
  };

  const totalTravellers = prefs.adults + prefs.children;

  // Generate passenger fields for extra passengers (beyond the primary traveller)
  const extraPassengersCount = Math.max(0, totalTravellers - 1);
  const [passengers, setPassengers] = useState<PassengerDetail[]>(
    Array.from({ length: extraPassengersCount }, (_, i) => ({
      name: '',
      age: '',
      gender: 'male',
      type: i < prefs.adults - 1 ? 'adult' : 'child',
    }))
  );

  const updatePassenger = (idx: number, field: keyof PassengerDetail, value: string) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const syncPassengersCount = (adults: number, children: number) => {
    const total = adults + children;
    const extra = Math.max(0, total - 1);
    setPassengers(prev => {
      if (prev.length === extra) return prev;
      if (extra > prev.length) {
        const newOnes: PassengerDetail[] = Array.from({ length: extra - prev.length }, (_, i) => ({
          name: '', age: '', gender: 'male',
          type: (prev.length + i) < adults - 1 ? 'adult' : 'child',
        }));
        return [...prev, ...newOnes];
      }
      return prev.slice(0, extra);
    });
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1);
    else {
      const finalPrefs: TripPreferences = {
        ...prefs,
        travellers: totalTravellers,
        passengers: passengers.length > 0 ? passengers : undefined,
      };
      setCurrentPrefs(finalPrefs);
      setScreen('loading');
    }
  };

  const canProceed = () => {
    if (step === 1) return !!prefs.from && !!prefs.destination;
    if (step === 2) return !!prefs.date && prefs.duration > 0 && prefs.adults > 0;
    if (step === 3) return !!prefs.budget;
    if (step === 4) return prefs.interests.length > 0;
    if (step === 5) {
      // Validate passenger names
      return passengers.every(p => p.name.trim().length > 0);
    }
    return true;
  };

  const budgetRanges = [
    { label: 'Budget', range: '< ₹60K', value: 55000, icon: '💰' },
    { label: 'Moderate', range: '₹60K–₹1.5L', value: 100000, icon: '💳' },
    { label: 'Premium', range: '₹1.5L–₹3L', value: 200000, icon: '💎' },
    { label: 'Luxury', range: '₹3L+', value: 400000, icon: '👑' },
  ];

  const durationOptions = [3, 5, 7, 10, 14, 21];

  // Step 5 is passenger details — only show if more than 1 traveller

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Where are you going? 🌍</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select your departure city and destination</p>
            </div>

            {/* From - Dropdown */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin size={14} className="text-orange-500" /> Departure City
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 appearance-none"
                  value={prefs.from}
                  onChange={e => update('from', e.target.value)}
                >
                  <option value="">Select departure city</option>
                  {INDIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* To - Dropdown */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin size={14} className="text-pink-500" /> Destination
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 appearance-none"
                  value={prefs.destinationId}
                  onChange={e => {
                    const dest = DESTINATIONS.find(d => d.id === e.target.value);
                    if (dest) {
                      update('destination', dest.name);
                      update('destinationId', dest.id);
                    }
                  }}
                >
                  <option value="">Select destination</option>
                  {DESTINATIONS.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.emoji} {dest.name}, {dest.country}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {prefs.destinationId && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 border border-orange-100 dark:border-orange-800">
                {(() => {
                  const d = DESTINATIONS.find(dest => dest.id === prefs.destinationId);
                  return d ? (
                    <div className="flex items-center gap-3">
                      <img src={d.image} alt={d.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{d.emoji} {d.name}, {d.country}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{d.description}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">Best time: {d.bestTime} • {d.temp}</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {prefs.from && prefs.destination && prefs.from === prefs.destination.split(',')[0] && (
              <p className="text-xs text-red-500">⚠️ Departure and destination cannot be the same city.</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Trip details 📋</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">When, how long, and who's coming?</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={14} /> Departure Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                value={prefs.date}
                onChange={e => update('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {prefs.date && (
                <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                  {(() => {
                    const days = Math.ceil((new Date(prefs.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    if (days <= 3) return '⚠️ Last minute booking — premium pricing applies';
                    if (days <= 7) return '⚡ Booking within a week — elevated pricing';
                    if (days <= 30) return '💳 1 month ahead — standard pricing';
                    return '✅ Advance booking — best rates available!';
                  })()}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Trip Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map(d => (
                  <button
                    key={d}
                    onClick={() => update('duration', d)}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                      prefs.duration === d
                        ? 'border-orange-400 text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                    }`}
                    style={prefs.duration === d ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                  >
                    {d} Nights
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Users size={14} /> Passengers
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Adults</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Age 12+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { const a = Math.max(1, prefs.adults - 1); update('adults', a); syncPassengersCount(a, prefs.children); }}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold">−</button>
                    <span className="w-6 text-center font-bold text-gray-900 dark:text-white">{prefs.adults}</span>
                    <button onClick={() => { const a = Math.min(15, prefs.adults + 1); update('adults', a); syncPassengersCount(a, prefs.children); }}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Children</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Age 2–11</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { const c = Math.max(0, prefs.children - 1); update('children', c); syncPassengersCount(prefs.adults, c); }}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold">−</button>
                    <span className="w-6 text-center font-bold text-gray-900 dark:text-white">{prefs.children}</span>
                    <button onClick={() => { const c = Math.min(10, prefs.children + 1); update('children', c); syncPassengersCount(prefs.adults, c); }}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold">+</button>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Total: {totalTravellers} {totalTravellers === 1 ? 'traveller' : 'travellers'}
                  {totalTravellers > 1 && ' — passenger details required in next step'}
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Budget & Type 💰</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose your comfort level and trip style</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign size={14} /> Total Budget
              </label>
              <div className="grid grid-cols-2 gap-2">
                {budgetRanges.map(br => (
                  <button
                    key={br.value}
                    onClick={() => update('budget', br.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      prefs.budget === br.value
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{br.icon}</span>
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{br.label}</span>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">{br.range}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Trip Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TRIP_TYPES.map(tt => (
                  <button
                    key={tt.value}
                    onClick={() => update('tripType', tt.value)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      prefs.tripType === tt.value
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <span>{tt.icon}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{tt.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Sliders size={14} /> Travel Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['budget', 'comfort', 'experience'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => update('priority', p)}
                    className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                      prefs.priority === p
                        ? 'border-orange-400 text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                    }`}
                    style={prefs.priority === p ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                  >
                    <p className="text-xs font-bold capitalize">{p}</p>
                    <p className="text-xs opacity-70">{p === 'budget' ? 'Save ₹' : p === 'comfort' ? 'Balance' : 'Premium'}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your Interests 🎯</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select what you'd love to do on this trip</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
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
              <p className="text-xs text-red-500">Select at least one interest to continue.</p>
            )}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                🤖 Our AI uses your interests to build a personalized day-by-day itinerary with activities you'll love!
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Passenger Details 👥</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter details for all {totalTravellers} travellers (required for ticketing)</p>
            </div>

            {/* Primary traveller */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-1">👤 Primary Traveller (You)</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Your booking account name</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lead passenger — details from your profile</p>
            </div>

            {/* Additional passengers */}
            {passengers.map((pax, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Passenger {idx + 2} — {idx < prefs.adults - 1 ? 'Adult' : 'Child'}
                </p>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    placeholder="As per passport/ID"
                    value={pax.name}
                    onChange={e => updatePassenger(idx, 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Age</label>
                    <input
                      type="number"
                      placeholder={idx < prefs.adults - 1 ? '18-99' : '2-11'}
                      value={pax.age}
                      onChange={e => updatePassenger(idx, 'age', e.target.value)}
                      min={idx < prefs.adults - 1 ? 12 : 2}
                      max={idx < prefs.adults - 1 ? 99 : 11}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Gender</label>
                    <select
                      value={pax.gender}
                      onChange={e => updatePassenger(idx, 'gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const showStep5 = totalTravellers > 1;
  const actualTotalSteps = showStep5 ? 5 : 4;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => {
                if (step === 1) setScreen('dashboard');
                else setStep(s => s - 1);
              }}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {step === 1 ? '📍 Destination' : step === 2 ? '📅 Trip Details' : step === 3 ? '💰 Budget & Type' : step === 4 ? '🎯 Interests' : '👥 Passengers'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{step}/{actualTotalSteps}</p>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(step / actualTotalSteps) * 100}%`, background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {stepContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            {step === actualTotalSteps ? (
              <>🚀 Forge My Trip!</>
            ) : (
              <>Continue <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
