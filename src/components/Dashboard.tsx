import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Heart, MapPin, Star, Compass, Clock, Zap, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS, PACKAGES, LIMITED_OFFERS, CURRENCY_RATES, TRIP_TYPES } from '../data/constants';
import { TripPreferences } from '../types';

function fmt(n: number, currency = 'INR'): string {
  const rate = CURRENCY_RATES[currency]?.rate ?? 1;
  const symbol = CURRENCY_RATES[currency]?.symbol ?? '₹';
  const converted = n * rate;
  if (currency === 'INR') {
    if (converted >= 100000) return `${symbol}${(converted / 100000).toFixed(1)}L`;
    if (converted >= 1000) return `${symbol}${(converted / 1000).toFixed(0)}K`;
    return `${symbol}${converted.toFixed(0)}`;
  }
  if (converted >= 1000) return `${symbol}${(converted / 1000).toFixed(1)}K`;
  return `${symbol}${converted.toFixed(0)}`;
}

// Real-time countdown timer
function useCountdown(secondsRemaining: number) {
  const [timeLeft, setTimeLeft] = useState(secondsRemaining);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function OfferCard({ offer }: { offer: typeof LIMITED_OFFERS[0] }) {
  const countdown = useCountdown(offer.expiresIn);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden min-w-[220px]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{offer.title}</span>
          <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
            -{offer.discount}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">📍 {offer.dest}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs line-through text-gray-400">₹{(offer.originalPrice / 1000).toFixed(0)}K</span>
          <span className="font-black text-base text-gray-900 dark:text-white">₹{(offer.salePrice / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
          <Clock size={12} className="text-red-500" />
          <span className="text-red-600 dark:text-red-400 text-xs font-mono font-bold">{countdown}</span>
          <span className="text-red-500 text-xs">left</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, setScreen, setCurrentPrefs, setSelectedTrip, trips, wishlist, toggleWishlist, isWishlisted, currency } = useApp();
  const [activeTab, setActiveTab] = useState<'discover' | 'trips'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  const userPrefs = user?.travelPreferences;

  // Personalized destinations based on user preferences
  const getPersonalizedDestinations = () => {
    if (!userPrefs || (!userPrefs.tripTypes.length && !userPrefs.interests.length)) {
      return DESTINATIONS.slice(0, 8);
    }
    // Filter by trip types and interests
    let scored = DESTINATIONS.map(dest => {
      let score = 0;
      if (userPrefs.tripTypes.some(t => dest.tripTypes?.includes(t))) score += 3;
      if (userPrefs.interests.some(i => dest.interests?.includes(i))) score += 2;
      if (userPrefs.preferredDestinations?.includes(dest.id)) score += 5;
      return { dest, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.dest);
  };

  const personalizedDests = getPersonalizedDestinations();

  // Filter by search
  const filteredDestinations = searchQuery.trim()
    ? DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : personalizedDests;

  // Package filter
  const packageTypes = ['all', ...TRIP_TYPES.slice(0, 6).map(t => t.value)];
  const filteredPackages = packageFilter === 'all'
    ? PACKAGES
    : PACKAGES.filter(p => p.type === packageFilter);

  const handleDestinationClick = (dest: typeof DESTINATIONS[0]) => {
    const defaultPrefs: TripPreferences = {
      from: 'Mumbai',
      destination: dest.name,
      destinationId: dest.id,
      budget: userPrefs?.budgetRange === 'budget' ? 60000 :
              userPrefs?.budgetRange === 'premium' ? 200000 :
              userPrefs?.budgetRange === 'luxury' ? 400000 : 100000,
      duration: 7,
      tripType: userPrefs?.tripTypes[0] || 'leisure',
      date: '',
      travellers: 2,
      adults: 2,
      children: 0,
      interests: userPrefs?.interests || [],
      priority: userPrefs?.budgetRange === 'budget' ? 'budget' :
                userPrefs?.budgetRange === 'luxury' ? 'experience' : 'comfort',
    };
    setCurrentPrefs(defaultPrefs);
    setScreen('preferences');
  };

  const handlePackageClick = (pkg: typeof PACKAGES[0]) => {
    const dest = DESTINATIONS.find(d => d.name === pkg.destinations[0]) || DESTINATIONS[0];
    const defaultPrefs: TripPreferences = {
      from: 'Mumbai',
      destination: pkg.destinations[0],
      destinationId: dest.id,
      budget: pkg.price,
      duration: parseInt(pkg.duration),
      tripType: pkg.type,
      date: '',
      travellers: 2,
      adults: 2,
      children: 0,
      interests: [],
      priority: 'comfort',
    };
    setCurrentPrefs(defaultPrefs);
    setScreen('preferences');
  };

  const bookedTrips = trips.filter(t => t.status === 'booked' || t.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto">
          {showSearch ? (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, experiences..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-sm text-gray-500 font-medium">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} ✨</p>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg">{user?.name?.split(' ')[0] || 'Traveller'} 👋</h1>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSearch(true)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Search size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                  <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
                </button>
                <button onClick={() => setScreen('profile')} className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                  {user?.name?.[0] || 'U'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
        {/* Hero Search Banner */}
        {!searchQuery && (
          <div className="relative rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
            <div className="absolute inset-0">
              {['🌍', '✈️', '🏝️', '⛵', '🗺️'].map((em, i) => (
                <span key={i} className="absolute text-2xl opacity-10"
                  style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 2) * 40}%` }}>{em}</span>
              ))}
            </div>
            <div className="relative p-5">
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Where to next?</p>
              <h2 className="text-white text-xl font-black mb-3">
                Forge your<br />
                <span style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  perfect journey
                </span>
              </h2>
              <button
                onClick={() => setScreen('preferences')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
              >
                <Compass size={14} /> Plan New Trip
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {filteredDestinations.length} result{filteredDestinations.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
            {filteredDestinations.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-gray-500 dark:text-gray-400">No destinations found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredDestinations.map(dest => (
                  <DestCard key={dest.id} dest={dest} onBook={() => handleDestinationClick(dest)} isWishlisted={isWishlisted(dest.id)} onWishlist={() => toggleWishlist(dest.id, dest.name)} currency={currency} />
                ))}
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            {/* Quick Tools */}
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Quick Tools</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: '🤖', label: 'AI Plan', action: () => setScreen('preferences') },
                  { icon: '👤', label: 'Profile', action: () => setScreen('profile') },
                  { icon: '❤️', label: 'Wishlist', action: () => setScreen('wishlist') },
                  { icon: '📞', label: 'Support', action: () => setScreen('support') },
                  { icon: '⚙️', label: 'Settings', action: () => setScreen('settings') },
                  { icon: '🎁', label: 'Rewards', action: () => setScreen('rewards') },
                  { icon: '🗺️', label: 'My Trips', action: () => setActiveTab('trips') },
                  { icon: '💱', label: 'Currency', action: () => { setScreen('plan'); } },
                ].map(({ icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all active:scale-95"
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            {trips.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Trips Booked', value: bookedTrips.length, icon: '✈️' },
                  { label: 'In Planning', value: trips.filter(t => t.status === 'planning').length, icon: '📋' },
                  { label: 'Wishlist', value: wishlist.length, icon: '❤️' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-2xl mb-1">{stat.icon}</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Limited Offers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-orange-500" />
                  <span className="font-bold text-gray-900 dark:text-white">Limited Offers</span>
                </div>
                <span className="text-xs text-red-500 font-semibold animate-pulse">⏰ Ends soon!</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {LIMITED_OFFERS.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
              {(['discover', 'trips'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                    activeTab === t
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {t === 'discover' ? '🌍 Discover' : `✈️ My Trips (${trips.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'discover' ? (
              <>
                {/* Personalized label */}
                {userPrefs && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                    <span className="text-sm">🎯</span>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Showing destinations personalized for your travel style
                    </p>
                  </div>
                )}

                {/* Trending Destinations */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-orange-500" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {userPrefs ? 'Recommended For You' : 'Trending Destinations'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredDestinations.slice(0, 8).map(dest => (
                      <DestCard key={dest.id} dest={dest} onBook={() => handleDestinationClick(dest)} isWishlisted={isWishlisted(dest.id)} onWishlist={() => toggleWishlist(dest.id, dest.name)} currency={currency} />
                    ))}
                  </div>
                </div>

                {/* Curated Packages */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-orange-500" />
                      <span className="font-bold text-gray-900 dark:text-white">Curated Packages</span>
                    </div>
                  </div>
                  {/* Package type filter */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
                    {packageTypes.map(t => (
                      <button
                        key={t}
                        onClick={() => setPackageFilter(t)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          packageFilter === t ? 'text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                        style={packageFilter === t ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                      >
                        {t === 'all' ? '✨ All' : TRIP_TYPES.find(tt => tt.value === t)?.label || t}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {filteredPackages.map(pkg => (
                      <PackageCard key={pkg.id} pkg={pkg} onBook={() => handlePackageClick(pkg)} currency={currency} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* My Trips Tab */
              <div>
                {trips.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No trips yet!</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start planning your first adventure.</p>
                    <button
                      onClick={() => setScreen('preferences')}
                      className="px-6 py-3 rounded-xl text-white font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                    >
                      Plan Your First Trip →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trips.map(trip => (
                      <button
                        key={trip.id}
                        onClick={() => {
                          // Go to trip detail view, NOT plan screen
                          setSelectedTrip(trip);
                          setScreen('trip-detail');
                        }}
                        className="w-full bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                trip.status === 'booked' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                trip.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              }`}>
                                {trip.status === 'booked' ? '✅ Booked' : trip.status === 'completed' ? '🏁 Completed' : '📋 Planning'}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{trip.preferences.destination}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{trip.preferences.from} → {trip.preferences.destination}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-gray-900 dark:text-white">{fmt(trip.totalCost, currency)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{trip.preferences.duration} nights</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>✈️ {trip.preferences.tripType}</span>
                          <span>👥 {trip.preferences.travellers} pax</span>
                          {trip.preferences.date && <span>📅 {trip.preferences.date}</span>}
                          {trip.bookingRef && <span>🎫 #{trip.bookingRef}</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-orange-500">
                          <span className="text-xs font-medium">View Details</span>
                          <ChevronRight size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex">
          {[
            { icon: <Compass size={20} />, label: 'Explore', action: () => { setActiveTab('discover'); window.scrollTo(0, 0); } },
            { icon: <span className="text-xl">✈️</span>, label: 'Trips', action: () => setActiveTab('trips') },
            { icon: <Heart size={20} />, label: 'Saved', action: () => setScreen('wishlist') },
            { icon: <span className="text-xl">💬</span>, label: 'Support', action: () => setScreen('support') },
            { icon: <span className="text-xl">{user?.name?.[0] || '👤'}</span>, label: 'Profile', action: () => setScreen('profile') },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-400 dark:text-gray-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              <span>{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}

function DestCard({ dest, onBook, isWishlisted, onWishlist, currency }: {
  dest: typeof DESTINATIONS[0];
  onBook: () => void;
  isWishlisted: boolean;
  onWishlist: () => void;
  currency: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
      <div className="relative h-32">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${dest.tagColor}`}>
            {dest.tag}
          </span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onWishlist(); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isWishlisted ? 'bg-red-500' : 'bg-white/80'
          }`}
        >
          <Heart size={12} className={isWishlisted ? 'text-white fill-white' : 'text-gray-600'} />
        </button>
        <div className="absolute bottom-2 left-2">
          <p className="text-white font-bold text-sm">{dest.name}</p>
          <p className="text-white/80 text-xs">{dest.country}</p>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{dest.rating}</span>
          </div>
          <p className="text-xs font-black text-gray-900 dark:text-white">from {fmt(dest.basePrice, currency)}</p>
        </div>
        <button
          onClick={onBook}
          className="w-full py-2 rounded-lg text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function PackageCard({ pkg, onBook, currency }: {
  pkg: typeof PACKAGES[0];
  onBook: () => void;
  currency: string;
}) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const totalPax = adults + children;
  const adjustedPrice = Math.round(pkg.price * (adults + children * 0.6));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className={`p-4 bg-gradient-to-r ${pkg.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              {pkg.icon}
            </div>
            <div>
              <span className="text-white/80 text-xs font-semibold">{pkg.badge}</span>
              <h3 className="text-white font-bold text-base">{pkg.title}</h3>
              <p className="text-white/70 text-xs">{pkg.baseDestinations.slice(0, 2).join(' • ')} • {pkg.duration}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* Features - read only */}
        <div className="flex flex-wrap gap-1.5">
          {pkg.features.slice(0, 3).map(f => (
            <span key={f} className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">{f}</span>
          ))}
        </div>

        {/* Itinerary preview - read only */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">📋 Sample Itinerary (Read-only)</p>
          <div className="space-y-1">
            {pkg.itinerary.slice(0, 3).map((day, i) => (
              <p key={i} className="text-xs text-gray-600 dark:text-gray-400">Day {i + 1}: {day}</p>
            ))}
            {pkg.itinerary.length > 3 && (
              <p className="text-xs text-orange-500 font-medium">+{pkg.itinerary.length - 3} more days...</p>
            )}
          </div>
        </div>

        {/* Editable: Adults & Children */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">👥 Passengers</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Adults</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setAdults(a => Math.max(1, a - 1))}
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">−</button>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-4 text-center">{adults}</span>
                <button onClick={() => setAdults(a => Math.min(20, a + 1))}
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">+</button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Children</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setChildren(c => Math.max(0, c - 1))}
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">−</button>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-4 text-center">{children}</span>
                <button onClick={() => setChildren(c => Math.min(10, c + 1))}
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">+</button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Total: {totalPax} {totalPax === 1 ? 'person' : 'people'}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{pkg.rating} ({pkg.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs line-through text-gray-400">{fmt(pkg.originalPrice, currency)}</span>
              <span className="font-black text-gray-900 dark:text-white">{fmt(adjustedPrice, currency)}</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">for {totalPax} {totalPax === 1 ? 'person' : 'people'}</p>
          </div>
          <button
            onClick={onBook}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            Book Package
          </button>
        </div>
      </div>
    </div>
  );
}
