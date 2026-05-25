import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Calendar, Shield, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCY_RATES } from '../data/constants';

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

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function PaymentScreen() {
  const { currentPrefs, currentPlan, updateTripStatus, setScreen, currency } = useApp();
  const prefs = currentPrefs;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'emi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [emiMonths, setEmiMonths] = useState(6);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = currentPlan?.totalCost || 0;
  const emiAmount = Math.ceil(total / emiMonths);

  const validateCard = () => {
    const errs: Record<string, string> = {};
    const numOnly = cardNumber.replace(/\s/g, '');
    if (numOnly.length !== 16) errs.cardNumber = 'Card number must be 16 digits';
    if (!cardName.trim() || cardName.trim().length < 3) errs.cardName = 'Enter the card holder name';
    if (!cardExpiry || cardExpiry.length !== 5) errs.cardExpiry = 'Enter valid expiry (MM/YY)';
    if (!/^\d{3}$/.test(cardCvv)) errs.cardCvv = 'CVV must be exactly 3 digits';
    return errs;
  };

  const validateUPI = () => {
    const errs: Record<string, string> = {};
    if (!upiId.trim() || !upiId.includes('@')) errs.upiId = 'Enter a valid UPI ID (e.g. user@upi)';
    return errs;
  };

  const handlePayment = async () => {
    setErrors({});
    let errs: Record<string, string> = {};

    if (paymentMethod === 'card') errs = validateCard();
    else if (paymentMethod === 'upi') errs = validateUPI();

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    // Update trip status to booked
    if (currentPlan) {
      updateTripStatus(currentPlan.id, 'booked');
    }

    setProcessing(false);
    setScreen('confirmation');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('plan')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Secure Checkout</h1>
            <div className="flex items-center gap-1">
              <Lock size={12} className="text-green-500" />
              <p className="text-xs text-green-600 dark:text-green-400">256-bit SSL Encrypted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-32">
        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-white mb-3">Order Summary</p>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">✈️ {prefs?.from} → {prefs?.destination}</span>
              <span className="text-gray-900 dark:text-white font-semibold">{prefs?.duration}N</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">👥 Travellers</span>
              <span className="text-gray-900 dark:text-white font-semibold">{prefs?.travellers || ((prefs?.adults || 2) + (prefs?.children || 0))} persons</span>
            </div>
            {prefs?.date && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">📅 Departure</span>
                <span className="text-gray-900 dark:text-white font-semibold">{prefs.date}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
            <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
            <span className="font-black text-xl" style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {fmt(total, currency)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Shield size={12} className="text-green-500" />
            <p className="text-xs text-green-600 dark:text-green-400">All taxes & fees included • Free cancellation up to 48h before</p>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {([
            { id: 'card', label: '💳 Card', icon: CreditCard },
            { id: 'upi', label: '📱 UPI', icon: Smartphone },
            { id: 'emi', label: '📆 EMI', icon: Calendar },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setPaymentMethod(id); setErrors({}); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                paymentMethod === id ? 'text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
              style={paymentMethod === id ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Card Form */}
        {paymentMethod === 'card' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
            <p className="font-bold text-gray-900 dark:text-white">💳 Card Details</p>

            {/* Card preview */}
            <div className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #302b63, #0f0c29)', minHeight: '130px' }}>
              <div className="absolute top-4 right-4 text-4xl opacity-20">💳</div>
              <p className="text-white/50 text-xs mb-3 font-mono">DEBIT / CREDIT CARD</p>
              <p className="text-white font-mono text-lg font-bold mb-4 tracking-widest">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between">
                <div>
                  <p className="text-white/50 text-xs">Card Holder</p>
                  <p className="text-white text-sm font-semibold">{cardName || 'YOUR NAME'}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs">Expires</p>
                  <p className="text-white text-sm font-semibold">{cardExpiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Card Number</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-mono"
              />
              {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
            </div>

            {/* Card Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Card Holder Name</label>
              <input
                type="text"
                placeholder="Name as on card"
                value={cardName}
                onChange={e => setCardName(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Expiry Date</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-mono"
                />
                {errors.cardExpiry && <p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">CVV (3 digits)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-mono"
                />
                {errors.cardCvv && <p className="text-xs text-red-500 mt-1">{errors.cardCvv}</p>}
              </div>
            </div>

            {/* Card brands */}
            <div className="flex gap-2 flex-wrap">
              {['🟦 Visa', '🔴 Mastercard', '🟠 Amex', '🟣 RuPay'].map(card => (
                <span key={card} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-400">{card}</span>
              ))}
            </div>
          </div>
        )}

        {/* UPI Form */}
        {paymentMethod === 'upi' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
            <p className="font-bold text-gray-900 dark:text-white">📱 UPI Payment</p>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              {errors.upiId && <p className="text-xs text-red-500 mt-1">{errors.upiId}</p>}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Or pay with</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '📱 GPay', id: 'gpay' },
                  { label: '💚 PhonePe', id: 'phonepe' },
                  { label: '🔵 Paytm', id: 'paytm' },
                  { label: '🟠 BHIM', id: 'bhim' },
                ].map(app => (
                  <button
                    key={app.id}
                    onClick={() => setUpiId(`user@${app.id}`)}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                      upiId.includes(app.id)
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {app.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">📲 You'll receive a payment request on your UPI app. Approve it to complete the booking.</p>
            </div>
          </div>
        )}

        {/* EMI Form */}
        {paymentMethod === 'emi' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
            <p className="font-bold text-gray-900 dark:text-white">📆 EMI Plans</p>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 9, 12, 18, 24].map(months => (
                <button
                  key={months}
                  onClick={() => setEmiMonths(months)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    emiMonths === months
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <p className="font-black text-gray-900 dark:text-white text-sm">{months}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">months</p>
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-1">{fmt(Math.ceil(total / months), currency)}/mo</p>
                </button>
              ))}
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 border border-orange-100 dark:border-orange-800">
              <p className="font-bold text-gray-900 dark:text-white text-sm">Pay {fmt(emiAmount, currency)}/month for {emiMonths} months</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">0% interest for select banks • Min. order: ₹10,000</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Available on: HDFC, ICICI, SBI, Axis, Kotak credit cards</p>
          </div>
        )}

        {/* Trust badges */}
        <div className="flex gap-2 justify-center">
          {['🔒 Secure', '✅ Encrypted', '🏦 Bank-level', '📞 24/7 Support'].map(badge => (
            <span key={badge} className="text-xs px-2 py-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-gray-500 dark:text-gray-400">{badge}</span>
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 z-40">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            {processing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock size={16} />
                Pay {fmt(total, currency)} Securely
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">By paying, you agree to our Terms & Cancellation Policy</p>
        </div>
      </div>
    </div>
  );
}
