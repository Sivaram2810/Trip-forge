import { useState, useEffect } from 'react';
import { Search, Bell, MapPin, Star, Heart, ChevronRight, Clock, Zap, TrendingUp, Compass, MessageCircle, User, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS, PACKAGES, LIMITED_OFFERS, CURRENCY_RATES } from '../data/constants';
import { TripPreferences } from '../types';

export default function Dashboard() {
  const { user, setScreen, setCurrentPrefs, setCurrentPlan, trips, wishlist, toggleWishlist, isWishlisted, currency } = useApp();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activePackageType, setActivePackageType] = useState('All');
  const [timers, setTimers] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'discover' | 'trips'>('discover');

  const packageTypes = ['All', 'Honeymoon', 'Adventure', 'Family', 'Cultural', 'Solo', 'Luxury'];

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const updated: Record<string, string> = {};
      LIMITED_OFFERS.forEach(o => {
        const target = now + o.expiresIn * 1000;
        const diff = Math.max(0, Math.floor((target - now) / 1000));
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        updated[o.id] = `${h}:${m}:${s}`;
      });
      setTimers(updated);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredSuggestions = to.length > 1
    ? DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(to.toLowerCase()) ||
        d.country.toLowerCase().includes(to.toLowerCase()) ||
        d.category.toLowerCase().includes(to.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSearch = () => {
    if (!to) return;
    const dest = DESTINATIONS.find(d => d.name.toLowerCase().includes(to.toLowerCase()) || d.country.toLowerCase().includes(to.toLowerCase()));
    const prefs: TripPreferences = {
      from: from || 'Delhi',
      destination: dest?.name || to,
      destinationId: dest?.id || 'd1',
      budget: 100000,
      duration: 7,
      tripType: 'leisure',
      date: '',
      travellers: 2,
      interests: [],
      priority: 'comfort',
    };
    setCurrentPrefs(prefs);
    setScreen('preferences');
  };

  const handleDestinationClick = (dest: typeof DESTINATIONS[0]) => {
    const prefs: TripPreferences = {
      from: from || 'Delhi',
      destination: dest.name,
      destinationId: dest.id,
      budget: dest.basePrice * 2,
      duration: 7,
      tripType: 'leisure',
      date: '',
      travellers: 2,
      interests: [],
      priority: 'comfort',
    };
    setCurrentPrefs(prefs);
    setScreen('preferences');
  };

  const handlePackageClick = (pkg: typeof PACKAGES[0]) => {
    const dest = pkg.destinations[0];
    const prefs: TripPreferences = {
      from: from || 'Delhi',
      destination: dest,
      destinationId: DESTINATIONS.find(d => d.name === dest)?.id || 'd1',
      budget: pkg.price,
      duration: parseInt(pkg.duration),
      tripType: pkg.type.toLowerCase(),
      date: '',
      travellers: pkg.type === 'Family' ? 4 : pkg.type === 'Solo' ? 1 : 2,
      interests: [],
      priority: 'comfort',
    };
    setCurrentPrefs(prefs);
    setScreen('preferences');
  };

  const filteredPackages = activePackageType === 'All'
    ? PACKAGES
    : PACKAGES.filter(p => p.type === activePackageType);

  const fmt = (n: number) => {
    const rate = CURRENCY_RATES[currency]?.rate || 1;
    const sym = CURRENCY_RATES[currency]?.symbol || '₹';
    const converted = n * rate;
    return `${sym}${converted >= 100000 ? (converted / 100000).toFixed(1) + 'L' : converted >= 1000 ? (converted / 1000).toFixed(0) + 'K' : converted.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🌍</div>
            <span className="text-gray-900 dark:text-white font-black text-xl hidden sm:block" style={{ fontFamily: 'Playfair Display, serif' }}>TripForge</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setScreen('wishlist')} className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Heart size={16} className="text-gray-600 dark:text-gray-400" />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{wishlist.length}</span>}
            </button>
            <button className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Bell size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button onClick={() => setScreen('profile')} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-orange-400/50 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0] || 'U'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', minHeight: 220 }}>
          <img src="https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=1200" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="relative z-10 p-6 md:p-8">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-orange-400 text-sm font-semibold">✈️ Welcome back,</span>
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-1">{user?.name?.split(' ')[0] || 'Explorer'}</h2>
            <p className="text-purple-200/70 text-sm mb-5">Where to next? Let's forge your perfect journey.</p>
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300/70" />
                <input
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 text-sm backdrop-blur focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                  placeholder="From (city)"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300/70" />
                <input
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 text-sm backdrop-blur focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                  placeholder="To (destination, country)"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                {filteredSuggestions.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
                    {filteredSuggestions.map(dest => (
                      <button
                        key={dest.id}
                        onClick={() => { setTo(dest.name); handleDestinationClick(dest); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                      >
                        <span className="text-xl">{dest.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{dest.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{dest.country} • from ₹{(dest.basePrice/1000).toFixed(0)}K</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
              >
                <Search size={15} /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Quick tools */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-3">Quick Tools</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[
              { icon: '🤖', label: 'AI Chat', screen: 'plan' as const },
              { icon: '⛅', label: 'Weather', screen: 'plan' as const },
              { icon: '💱', label: 'Currency', screen: 'plan' as const },
              { icon: '👤', label: 'Profile', screen: 'profile' as const },
              { icon: '❤️', label: 'Wishlist', screen: 'wishlist' as const },
              { icon: '📞', label: 'Support', screen: 'support' as const },
              { icon: '⚙️', label: 'Settings', screen: 'settings' as const },
              { icon: '🎁', label: 'Rewards', screen: 'profile' as const },
            ].map(({ icon, label, screen }) => (
              <button
                key={label}
                onClick={() => setScreen(screen)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Limited offers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-orange-500" />
              <h3 className="text-gray-900 dark:text-white font-bold text-lg">Limited Offers</h3>
            </div>
            <span className="text-xs text-gray-400">Ends soon!</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LIMITED_OFFERS.map(offer => (
              <button
                key={offer.id}
                onClick={() => {
                  const dest = DESTINATIONS.find(d => d.name === offer.dest) || DESTINATIONS[0];
                  handleDestinationClick(dest);
                }}
                className="relative overflow-hidden rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all group"
              >
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-xl">
                  -{offer.discount}
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{offer.title}</p>
                <p className="text-orange-500 font-semibold text-sm">{offer.dest}</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-xl font-black text-gray-900 dark:text-white">{fmt(offer.salePrice)}</span>
                  <span className="text-gray-400 line-through text-sm">{fmt(offer.originalPrice)}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={11} />
                  <span className="font-mono text-red-500 font-semibold">{timers[offer.id] || '00:00:00'}</span>
                  <span>remaining</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {(['discover', 'trips'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {t === 'discover' ? '🌍 Discover' : `🗺️ My Trips ${trips.length > 0 ? `(${trips.length})` : ''}`}
            </button>
          ))}
        </div>

        {activeTab === 'discover' ? (
          <>
            {/* Trending destinations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-pink-500" />
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg">Trending Destinations</h3>
                </div>
                <button className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  See all <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {DESTINATIONS.slice(0, 8).map(dest => (
                  <div
                    key={dest.id}
                    className="group relative overflow-hidden rounded-2xl cursor-pointer"
                    style={{ aspectRatio: '3/4' }}
                    onClick={() => handleDestinationClick(dest)}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Tag */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${dest.tagColor}`}>
                        {dest.tag}
                      </span>
                    </div>
                    {/* Wishlist */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleWishlist(dest.id, dest.name); }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                        isWishlisted(dest.id) ? 'bg-red-500' : 'bg-black/30'
                      }`}
                    >
                      <Heart size={12} className="text-white" fill={isWishlisted(dest.id) ? 'white' : 'none'} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm">{dest.name}</p>
                      <p className="text-white/70 text-xs">{dest.country}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-300 text-xs font-semibold">{dest.rating}</span>
                        </div>
                        <span className="text-white font-bold text-xs">from {fmt(dest.basePrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated packages */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-violet-500" />
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg">Curated Packages</h3>
                </div>
              </div>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                {packageTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setActivePackageType(t)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activePackageType === t
                        ? 'text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                    style={activePackageType === t ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handlePackageClick(pkg)}
                  >
                    <div className={`h-3 bg-gradient-to-r ${pkg.color}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{pkg.icon}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                              {pkg.badge}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{pkg.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {pkg.destinations.slice(0, 2).join(' • ')} • {pkg.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pkg.features.slice(0, 3).map(f => (
                          <span key={f} className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Star size={11} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{pkg.rating} ({pkg.reviews.toLocaleString()})</span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-lg font-black text-gray-900 dark:text-white">{fmt(pkg.price)}</span>
                            <span className="text-xs text-gray-400 line-through">{fmt(pkg.originalPrice)}</span>
                          </div>
                        </div>
                        <button
                          className="px-4 py-2 rounded-xl text-white text-xs font-semibold group-hover:opacity-90 transition-all"
                          style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* My Trips */
          <div>
            {trips.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No trips yet!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Start planning your first adventure.</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trips.map(trip => (
                  <div
                    key={trip.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => { setCurrentPrefs(trip.preferences); setCurrentPlan(trip); setScreen('plan'); }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${
                            trip.status === 'booked' ? 'bg-green-500' : trip.status === 'completed' ? 'bg-gray-500' : 'bg-orange-500'
                          }`}>
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{trip.preferences.destination}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{trip.preferences.from} → {trip.preferences.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900 dark:text-white">{fmt(trip.totalCost)}</p>
                        <p className="text-xs text-gray-400">{trip.preferences.duration} nights</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>✈️ {trip.preferences.tripType}</span>
                      <span>👥 {trip.preferences.travellers} travellers</span>
                      <span>📅 {trip.preferences.date || 'Flexible'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-5 gap-1">
          {[
            { icon: <Compass size={20} />, label: 'Explore', action: () => setActiveTab('discover') },
            { icon: <BookOpen size={20} />, label: 'Trips', action: () => setActiveTab('trips') },
            { icon: <Heart size={20} />, label: 'Saved', action: () => setScreen('wishlist') },
            { icon: <MessageCircle size={20} />, label: 'Support', action: () => setScreen('support') },
            { icon: <User size={20} />, label: 'Profile', action: () => setScreen('profile') },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-0.5 py-1 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              {icon}
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

