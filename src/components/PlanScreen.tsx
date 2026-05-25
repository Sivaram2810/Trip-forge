import { useState, useRef } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronUp, RefreshCw, ShoppingCart, Star, Wind, Droplets, Send, Globe, TrendingUp, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FLIGHT_CLASSES, HOTEL_CLASSES, GUIDE_CLASSES, CAB_CLASSES, WEATHER_DATA, CURRENCY_RATES, AI_RESPONSES, TRAVEL_TIPS } from '../data/constants';
import { TripPlan } from '../types';

type PlanTab = 'overview' | 'itinerary' | 'weather' | 'currency' | 'chat' | 'tips';

export default function PlanScreen() {
  const { currentPlan, setCurrentPlan, currentPrefs, addTrip, setScreen, currency, setCurrency } = useApp();
  const [activeTab, setActiveTab] = useState<PlanTab>('overview');
  const [selectedFlight, setSelectedFlight] = useState(currentPlan?.flight || 'fc2');
  const [selectedHotel, setSelectedHotel] = useState(currentPlan?.hotel || 'h2');
  const [selectedGuide, setSelectedGuide] = useState(currentPlan?.guide || 'g2');
  const [selectedCab, setSelectedCab] = useState(currentPlan?.cab || 'c2');
  const [itinerary, setItinerary] = useState(currentPlan?.itinerary || []);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [dragItem, setDragItem] = useState<{ day: number; idx: number } | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: `Hi! I'm your TripForge AI. I can help you plan your perfect trip to ${currentPrefs?.destination}. What would you like to know? 🌍` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('INR');
  const [currencyTo, setCurrencyTo] = useState(currency || 'USD');
  const [currencyAmount, setCurrencyAmount] = useState('10000');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const prefs = currentPrefs!;
  const weather = WEATHER_DATA[prefs?.destination] || WEATHER_DATA['default'];

  const calcTotal = () => {
    const fl = FLIGHT_CLASSES.find(f => f.id === selectedFlight)!;
    const ho = HOTEL_CLASSES.find(h => h.id === selectedHotel)!;
    const gu = GUIDE_CLASSES.find(g => g.id === selectedGuide)!;
    const ca = CAB_CLASSES.find(c => c.id === selectedCab)!;
    return (
      fl.price * 2 * prefs.travellers +
      ho.pricePerNight * prefs.duration * Math.ceil(prefs.travellers / 2) +
      gu.price * prefs.duration +
      ca.pricePerDay * prefs.duration
    );
  };

  const total = calcTotal();
  const budget = prefs?.budget || 100000;
  const budgetDiff = budget - total;
  const underBudget = budgetDiff >= 0;

  const fmt = (n: number, cur = 'INR') => {
    const rate = CURRENCY_RATES[cur]?.rate || 1;
    const sym = CURRENCY_RATES[cur]?.symbol || '₹';
    const converted = n * rate;
    return `${sym}${converted >= 100000 ? (converted / 100000).toFixed(1) + 'L' : converted >= 1000 ? (converted / 1000).toFixed(1) + 'K' : converted.toFixed(0)}`;
  };

  const handleProceed = () => {
    const updatedPlan: TripPlan = {
      ...(currentPlan || { id: `trip_${Date.now()}`, createdAt: new Date().toISOString() }),
      preferences: prefs,
      flight: selectedFlight,
      hotel: selectedHotel,
      guide: selectedGuide,
      cab: selectedCab,
      itinerary,
      totalCost: total,
      status: 'planning',
    };
    setCurrentPlan(updatedPlan);
    setScreen('payment');
  };

  const handleSaveTrip = () => {
    const plan: TripPlan = {
      id: `trip_${Date.now()}`,
      preferences: prefs,
      flight: selectedFlight,
      hotel: selectedHotel,
      guide: selectedGuide,
      cab: selectedCab,
      itinerary,
      totalCost: total,
      createdAt: new Date().toISOString(),
      status: 'planning',
    };
    addTrip(plan);
    setCurrentPlan(plan);
    alert('Trip saved to My Trips! ✅');
  };

  const swapActivities = (day: number, i: number, j: number) => {
    const newItin = itinerary.map((d, di) => {
      if (di !== day) return d;
      const arr = [...d];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
    setItinerary(newItin);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(m => [...m, { role: 'user', text: userMsg }]);
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = AI_RESPONSES['default'];
      for (const [key, val] of Object.entries(AI_RESPONSES)) {
        if (lower.includes(key)) { response = val; break; }
      }
      if (lower.includes(prefs?.destination?.toLowerCase() || '')) {
        response = `Great choice! ${prefs.destination} is wonderful. ${response}`;
      }
      setChatMessages(m => [...m, { role: 'ai', text: response }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 600);
  };

  const convertCurrency = () => {
    const amount = parseFloat(currencyAmount) || 0;
    const fromRate = CURRENCY_RATES[currencyFrom]?.rate || 1;
    const toRate = CURRENCY_RATES[currencyTo]?.rate || 1;
    const inINR = amount / fromRate;
    const result = inINR * toRate;
    const toSym = CURRENCY_RATES[currencyTo]?.symbol || '';
    return `${toSym}${result.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const tabs: { id: PlanTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Plan', icon: '🗺️' },
    { id: 'itinerary', label: 'Days', icon: '📅' },
    { id: 'weather', label: 'Weather', icon: '⛅' },
    { id: 'currency', label: 'Currency', icon: '💱' },
    { id: 'chat', label: 'AI Chat', icon: '🤖' },
    { id: 'tips', label: 'Tips', icon: '💡' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 dark:text-white text-sm">{prefs?.from} → {prefs?.destination}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{prefs?.duration} nights • {prefs?.travellers} travellers</p>
          </div>
          {/* Budget indicator */}
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${underBudget ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
            {underBudget ? '✅' : '⚠️'} {fmt(Math.abs(budgetDiff))} {underBudget ? 'under' : 'over'}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4 flex gap-1 pb-2 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
              }`}
              style={activeTab === t.id ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Budget summary */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Budget Overview</h3>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className={underBudget ? 'text-green-500' : 'text-red-500'} />
                    <span className={`text-sm font-bold ${underBudget ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {underBudget ? 'Within Budget! 🎉' : 'Over Budget ⚠️'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Your Budget</span>
                    <span className="font-bold text-gray-900 dark:text-white">{fmt(budget)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Trip Total</span>
                    <span className="font-bold text-gray-900 dark:text-white">{fmt(total)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((total / budget) * 100, 100)}%`,
                        background: underBudget ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-right">{Math.round((total / budget) * 100)}% of budget used</p>
                </div>
              </div>

              {/* Flight selection */}
              <SelectionGroup
                title="✈️ Choose Flight"
                options={FLIGHT_CLASSES.map(f => ({
                  id: f.id,
                  name: f.name,
                  icon: f.icon,
                  color: f.color,
                  price: `${fmt(f.price * 2)} per person`,
                  rawPrice: f.price * 2 * prefs.travellers,
                  subtitle: `${f.airline} • ${f.stops} • ${f.duration}`,
                  features: f.features,
                }))}
                selected={selectedFlight}
                onSelect={setSelectedFlight}
                fmt={fmt}
              />

              {/* Hotel selection */}
              <SelectionGroup
                title="🏨 Choose Hotel"
                options={HOTEL_CLASSES.map(h => ({
                  id: h.id,
                  name: h.name,
                  icon: h.icon,
                  color: h.color,
                  price: `${fmt(h.pricePerNight)} / night`,
                  rawPrice: h.pricePerNight * prefs.duration * Math.ceil(prefs.travellers / 2),
                  subtitle: `${h.brand} • `,
                  features: h.features,
                  rating: h.rating,
                }))}
                selected={selectedHotel}
                onSelect={setSelectedHotel}
                fmt={fmt}
              />

              {/* Guide selection */}
              <SelectionGroup
                title="🎯 Choose Guide"
                options={GUIDE_CLASSES.map(g => ({
                  id: g.id,
                  name: g.name,
                  icon: g.icon,
                  color: g.color,
                  price: g.price === 0 ? 'Free' : `${fmt(g.price)} / day`,
                  rawPrice: g.price * prefs.duration,
                  subtitle: '',
                  features: g.features,
                }))}
                selected={selectedGuide}
                onSelect={setSelectedGuide}
                fmt={fmt}
              />

              {/* Cab selection */}
              <SelectionGroup
                title="🚗 Choose Transport"
                options={CAB_CLASSES.map(c => ({
                  id: c.id,
                  name: c.name,
                  icon: c.icon,
                  color: c.color,
                  price: `${fmt(c.pricePerDay)} / day`,
                  rawPrice: c.pricePerDay * prefs.duration,
                  subtitle: '',
                  features: c.features,
                }))}
                selected={selectedCab}
                onSelect={setSelectedCab}
                fmt={fmt}
              />
            </div>
          )}

          {/* ITINERARY TAB */}
          {activeTab === 'itinerary' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Day-wise Itinerary</h3>
                <span className="text-xs text-gray-400">Tap to expand • Drag to reorder</span>
              </div>
              {itinerary.map((dayActivities, dayIdx) => (
                <div
                  key={dayIdx}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
                    className="w-full flex items-center gap-3 p-4"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                      {dayIdx + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Day {dayIdx + 1}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{dayActivities.length} activities planned</p>
                    </div>
                    {expandedDay === dayIdx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {expandedDay === dayIdx && (
                    <div className="px-4 pb-4 space-y-2">
                      {dayActivities.map((activity, actIdx) => (
                        <div
                          key={actIdx}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 group"
                          draggable
                          onDragStart={() => setDragItem({ day: dayIdx, idx: actIdx })}
                          onDragOver={e => e.preventDefault()}
                          onDrop={() => {
                            if (dragItem && dragItem.day === dayIdx && dragItem.idx !== actIdx) {
                              swapActivities(dayIdx, dragItem.idx, actIdx);
                            }
                            setDragItem(null);
                          }}
                        >
                          <div className="text-lg">{activity.split(' ')[0]}</div>
                          <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">{activity.substring(activity.indexOf(' ') + 1)}</p>
                          <button
                            onClick={() => swapActivities(dayIdx, actIdx, (actIdx + 1) % dayActivities.length)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                          >
                            <RefreshCw size={12} className="text-gray-400" />
                          </button>
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
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{prefs?.destination}</p>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-6xl font-black text-gray-900 dark:text-white">{weather.temp}°</span>
                      <div>
                        <p className="text-4xl">{weather.icon}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{weather.condition}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <Droplets size={16} className="text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20">
                    <Wind size={16} className="text-cyan-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{weather.wind} km/h</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 5-day forecast */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">5-Day Forecast</h4>
                <div className="grid grid-cols-5 gap-2">
                  {weather.forecast.map((day, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${i === 0 ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{day.day}</p>
                      <span className="text-xl">{day.icon}</span>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{day.high}°</p>
                      <p className="text-xs text-gray-400">{day.low}°</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Best time to visit {prefs?.destination}: Check our destination guide for seasonal tips and pack accordingly!
                </p>
              </div>
            </div>
          )}

          {/* CURRENCY TAB */}
          {activeTab === 'currency' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe size={16} /> Currency Converter
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={currencyAmount}
                      onChange={e => setCurrencyAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">From</label>
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
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">To</label>
                      <select
                        value={currencyTo}
                        onChange={e => { setCurrencyTo(e.target.value); setCurrency(e.target.value); }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                      >
                        {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                          <option key={code} value={code}>{data.flag} {code}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border-2 text-center" style={{ borderColor: '#f97316', background: 'linear-gradient(135deg, rgba(249,115,22,0.05), rgba(236,72,153,0.05))' }}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Result</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{convertCurrency()}</p>
                    <p className="text-xs text-gray-400 mt-1">{currencyAmount} {currencyFrom} = {convertCurrency()} {currencyTo}</p>
                  </div>
                </div>
              </div>
              {/* Live rates */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Today's Rates (Base: INR)</h4>
                <div className="space-y-2">
                  {Object.entries(CURRENCY_RATES).filter(([code]) => code !== 'INR').map(([code, data]) => (
                    <div key={code} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{data.flag}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{code}</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{data.symbol}{(1 * data.rate).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🤖</div>
                    )}
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'text-white rounded-tr-none'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                      }`}
                      style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              {/* Quick prompts */}
              <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
                {['budget tips', 'visa info', 'packing list', 'weather', 'food guide'].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => { setChatInput(prompt); }}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:border-orange-400 transition-colors"
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
                <Lightbulb size={18} className="text-yellow-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Essential Travel Tips</h3>
              </div>
              {TRAVEL_TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      {activeTab === 'overview' && (
        <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-4 py-4">
          <div className="max-w-4xl mx-auto flex gap-3 items-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Cost</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{fmt(total)}</p>
            </div>
            <button onClick={handleSaveTrip} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Save
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              <ShoppingCart size={15} /> Proceed to Book
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selected === opt.id
                ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            {selected === opt.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                <Check size={10} />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{opt.icon}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{opt.name}</p>
                {opt.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{opt.rating}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {opt.features.slice(0, 2).map(f => (
                <span key={f} className="text-xs bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-600">{f}</span>
              ))}
            </div>
            <p className="text-sm font-bold text-orange-500">{opt.price}</p>
            <p className="text-xs text-gray-400">Total: {fmt(opt.rawPrice)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
