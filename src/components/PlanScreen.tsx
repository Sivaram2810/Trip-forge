import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Star, Wind, Droplets, MessageCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  FLIGHT_CLASSES, HOTEL_CLASSES, GUIDE_CLASSES, CAB_CLASSES,
  WEATHER_DATA, CURRENCY_RATES, AI_RESPONSES, TRAVEL_TIPS
} from '../data/constants';
import { TripPlan } from '../types';

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

export default function PlanScreen() {
  const { currentPrefs, currentPlan, setScreen, addTrip, currency } = useApp();
  const prefs = currentPrefs!;

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'weather' | 'currency' | 'chat' | 'tips'>('overview');

  const [selectedFlight, setSelectedFlight] = useState(currentPlan?.flight || 'fc2');
  const [selectedHotel, setSelectedHotel] = useState(currentPlan?.hotel || 'h2');
  const [selectedGuide, setSelectedGuide] = useState(currentPlan?.guide || 'g2');
  const [selectedCab, setSelectedCab] = useState(currentPlan?.cab || 'c2');
  const [itinerary, setItinerary] = useState(currentPlan?.itinerary || []);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [dragItem, setDragItem] = useState<{ day: number; idx: number } | null>(null);

  type ChatMsg = { role: 'ai' | 'user'; text: string };
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { role: 'ai', text: `Hello! I'm your TripForge AI assistant. I'll help you make the most of your trip to ${prefs?.destination || 'your destination'}. Ask me anything! 🌍` },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [currencyAmount, setCurrencyAmount] = useState('1000');
  const [currencyFrom, setCurrencyFrom] = useState('INR');
  const [currencyTo, setCurrencyTo] = useState('USD');

  const weather = WEATHER_DATA[prefs?.destination || ''] || WEATHER_DATA['default'];

  const flightData = FLIGHT_CLASSES.find(f => f.id === selectedFlight)!;
  const hotelData = HOTEL_CLASSES.find(h => h.id === selectedHotel)!;
  const guideData = GUIDE_CLASSES.find(g => g.id === selectedGuide)!;
  const cabData = CAB_CLASSES.find(c => c.id === selectedCab)!;

  const flightCost = (flightData?.price || 0) * 2 * (prefs?.travellers || 2);
  const hotelCost = (hotelData?.pricePerNight || 0) * (prefs?.duration || 7) * Math.ceil((prefs?.travellers || 2) / 2);
  const guideCost = (guideData?.price || 0) * (prefs?.duration || 7);
  const cabCost = (cabData?.pricePerDay || 0) * (prefs?.duration || 7);
  const total = flightCost + hotelCost + guideCost + cabCost;
  const budget = prefs?.budget || 100000;
  const underBudget = total <= budget;
  const budgetDiff = Math.abs(budget - total);

  const convertCurrency = () => {
    const amount = parseFloat(currencyAmount) || 0;
    const fromRate = CURRENCY_RATES[currencyFrom]?.rate || 1;
    const toRate = CURRENCY_RATES[currencyTo]?.rate || 1;
    const inINR = amount / fromRate;
    const result = inINR * toRate;
    const sym = CURRENCY_RATES[currencyTo]?.symbol || '';
    if (result >= 1000000) return `${sym}${(result / 1000000).toFixed(2)}M`;
    if (result >= 1000) return `${sym}${(result / 1000).toFixed(2)}K`;
    return `${sym}${result.toFixed(4)}`;
  };

  const swapActivities = (day: number, i1: number, i2: number) => {
    setItinerary(prev => {
      const copy = prev.map(d => [...d]);
      [copy[day][i1], copy[day][i2]] = [copy[day][i2], copy[day][i1]];
      return copy;
    });
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');

    setTimeout(() => {
      const lower = msg.toLowerCase();
      let response = AI_RESPONSES['default'];
      for (const [key, val] of Object.entries(AI_RESPONSES)) {
        if (lower.includes(key)) { response = val; break; }
      }
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleConfirmBooking = () => {
    const plan: TripPlan = {
      id: currentPlan?.id || `trip_${Date.now()}`,
      preferences: { ...prefs, travellers: prefs.adults + prefs.children },
      flight: selectedFlight,
      hotel: selectedHotel,
      guide: selectedGuide,
      cab: selectedCab,
      itinerary,
      totalCost: total,
      createdAt: currentPlan?.createdAt || new Date().toISOString(),
      status: 'planning',
    };
    addTrip(plan);
    setScreen('payment');
  };

  const tabs = [
    { id: 'overview', label: '📋 Plan' },
    { id: 'itinerary', label: '📅 Itinerary' },
    { id: 'weather', label: '⛅ Weather' },
    { id: 'currency', label: '💱 Currency' },
    { id: 'chat', label: '🤖 AI Chat' },
    { id: 'tips', label: '💡 Tips' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white text-sm">{prefs?.from} → {prefs?.destination}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{prefs?.duration} nights • {prefs?.travellers || (prefs?.adults + prefs?.children)} travellers</p>
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded-full ${underBudget ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {underBudget ? '✅' : '⚠️'} {fmt(budgetDiff, currency)} {underBudget ? 'under' : 'over'}
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === t.id ? 'text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                }`}
                style={activeTab === t.id ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Budget Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-900 dark:text-white">Budget Overview</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${underBudget ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {underBudget ? 'Within Budget! 🎉' : 'Over Budget ⚠️'}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">Your Budget</span>
                <span className="font-bold text-gray-900 dark:text-white">{fmt(budget, currency)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500 dark:text-gray-400">Trip Total</span>
                <span className="font-black text-gray-900 dark:text-white">{fmt(total, currency)}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${underBudget ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ width: `${Math.min(100, (total / budget) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round((total / budget) * 100)}% of budget used</p>
            </div>

            <SelectionGroup title="✈️ Flight Class" options={FLIGHT_CLASSES.map(f => ({
              id: f.id, name: f.name, icon: f.icon, color: f.color,
              price: `${fmt(f.price * 2)} per person`,
              rawPrice: f.price * 2 * prefs.travellers,
              subtitle: `${f.airline} • ${f.stops} • ${f.duration}`,
              features: f.features,
            }))} selected={selectedFlight} onSelect={setSelectedFlight} fmt={(n) => fmt(n, currency)} />

            <SelectionGroup title="🏨 Hotel Category" options={HOTEL_CLASSES.map(h => ({
              id: h.id, name: h.name, icon: h.icon, color: h.color,
              price: `${fmt(h.pricePerNight)} / night`,
              rawPrice: h.pricePerNight * prefs.duration * Math.ceil(prefs.travellers / 2),
              subtitle: `${h.brand} • ⭐ ${h.rating}`,
              features: h.features,
            }))} selected={selectedHotel} onSelect={setSelectedHotel} fmt={(n) => fmt(n, currency)} />

            <SelectionGroup title="🗺️ Tour Guide" options={GUIDE_CLASSES.map(g => ({
              id: g.id, name: g.name, icon: g.icon, color: g.color,
              price: g.price === 0 ? 'Free' : `${fmt(g.price)} / day`,
              rawPrice: g.price * prefs.duration,
              subtitle: '',
              features: g.features,
            }))} selected={selectedGuide} onSelect={setSelectedGuide} fmt={(n) => fmt(n, currency)} />

            <SelectionGroup title="🚗 Transport" options={CAB_CLASSES.map(c => ({
              id: c.id, name: c.name, icon: c.icon, color: c.color,
              price: `${fmt(c.pricePerDay)} / day`,
              rawPrice: c.pricePerDay * prefs.duration,
              subtitle: '',
              features: c.features,
            }))} selected={selectedCab} onSelect={setSelectedCab} fmt={(n) => fmt(n, currency)} />
          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Day-wise Itinerary</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tap to expand • Drag to reorder</p>
            </div>
            {itinerary.map((dayActivities, dayIdx) => (
              <div key={dayIdx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                      {dayIdx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Day {dayIdx + 1}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{dayActivities.length} activities</p>
                    </div>
                  </div>
                  <span className="text-gray-400">{expandedDay === dayIdx ? '▲' : '▼'}</span>
                </button>
                {expandedDay === dayIdx && (
                  <div className="px-4 pb-4 space-y-2">
                    {dayActivities.map((activity, actIdx) => (
                      <div
                        key={actIdx}
                        draggable
                        onDragStart={() => setDragItem({ day: dayIdx, idx: actIdx })}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => {
                          if (dragItem && dragItem.day === dayIdx && dragItem.idx !== actIdx) {
                            swapActivities(dayIdx, dragItem.idx, actIdx);
                          }
                          setDragItem(null);
                        }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-grab active:cursor-grabbing"
                      >
                        <span className="text-xl">{activity.split(' ')[0]}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{activity.substring(activity.indexOf(' ') + 1)}</span>
                        <span className="text-gray-300 dark:text-gray-600">⣿</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* WEATHER TAB */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{prefs?.destination}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">{weather.temp}°</span>
                    <div>
                      <p className="text-2xl">{weather.icon}</p>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{weather.condition}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Droplets size={16} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="font-bold text-gray-900 dark:text-white">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Wind size={16} className="text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
                    <p className="font-bold text-gray-900 dark:text-white">{weather.wind} km/h</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-3">5-Day Forecast</p>
              <div className="flex justify-between">
                {weather.forecast.map((day, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day.day}</p>
                    <p className="text-xl mb-1">{day.icon}</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{day.high}°</p>
                    <p className="text-xs text-gray-400">{day.low}°</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-300">💡 Best time to visit {prefs?.destination}: Pack accordingly and check local weather 24 hours before departure!</p>
            </div>
          </div>
        )}

        {/* CURRENCY TAB */}
        {activeTab === 'currency' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <p className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">💱 Currency Converter</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Amount</label>
                  <input
                    type="number"
                    value={currencyAmount}
                    onChange={e => setCurrencyAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">From</label>
                    <select
                      value={currencyFrom}
                      onChange={e => setCurrencyFrom(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                    >
                      {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                        <option key={code} value={code}>{data.flag} {code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">To</label>
                    <select
                      value={currencyTo}
                      onChange={e => setCurrencyTo(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                    >
                      {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                        <option key={code} value={code}>{data.flag} {code}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Result</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{convertCurrency()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {currencyAmount} {currencyFrom} = {convertCurrency()} {currencyTo}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-3">📊 Live Rates (Base: INR)</p>
              <div className="space-y-2">
                {Object.entries(CURRENCY_RATES).filter(([code]) => code !== 'INR').map(([code, data]) => (
                  <div key={code} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{data.flag}</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{code}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{data.symbol}{data.rate.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[65vh]">
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                      <MessageCircle size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                  }`}
                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Quick prompts */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
              {['budget tips', 'visa info', 'packing list', 'food guide', 'safety tips'].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setChatInput(prompt); setTimeout(() => handleChat(), 100); }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder="Ask anything about your trip..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              <button
                onClick={handleChat}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* TIPS TAB */}
        {activeTab === 'tips' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💡</span>
              <p className="font-bold text-gray-900 dark:text-white">Essential Travel Tips</p>
            </div>
            {TRAVEL_TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-2xl">{tip.icon}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {activeTab === 'overview' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 z-40">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Cost</p>
              <p className="font-black text-xl text-gray-900 dark:text-white">{fmt(total, currency)}</p>
            </div>
            <button
              onClick={handleConfirmBooking}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              Proceed to Payment →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectionGroup({ title, options, selected, onSelect, fmt }: {
  title: string;
  options: { id: string; name: string; icon: string; color: string; price: string; rawPrice: number; subtitle: string; features: string[]; rating?: number }[];
  selected: string;
  onSelect: (id: string) => void;
  fmt: (n: number) => string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      <p className="font-bold text-gray-900 dark:text-white mb-3">{title}</p>
      <div className="space-y-2">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              selected === opt.id
                ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${opt.color} flex-shrink-0`}>
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm text-gray-900 dark:text-white">{opt.name}</p>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400">{fmt(opt.rawPrice)}</p>
              </div>
              {opt.subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{opt.subtitle}</p>}
              <div className="flex flex-wrap gap-1 mt-1">
                {opt.features.slice(0, 2).map(f => (
                  <span key={f} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
            {selected === opt.id && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                <Star size={10} className="text-white fill-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
