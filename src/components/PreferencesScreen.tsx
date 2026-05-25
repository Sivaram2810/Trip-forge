import { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, DollarSign, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRIP_TYPES, INTERESTS, DESTINATIONS } from '../data/constants';
import { TripPreferences } from '../types';

export default function PreferencesScreen() {
  const { currentPrefs, setCurrentPrefs, setScreen } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [prefs, setPrefs] = useState<TripPreferences>(currentPrefs || {
    from: 'Delhi',
    destination: '',
    destinationId: '',
    budget: 100000,
    duration: 7,
    tripType: 'leisure',
    date: '',
    travellers: 2,
    interests: [],
    priority: 'comfort',
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

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1);
    else {
      setCurrentPrefs(prefs);
      setScreen('loading');
    }
  };

  const budgetRanges = [
    { label: 'Budget', range: '< ₹50K', value: 50000, icon: '💰' },
    { label: 'Moderate', range: '₹50K–₹1L', value: 100000, icon: '💳' },
    { label: 'Premium', range: '₹1L–₹2L', value: 200000, icon: '💎' },
    { label: 'Luxury', range: '₹2L+', value: 400000, icon: '👑' },
  ];

  const durationOptions = [3, 5, 7, 10, 14, 21];

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Where are you going? 🌍</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pick your destination</p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  placeholder="Flying from (city)"
                  value={prefs.from}
                  onChange={e => update('from', e.target.value)}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Popular destinations</p>
              <div className="grid grid-cols-2 gap-2">
                {DESTINATIONS.slice(0, 8).map(dest => (
                  <button
                    key={dest.id}
                    onClick={() => { update('destination', dest.name); update('destinationId', dest.id); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all ${
                      prefs.destinationId === dest.id
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">{dest.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs">{dest.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{dest.country}</p>
                    </div>
                    {prefs.destinationId === dest.id && <span className="ml-auto text-orange-500">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Trip details 📋</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">When and how long?</p>
            </div>
            {/* Date */}
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
            </div>
            {/* Duration */}
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
                    {d} {d === 1 ? 'Night' : 'Nights'}
                  </button>
                ))}
              </div>
            </div>
            {/* Travellers */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Users size={14} /> Number of Travellers
              </label>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => update('travellers', Math.max(1, prefs.travellers - 1))}
                  className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >−</button>
                <span className="flex-1 text-center text-2xl font-bold text-gray-900 dark:text-white">{prefs.travellers}</span>
                <button
                  onClick={() => update('travellers', Math.min(20, prefs.travellers + 1))}
                  className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >+</button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Budget & Type 💰</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose your comfort level</p>
            </div>
            {/* Budget */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign size={14} /> Total Budget
              </label>
              <div className="grid grid-cols-2 gap-2">
                {budgetRanges.map(b => (
                  <button
                    key={b.label}
                    onClick={() => update('budget', b.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      prefs.budget === b.value
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{b.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{b.range}</p>
                    {prefs.budget === b.value && <div className="mt-1 text-orange-500 text-xs font-bold">✓ Selected</div>}
                  </button>
                ))}
              </div>
            </div>
            {/* Trip type */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Trip Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TRIP_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => update('tripType', t.value)}
                    className={`p-3 rounded-xl border text-sm font-semibold text-left transition-all flex items-center gap-2 ${
                      prefs.tripType === t.value
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label.split(' ')[0]}</span>
                    {prefs.tripType === t.value && <span className="ml-auto text-orange-500 text-xs">✓</span>}
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your Interests & Priority 🎯</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Help us tailor your trip</p>
            </div>
            {/* Interests */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                Select Interests ({prefs.interests.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      prefs.interests.includes(interest)
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                    style={prefs.interests.includes(interest) ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            {/* Priority */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Sliders size={14} /> Your Priority
              </label>
              <div className="space-y-2">
                {([
                  { value: 'budget', label: 'Best Value', desc: 'Maximize savings without sacrificing fun', icon: '💰' },
                  { value: 'comfort', label: 'Balanced Comfort', desc: 'Perfect mix of quality and value', icon: '⚖️' },
                  { value: 'experience', label: 'Premium Experience', desc: 'Luxury and exclusivity above all', icon: '👑' },
                ] as const).map(p => (
                  <button
                    key={p.value}
                    onClick={() => update('priority', p.value)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      prefs.priority === p.value
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <p className={`font-bold text-sm ${prefs.priority === p.value ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>{p.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.desc}</p>
                    </div>
                    {prefs.priority === p.value && <span className="ml-auto text-orange-500 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => step === 1 ? setScreen('dashboard') : setStep(s => s - 1)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Step {step} of {totalSteps}</p>
            <div className="flex gap-1 mt-1">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background: i < step
                      ? 'linear-gradient(90deg, #f97316, #ec4899)'
                      : '#e5e7eb',
                  }}
                />
              ))}
            </div>
          </div>
          <button onClick={() => setScreen('dashboard')} className="text-xs text-gray-400 hover:text-gray-600">Skip</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          {stepContent()}
        </div>
      </div>

      {/* Summary chip */}
      {prefs.destination && (
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
              <span>✈️ {prefs.from || 'Delhi'}</span>
              <span className="text-orange-500">→</span>
              <span className="font-semibold text-gray-900 dark:text-white">🌍 {prefs.destination}</span>
              {prefs.date && <span>📅 {prefs.date}</span>}
              <span>👥 {prefs.travellers}</span>
              {prefs.duration > 0 && <span>🌙 {prefs.duration}N</span>}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleNext}
            disabled={step === 1 && !prefs.destination}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-50 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            {step === totalSteps ? '🚀 Generate My Trip Plan' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
