import { useState } from 'react';
import { ArrowLeft, Edit3, Camera, LogOut, Award, MapPin, Star, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, CURRENCY_RATES } from '../data/constants';

export default function ProfileScreen() {
  const { user, setUser, setScreen, trips, currency } = useApp();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'docs'>('overview');

  const fmt = (n: number) => {
    const rate = CURRENCY_RATES[currency]?.rate || 1;
    const sym = CURRENCY_RATES[currency]?.symbol || '₹';
    const converted = n * rate;
    return `${sym}${converted >= 100000 ? (converted / 100000).toFixed(1) + 'L' : converted >= 1000 ? (converted / 1000).toFixed(0) + 'K' : converted.toFixed(0)}`;
  };

  const handleSave = () => {
    if (user) {
      const updated = { ...user, name: editName, bio: editBio, phone: editPhone };
      setUser(updated);
    }
    setEditing(false);
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
  };

  const tierColors: Record<string, string> = {
    'Gold Explorer': 'from-yellow-400 to-amber-500',
    'Silver Voyager': 'from-gray-300 to-slate-400',
    'Platinum Elite': 'from-cyan-300 to-blue-400',
  };

  const tierColor = tierColors[user?.tier || 'Gold Explorer'] || 'from-yellow-400 to-amber-500';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white flex-1">My Profile</h1>
          <button onClick={() => setEditing(!editing)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Edit3 size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Cover */}
          <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
            <div className="absolute inset-0 opacity-30">
              <img src="https://images.pexels.com/photos/14974644/pexels-photo-14974644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=800" className="w-full h-full object-cover" alt="" />
            </div>
          </div>
          <div className="px-5 pb-5">
            {/* Avatar */}
            <div className="relative -mt-10 mb-3">
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {user?.name?.[0] || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            {editing ? (
              <div className="space-y-3">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  placeholder="Full Name"
                />
                <input
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  placeholder="Phone Number"
                />
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                  placeholder="Bio"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>Save</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.phone}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 italic">"{user?.bio}"</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${tierColor}`}>
                    ⭐ {user?.tier}
                  </span>
                  <span className="text-xs text-gray-400">Member since {user?.joinedDate}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: <MapPin size={16} />, label: 'Countries', value: user?.countriesVisited || 0, color: 'text-blue-500' },
            { icon: <Star size={16} />, label: 'Trips', value: user?.tripsCompleted || 0, color: 'text-orange-500' },
            { icon: <TrendingUp size={16} />, label: 'Planned', value: trips.length, color: 'text-green-500' },
            { icon: <Award size={16} />, label: 'Awards', value: ACHIEVEMENTS.filter(a => a.earned).length, color: 'text-purple-500' },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-800">
              <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
              <p className="text-xl font-black text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Total spent */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Travel Spend</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{fmt(user?.totalSpent || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg per trip</p>
              <p className="text-xl font-bold text-orange-500">{fmt((user?.totalSpent || 0) / (user?.tripsCompleted || 1))}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {(['overview', 'achievements', 'docs'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map(a => (
              <div key={a.id} className={`bg-white dark:bg-gray-900 rounded-2xl p-4 border ${a.earned ? 'border-yellow-200 dark:border-yellow-800' : 'border-gray-100 dark:border-gray-800 opacity-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{a.icon}</span>
                  {a.earned && <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">✓ Earned</span>}
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{a.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-3">
            {[
              { icon: '🛂', title: 'Passport', desc: 'Upload your passport for faster booking', status: 'Not uploaded' },
              { icon: '🪪', title: 'Aadhaar Card', desc: 'Government ID for domestic travel', status: 'Not uploaded' },
              { icon: '🏥', title: 'Travel Insurance', desc: 'Proof of insurance for international travel', status: 'Not uploaded' },
              { icon: '💉', title: 'Vaccination Certificate', desc: 'COVID & other vaccination records', status: 'Not uploaded' },
            ].map(doc => (
              <div key={doc.title} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <span className="text-2xl">{doc.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{doc.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{doc.desc}</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  Upload
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-3">
            {[
              { icon: '✈️', label: 'Travel Preferences', value: 'Window seat, Vegetarian meals' },
              { icon: '💳', label: 'Preferred Payment', value: 'Visa card ending 4242' },
              { icon: '📍', label: 'Home City', value: 'New Delhi, India' },
              { icon: '🗣️', label: 'Languages', value: 'English, Hindi' },
              { icon: '🌐', label: 'Nationality', value: 'Indian' },
            ].map(item => (
              <div key={item.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</p>
                </div>
                <Edit3 size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
