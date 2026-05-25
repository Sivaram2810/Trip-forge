import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCY_RATES } from '../data/constants';
import { CheckCircle } from 'lucide-react';

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

export default function ConfirmationScreen() {
  const { currentPrefs, currentPlan, trips, setScreen, currency } = useApp();
  const [visible, setVisible] = useState(false);

  const transactionId = `TF${Date.now().toString().slice(-10).toUpperCase()}`;
  const bookingRef = `BK${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Find the booked trip (most recently booked)
  const bookedTrip = trips.find(t => t.id === currentPlan?.id) || trips[0];
  const prefs = currentPrefs || bookedTrip?.preferences;
  const total = bookedTrip?.totalCost || currentPlan?.totalCost || 0;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const confettiItems = ['🎉', '🌍', '✈️', '🏝️', '🎊', '⭐', '🎈', '🌟'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Confetti animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-bounce"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 60}%`,
              animationDelay: `${(i * 0.2) % 2}s`,
              animationDuration: `${1.5 + (i % 3) * 0.5}s`,
              opacity: visible ? 0.6 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            {confettiItems[i % confettiItems.length]}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Success Icon */}
        <div
          className="mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <CheckCircle size={56} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-300/40 animate-ping" />
          </div>
        </div>

        {/* Main message */}
        <div
          className="text-center mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.3s',
          }}
        >
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-gray-500 dark:text-gray-400">Your adventure is officially on the calendar!</p>
        </div>

        {/* Booking Card */}
        <div
          className="w-full max-w-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.5s',
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl">
            {/* Ticket header */}
            <div className="p-5 text-center"
              style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">✈️ TripForge Booking</p>
              <h2 className="text-white text-xl font-black mb-1">
                {prefs?.from || 'Origin'} → {prefs?.destination || 'Destination'}
              </h2>
              <p className="text-white/70 text-sm">{prefs?.duration} nights • {prefs?.travellers || ((prefs?.adults || 2) + (prefs?.children || 0))} travellers</p>
              {prefs?.date && <p className="text-white/60 text-xs mt-1">📅 {prefs.date}</p>}
            </div>

            {/* Dashed separator */}
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-950 -ml-3 flex-shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-gray-100 dark:border-gray-800 mx-2" />
              <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-950 -mr-3 flex-shrink-0" />
            </div>

            {/* Booking details */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Booking Reference</span>
                <span className="text-xs font-black text-gray-900 dark:text-white font-mono">{bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Trip Type</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">{prefs?.tripType || 'Leisure'}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Amount Paid</span>
                <span className="text-xl font-black" style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {fmt(total, currency)}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className="mx-5 mb-5">
              <div className="flex items-center justify-center gap-2 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-700 dark:text-green-400 text-sm font-bold">✅ Payment Successful</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div
          className="w-full max-w-sm mt-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.8s',
          }}
        >
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-800">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">📧 What's next?</p>
            <div className="space-y-1.5">
              {[
                '✅ Booking confirmation sent to your email',
                '📱 E-tickets will arrive within 30 minutes',
                '🏨 Hotel vouchers sent separately',
                '🚗 Transfer details confirmed 48h before travel',
              ].map((item, i) => (
                <p key={i} className="text-xs text-gray-600 dark:text-gray-400">{item}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          className="w-full max-w-sm mt-4 space-y-3"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 1s',
          }}
        >
          <button
            onClick={() => setScreen('dashboard')}
            className="w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            🏠 Back to Dashboard
          </button>
          <button
            onClick={() => setScreen('support')}
            className="w-full py-3 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            📞 Need Help?
          </button>
        </div>
      </div>
    </div>
  );
}
