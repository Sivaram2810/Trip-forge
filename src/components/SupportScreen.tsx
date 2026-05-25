import { useState } from 'react';
import { ArrowLeft, Mail, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FAQ = [
  { q: 'How do I cancel my booking?', a: 'You can cancel your booking up to 48 hours before departure for a full refund. Go to My Trips → Select booking → Cancel Trip. Cancellations within 48 hours may attract charges.' },
  { q: 'Is my payment information secure?', a: 'Yes! We use 256-bit SSL encryption for all transactions. We never store your card details on our servers. Payments are processed through PCI DSS certified gateways.' },
  { q: 'Can I modify my itinerary after booking?', a: 'Yes, you can modify your itinerary up to 72 hours before departure. Go to My Trips → Plan → Edit. Changes may be subject to availability and price adjustments.' },
  { q: 'What is the TripForge Gold membership?', a: 'Gold membership gives you exclusive access to deals, priority customer support, 5% cashback on all bookings, and free travel insurance for trips over ₹50,000.' },
  { q: 'How does the AI trip planning work?', a: 'Our AI analyses your preferences, budget, and travel dates to generate personalised itineraries. It considers seasonality, popular attractions, and local events to create the perfect trip.' },
  { q: 'Do you offer travel insurance?', a: 'Yes! Comprehensive travel insurance is available as an add-on during booking. It covers medical emergencies, flight cancellations, lost luggage, and more. Highly recommended for international travel.' },
  { q: 'Can I book for a group?', a: 'Absolutely! TripForge supports group bookings for up to 50 people. For groups over 10 people, contact our dedicated group travel team for special rates and customised packages.' },
];

export default function SupportScreen() {
  const { setScreen } = useApp();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState({ subject: '', message: '', category: 'general' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'chat'>('faq');

  const handleSubmit = async () => {
    if (!ticket.subject || !ticket.message) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white flex-1">Help & Support</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Quick contact */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📞', label: 'Call Us', sub: '1800-TripForge', color: 'from-green-400 to-emerald-500' },
            { icon: '💬', label: 'Live Chat', sub: 'Avg. 2 min wait', color: 'from-blue-400 to-blue-500' },
            { icon: '📧', label: 'Email', sub: 'Reply in 24h', color: 'from-orange-400 to-pink-500' },
          ].map(({ icon, label, sub, color }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-white bg-gradient-to-br ${color} hover:opacity-90 transition-opacity shadow-md`}
            >
              <span className="text-2xl">{icon}</span>
              <p className="font-bold text-xs">{label}</p>
              <p className="text-white/70 text-xs">{sub}</p>
            </button>
          ))}
        </div>

        {/* Status banner */}
        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-sm text-green-700 dark:text-green-300">All systems operational • Support available 24/7</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {(['faq', 'contact', 'chat'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase transition-all ${
                activeTab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {t === 'faq' ? 'FAQ' : t === 'contact' ? 'Contact' : 'Live Chat'}
            </button>
          ))}
        </div>

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-white text-sm pr-4">{item.q}</span>
                  {expandedFaq === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact form */}
        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Ticket Submitted!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Your ticket #{Math.floor(Math.random() * 100000)} has been created. We'll respond within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 px-4 py-2 rounded-xl text-orange-500 text-sm font-semibold">Submit Another</button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Mail size={16} className="text-orange-500" /> Raise a Support Ticket</h3>
                <select
                  value={ticket.category}
                  onChange={e => setTicket(t => ({ ...t, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                >
                  {['general', 'booking', 'payment', 'cancellation', 'technical', 'other'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
                <input
                  placeholder="Subject"
                  value={ticket.subject}
                  onChange={e => setTicket(t => ({ ...t, subject: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
                <textarea
                  placeholder="Describe your issue in detail..."
                  value={ticket.message}
                  onChange={e => setTicket(t => ({ ...t, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 resize-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                >
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Ticket</>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live chat stub */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xl">🤖</div>
              <div>
                <p className="text-white font-bold text-sm">TripForge Support Bot</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-white/70 text-xs">Online</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3 min-h-48">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">🤖</div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  Hello! I'm the TripForge support assistant. How can I help you today? 😊
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-9">
                {['Booking issue', 'Payment query', 'Cancellation', 'General help'].map(opt => (
                  <button key={opt} className="px-3 py-1.5 rounded-full text-xs border border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 p-3 flex gap-2">
              <input
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none"
              />
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
