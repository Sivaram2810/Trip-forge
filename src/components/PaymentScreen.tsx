import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Calendar, Lock, Check, Loader2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCY_RATES } from '../data/constants';

export default function PaymentScreen() {
  const { currentPlan, setCurrentPlan, currentPrefs, addTrip, setScreen, currency } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'emi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [emiMonths, setEmiMonths] = useState(6);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'done'>('form');
  const [transactionId, setTransactionId] = useState('');

  const total = currentPlan?.totalCost || 0;
  const fmt = (n: number) => {
    const rate = CURRENCY_RATES[currency]?.rate || 1;
    const sym = CURRENCY_RATES[currency]?.symbol || '₹';
    const converted = n * rate;
    return `${sym}${converted >= 100000 ? (converted / 100000).toFixed(2) + 'L' : converted >= 1000 ? (converted / 1000).toFixed(2) + 'K' : converted.toFixed(2)}`;
  };

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const emiAmount = total / emiMonths;

  const handlePayment = async () => {
    setProcessing(true);
    setStep('processing');
    await new Promise(r => setTimeout(r, 2500));
    const txnId = `TF${Date.now().toString().slice(-8)}`;
    setTransactionId(txnId);
    setStep('done');

    if (currentPlan) {
      const updated = { ...currentPlan, status: 'booked' as const };
      setCurrentPlan(updated);
      addTrip(updated);
    }
  };

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'Inter, sans-serif' }}>
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full border-4 border-t-orange-400 border-orange-400/20 mx-auto animate-spin" />
          <div>
            <h2 className="text-white text-xl font-bold">Processing Payment</h2>
            <p className="text-purple-200/60 text-sm mt-1">Please wait, do not close the page...</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-purple-300/60 text-sm">
            <Lock size={14} />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'Inter, sans-serif' }}>
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto bg-green-500 shadow-2xl shadow-green-500/30">
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">Booking Confirmed! 🎉</h2>
            <p className="text-purple-200/60 text-sm mt-2">Your journey to {currentPrefs?.destination} is booked!</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 text-sm">
            <div className="flex justify-between text-purple-200">
              <span>Transaction ID</span>
              <span className="text-white font-mono font-bold">{transactionId}</span>
            </div>
            <div className="flex justify-between text-purple-200">
              <span>Amount Paid</span>
              <span className="text-green-400 font-bold">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-purple-200">
              <span>Destination</span>
              <span className="text-white font-bold">{currentPrefs?.destination}</span>
            </div>
            <div className="flex justify-between text-purple-200">
              <span>Duration</span>
              <span className="text-white font-bold">{currentPrefs?.duration} Nights</span>
            </div>
            <div className="flex justify-between text-purple-200">
              <span>Payment Method</span>
              <span className="text-white font-bold capitalize">{paymentMethod}</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setScreen('dashboard')}
              className="w-full py-4 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              Go to Dashboard 🏠
            </button>
            <button
              onClick={() => setScreen('plan')}
              className="w-full py-3 rounded-xl font-semibold text-white/70 text-sm border border-white/20"
            >
              View Trip Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('plan')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 dark:text-white">Secure Payment</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Lock size={11} className="text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400">256-bit SSL Encrypted</span>
            </div>
          </div>
          <Shield size={20} className="text-green-500" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Order summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>✈️ {currentPrefs?.from} → {currentPrefs?.destination}</span>
              <span>{currentPrefs?.duration}N</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>👥 Travellers</span>
              <span>{currentPrefs?.travellers} persons</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
            <div className="flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total Amount</span>
              <span className="text-xl">{fmt(total)}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
              <Check size={12} />
              <span>All taxes & fees included • Free cancellation up to 48h before</span>
            </div>
          </div>
        </div>

        {/* Payment method tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {([
            { id: 'card', label: '💳 Card', icon: CreditCard },
            { id: 'upi', label: '📱 UPI', icon: Smartphone },
            { id: 'emi', label: '📆 EMI', icon: Calendar },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPaymentMethod(id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                paymentMethod === id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Card form */}
        {paymentMethod === 'card' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard size={16} className="text-orange-500" /> Card Details
            </h3>
            {/* Card preview */}
            <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', minHeight: 140 }}>
              <div className="absolute right-4 top-4 text-3xl opacity-30">💳</div>
              <p className="text-lg font-mono tracking-widest mt-4">{cardNumber || '•••• •••• •••• ••••'}</p>
              <div className="flex justify-between mt-4 text-sm">
                <div>
                  <p className="text-white/50 text-xs">Card Holder</p>
                  <p className="font-semibold">{cardName || 'YOUR NAME'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs">Expires</p>
                  <p className="font-semibold">{cardExpiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>
            <input
              placeholder="Card Number"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-mono"
            />
            <input
              placeholder="Cardholder Name"
              value={cardName}
              onChange={e => setCardName(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-mono"
              />
              <input
                placeholder="CVV"
                type="password"
                value={cardCvv}
                onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['🟦 Visa', '🔴 Mastercard', '🟠 Amex', '🟣 Rupay'].map(card => (
                <span key={card} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">{card}</span>
              ))}
            </div>
          </div>
        )}

        {/* UPI form */}
        {paymentMethod === 'upi' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Smartphone size={16} className="text-orange-500" /> UPI Payment
            </h3>
            <input
              placeholder="Enter UPI ID (e.g. name@paytm)"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Or pay with</p>
              <div className="grid grid-cols-4 gap-2">
                {['📱 GPay', '💚 PhonePe', '🔵 Paytm', '🟠 BHIM'].map(app => (
                  <button
                    key={app}
                    onClick={() => setUpiId(`demo@${app.split(' ')[1].toLowerCase()}`)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-orange-400 transition-colors"
                  >
                    <span className="text-xl">{app.split(' ')[0]}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{app.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">You'll receive a payment request on your UPI app. Approve it to complete the booking.</p>
            </div>
          </div>
        )}

        {/* EMI form */}
        {paymentMethod === 'emi' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={16} className="text-orange-500" /> EMI Plans
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 9, 12, 18, 24].map(months => (
                <button
                  key={months}
                  onClick={() => setEmiMonths(months)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    emiMonths === months
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <p className={`font-bold text-sm ${emiMonths === months ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>{months}M</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{fmt(emiAmount)}/mo</p>
                </button>
              ))}
            </div>
            <div className="p-4 rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <p className="text-sm text-gray-700 dark:text-gray-300">Pay <span className="font-bold text-orange-600 dark:text-orange-400">{fmt(emiAmount)}/month</span> for <span className="font-bold">{emiMonths} months</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% interest for select banks • Min. order: ₹10,000</p>
            </div>
            <p className="text-xs text-gray-400">Available on: HDFC, ICICI, SBI, Axis, Kotak credit cards</p>
          </div>
        )}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 py-2">
          {['🔒 Secure', '✅ Encrypted', '🏦 Bank-level'].map(badge => (
            <span key={badge} className="text-xs text-gray-400">{badge}</span>
          ))}
        </div>
      </div>

      {/* Pay button */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            {processing ? (
              <><Loader2 size={18} className="animate-spin" /> Processing...</>
            ) : (
              <><Lock size={16} /> Pay {fmt(total)} Securely</>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            By proceeding, you agree to our booking terms and cancellation policy
          </p>
        </div>
      </div>
    </div>
  );
}
