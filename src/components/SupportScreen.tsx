import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mail, ChevronDown, ChevronUp, Send, Loader2, MessageCircle, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AI_RESPONSES } from '../data/constants';

const FAQ = [
  { q: 'How do I cancel my booking?', a: 'You can cancel your booking up to 48 hours before departure for a full refund. Go to My Trips → Select booking → Contact Support. Cancellations within 48 hours may attract charges.' },
  { q: 'Is my payment information secure?', a: 'Yes! We use 256-bit SSL encryption for all transactions. We never store your card details on our servers. Payments are processed through PCI DSS certified gateways.' },
  { q: 'Can I modify my itinerary after booking?', a: 'Yes, you can modify your itinerary up to 72 hours before departure. Contact support via chat or phone. Changes may be subject to availability and price adjustments.' },
  { q: 'What is the TripForge Gold membership?', a: 'Gold membership gives you exclusive access to deals, priority customer support, 5% cashback on all bookings, and free travel insurance for trips over ₹50,000.' },
  { q: 'How does the AI trip planning work?', a: 'Our AI analyses your preferences, budget, and travel dates to generate personalised itineraries. It considers seasonality, popular attractions, and local events to create the perfect trip.' },
  { q: 'Do you offer travel insurance?', a: 'Yes! Comprehensive travel insurance is available as an add-on during booking. It covers medical emergencies, flight cancellations, lost luggage, and more. Highly recommended for international travel.' },
  { q: 'Can I book for a group?', a: 'Absolutely! TripForge supports group bookings for up to 50 people. For groups over 10 people, contact our dedicated group travel team for special rates and customised packages.' },
];

const SUPPORT_BOT_RESPONSES: Record<string, string> = {
  'cancel': '🔴 To cancel your booking: Go to My Trips → Select your trip → Contact our support team. Full refund available up to 48 hours before departure.',
  'refund': '💰 Refund Policy: Full refund for cancellations 48h+ before departure. 50% refund for 24-48h. No refund within 24h. Processing takes 5-7 business days.',
  'modify': '✏️ To modify your booking, contact us at least 72 hours before departure. Call +91 9944487018 or email 9632sivaram2122@gmail.com.',
  'payment': '💳 Payment Methods: We accept Visa, Mastercard, RuPay, UPI (GPay, PhonePe, Paytm, BHIM), and EMI plans for 3-24 months at 0% interest.',
  'visa': '🛂 Visa assistance is available for most destinations. We partner with visa agencies for fast-track processing. Contact us at 9632sivaram2122@gmail.com.',
  'insurance': '🛡️ Travel insurance is available from ₹499/trip. Covers medical emergencies, trip cancellation, lost luggage, and flight delays.',
  'hello': '👋 Hello! Welcome to TripForge Support! How can I help you today? You can ask about bookings, cancellations, payments, or any travel queries.',
  'hi': '👋 Hi there! I\'m the TripForge Support Bot. How can I assist you today?',
  'help': '🤝 I can help you with: Booking queries, Cancellations & refunds, Payment issues, Visa information, Travel insurance, Itinerary changes. What do you need help with?',
  'default': '🤖 I\'m the TripForge Support Bot! For immediate assistance:\n📞 Call: +91 9944487018\n📧 Email: 9632sivaram2122@gmail.com\n⏰ Available 24/7\n\nOr describe your issue and I\'ll try to help!',
};

function getSupportResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, val] of Object.entries(SUPPORT_BOT_RESPONSES)) {
    if (lower.includes(key)) return val;
  }
  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return val;
  }
  return SUPPORT_BOT_RESPONSES['default'];
}

export default function SupportScreen() {
  const { setScreen } = useApp();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState({ subject: '', message: '', category: 'general' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'chat'>('faq');

  // Chat state
  type ChatMsg = { role: 'bot' | 'user'; text: string };
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { role: 'bot', text: '👋 Hello! I\'m the TripForge Support Bot. How can I help you today? Ask about bookings, cancellations, payments, or travel queries!' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, botTyping]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setBotTyping(true);

    setTimeout(() => {
      const response = getSupportResponse(userMsg);
      setBotTyping(false);
      setChatMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 1200);
  };

  const handleSubmit = async () => {
    if (!ticket.subject || !ticket.message) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const ticketId = Math.floor(Math.random() * 100000);

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

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Quick contact */}
        <div className="grid grid-cols-3 gap-3">
          <a
            href="tel:+919944487018"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl text-white bg-gradient-to-br from-green-400 to-emerald-500 hover:opacity-90 transition-opacity shadow-md"
          >
            <Phone size={22} />
            <p className="font-bold text-xs">Call Us</p>
            <p className="text-white/70 text-xs text-center">+91 9944487018</p>
          </a>
          <button
            onClick={() => setActiveTab('chat')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl text-white bg-gradient-to-br from-blue-400 to-blue-500 hover:opacity-90 transition-opacity shadow-md"
          >
            <MessageCircle size={22} />
            <p className="font-bold text-xs">Live Chat</p>
            <p className="text-white/70 text-xs">Avg. 2 min wait</p>
          </button>
          <a
            href="mailto:9632sivaram2122@gmail.com"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl text-white bg-gradient-to-br from-orange-400 to-pink-500 hover:opacity-90 transition-opacity shadow-md"
          >
            <Mail size={22} />
            <p className="font-bold text-xs">Email</p>
            <p className="text-white/70 text-xs">Reply in 24h</p>
          </a>
        </div>

        {/* Contact info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-gray-900 dark:text-white mb-3">📋 Contact Information</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Phone size={16} className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone / WhatsApp</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">+91 9944487018</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Mail size={16} className="text-orange-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email Support</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">9632sivaram2122@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-base">⏰</span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Support Hours</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">24/7 — Always Available</p>
              </div>
            </div>
          </div>
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
              {t === 'faq' ? '❓ FAQ' : t === 'contact' ? '📋 Contact' : '💬 Chat Bot'}
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
                <p className="text-gray-500 dark:text-gray-400 text-sm">Your ticket #{ticketId} has been created. We'll respond within 24 hours at 9632sivaram2122@gmail.com</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 px-4 py-2 rounded-xl text-orange-500 text-sm font-semibold">Submit Another</button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail size={16} className="text-orange-500" /> Raise a Support Ticket
                </h3>
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                />
                <textarea
                  placeholder="Describe your issue in detail..."
                  value={ticket.message}
                  onChange={e => setTicket(t => ({ ...t, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none resize-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !ticket.subject || !ticket.message}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                >
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Ticket'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chat Bot */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🤖</div>
              <div>
                <p className="font-bold text-white">TripForge Support Bot</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  <p className="text-white/80 text-xs">Online • Avg response: instant</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🤖</div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'text-white rounded-tr-none'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                  }`}
                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {botTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🤖</div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {['Cancellation', 'Payment issue', 'Visa help', 'Refund status', 'Modify booking'].map(q => (
                <button
                  key={q}
                  onClick={() => { setChatInput(q); setTimeout(() => handleSendChat(), 100); }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 pt-2 flex gap-2 border-t border-gray-100 dark:border-gray-800">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || botTyping}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
