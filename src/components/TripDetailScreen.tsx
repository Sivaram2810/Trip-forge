import { ArrowLeft, MapPin, Calendar, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FLIGHT_CLASSES, HOTEL_CLASSES, GUIDE_CLASSES, CAB_CLASSES, CURRENCY_RATES } from '../data/constants';

function fmt(n: number, currency = 'INR'): string {
  const rate = CURRENCY_RATES[currency]?.rate ?? 1;
  const sym = CURRENCY_RATES[currency]?.symbol ?? '₹';
  const v = n * rate;
  if (currency === 'INR') {
    if (v >= 100000) return `${sym}${(v / 100000).toFixed(2)}L`;
    if (v >= 1000) return `${sym}${(v / 1000).toFixed(1)}K`;
    return `${sym}${v.toFixed(0)}`;
  }
  return `${sym}${v.toFixed(0)}`;
}

export default function TripDetailScreen() {
  const { selectedTrip, setScreen, currency } = useApp();

  if (!selectedTrip) {
    setScreen('dashboard');
    return null;
  }

  const trip = selectedTrip;
  const prefs = trip.preferences;

  const flight = FLIGHT_CLASSES.find(f => f.id === trip.flight);
  const hotel = HOTEL_CLASSES.find(h => h.id === trip.hotel);
  const guide = GUIDE_CLASSES.find(g => g.id === trip.guide);
  const cab = CAB_CLASSES.find(c => c.id === trip.cab);

  const statusConfig = {
    booked: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: '✅ Booked & Confirmed' },
    planning: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: '📋 In Planning' },
    completed: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: '🏁 Trip Completed' },
  };

  const status = statusConfig[trip.status];
  const bookingRef = trip.bookingRef || `BK${trip.id.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Trip Details</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{prefs.from} → {prefs.destination}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Hero Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="p-5" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${status.color}`}>
              {status.label}
            </div>
            <h2 className="text-white text-2xl font-black mb-1">{prefs.destination}</h2>
            <p className="text-white/70 text-sm">{prefs.from} → {prefs.destination}</p>
          </div>

          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { icon: <Calendar size={14} className="text-orange-500" />, label: 'Departure', value: prefs.date || 'Flexible' },
              { icon: <Clock size={14} className="text-blue-500" />, label: 'Duration', value: `${prefs.duration} nights` },
              { icon: <Users size={14} className="text-purple-500" />, label: 'Travellers', value: `${prefs.travellers || (prefs.adults + prefs.children)} persons` },
              { icon: <MapPin size={14} className="text-pink-500" />, label: 'Trip Type', value: prefs.tripType || 'Leisure' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                {item.icon}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {trip.status === 'booked' && (
            <div className="mx-4 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Booking Reference</span>
                <span className="text-xs font-black font-mono text-green-700 dark:text-green-400">{bookingRef}</span>
              </div>
            </div>
          )}
        </div>

        {/* Cost Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-white mb-3">💰 Cost Summary</p>
          <div className="space-y-2">
            {flight && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">✈️ {flight.name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{fmt(flight.price * 2 * prefs.travellers, currency)}</span>
              </div>
            )}
            {hotel && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">🏨 {hotel.name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{fmt(hotel.pricePerNight * prefs.duration * Math.ceil(prefs.travellers / 2), currency)}</span>
              </div>
            )}
            {guide && guide.price > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">🗺️ {guide.name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{fmt(guide.price * prefs.duration, currency)}</span>
              </div>
            )}
            {cab && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">🚗 {cab.name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{fmt(cab.pricePerDay * prefs.duration, currency)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 mt-3 pt-3 flex justify-between">
            <span className="font-bold text-gray-900 dark:text-white">Total</span>
            <span className="font-black text-xl" style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {fmt(trip.totalCost, currency)}
            </span>
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-white mb-3">🛎️ Selected Services</p>
          <div className="space-y-2">
            {[
              { label: 'Flight', value: `${flight?.name || 'Economy'} — ${flight?.airline || 'IndiGo'}`, icon: '✈️' },
              { label: 'Hotel', value: `${hotel?.name || 'Standard'} — ${hotel?.brand || ''}`, icon: '🏨' },
              { label: 'Guide', value: guide?.name || 'Self-Guided', icon: '🗺️' },
              { label: 'Transport', value: cab?.name || 'Economy Cab', icon: '🚗' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary Preview */}
        {trip.itinerary && trip.itinerary.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="font-bold text-gray-900 dark:text-white mb-3">📅 Itinerary Overview</p>
            <div className="space-y-2">
              {trip.itinerary.slice(0, 5).map((dayActivities, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Day {i + 1}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{dayActivities[0]} + {dayActivities.length - 1} more</p>
                  </div>
                </div>
              ))}
              {trip.itinerary.length > 5 && (
                <p className="text-xs text-orange-500 font-medium pl-10">+{trip.itinerary.length - 5} more days</p>
              )}
            </div>
          </div>
        )}

        {/* Passenger Details */}
        {prefs.passengers && prefs.passengers.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="font-bold text-gray-900 dark:text-white mb-3">👥 Passenger Details</p>
            <div className="space-y-2">
              {prefs.passengers.map((pax, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-xl">{pax.type === 'child' ? '👶' : '👤'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{pax.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{pax.type} • Age {pax.age} • {pax.gender}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {trip.status === 'planning' && (
            <button
              onClick={() => {
                setScreen('payment');
              }}
              className="w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              💳 Complete Payment
            </button>
          )}
          <button
            onClick={() => setScreen('support')}
            className="w-full py-3 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            📞 Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
