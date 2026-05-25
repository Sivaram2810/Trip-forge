import { useState } from 'react';
import { ArrowLeft, Edit2, Save, X, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS } from '../data/constants';

function fmt(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function ProfileScreen() {
  const { user, setUser, setScreen, trips } = useApp();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editBio, setEditBio] = useState(user?.bio || '');

  if (!user) { setScreen('login'); return null; }

  // True stats from actual bookings
  const bookedTrips = trips.filter(t => t.status === 'booked' || t.status === 'completed');
  const completedTrips = trips.filter(t => t.status === 'completed');
  const totalSpent = bookedTrips.reduce((sum, t) => sum + t.totalCost, 0);
  const uniqueDestinations = new Set(trips.map(t => t.preferences.destination)).size;

  const handleSave = () => {
    if (!editName.trim()) return;
    const updated = {
      ...user,
      name: editName.trim(),
      phone: editPhone.trim(),
      bio: editBio.trim(),
    };
    setUser(updated);
    // Update in localStorage users array
    const stored = localStorage.getItem('tf_users');
    if (stored) {
      const users = JSON.parse(stored);
      const updatedUsers = users.map((u: any) => u.id === user.id ? { ...u, ...updated, password: u.password } : u);
      localStorage.setItem('tf_users', JSON.stringify(updatedUsers));
    }
    setEditing(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tf_user');
    setScreen('login');
  };

  const tierColors: Record<string, string> = {
    'Explorer': 'from-slate-400 to-slate-600',
    'Gold Explorer': 'from-yellow-400 to-amber-600',
    'Platinum Voyager': 'from-indigo-400 to-purple-600',
    'Elite Nomad': 'from-pink-400 to-rose-600',
  };
  const tierColor = tierColors[user.tier] || tierColors['Explorer'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="font-bold text-gray-900 dark:text-white">My Profile</h1>
          </div>
          <button
            onClick={() => { if (editing) handleSave(); else setEditing(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: editing ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #f97316, #ec4899)', color: 'white' }}
          >
            {editing ? <><Save size={12} /> Save</> : <><Edit2 size={12} /> Edit</>}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="h-24" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }} />
          <div className="px-5 pb-5">
            <div className="-mt-10 flex items-end justify-between mb-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-900 flex items-center justify-center text-3xl font-black text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                {user.name?.[0] || 'U'}
              </div>
              <div className={`px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${tierColor}`}>
                {user.tier}
              </div>
            </div>

            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Phone Number</label>
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50" placeholder="+91 xxxxx xxxxx" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Travel Bio</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 resize-none" />
                </div>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500">
                  <X size={12} /> Cancel
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{user.email}</p>
                {user.phone && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">📞 {user.phone}</p>}
                {user.bio && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">"{user.bio}"</p>}
                <p className="text-xs text-gray-400 mt-2">🗓 Member since {user.joinedDate}</p>
              </>
            )}
          </div>
        </div>

        {/* TRUE Stats — bound to actual bookings */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Trips Booked', value: bookedTrips.length, icon: '✈️', note: 'confirmed' },
            { label: 'Completed', value: completedTrips.length, icon: '🏁', note: 'travelled' },
            { label: 'Destinations', value: uniqueDestinations, icon: '🌍', note: 'unique' },
            { label: 'Total Spent', value: fmt(totalSpent), icon: '💰', note: 'invested' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-xs text-green-500">{stat.note}</p>
            </div>
          ))}
        </div>

        {/* Travel Preferences */}
        {user.travelPreferences && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="font-bold text-gray-900 dark:text-white mb-3">🎯 Travel Preferences</p>
            <div className="space-y-3">
              {user.travelPreferences.tripTypes.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Trip Styles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.travelPreferences.tripTypes.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full text-white font-semibold" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {user.travelPreferences.interests.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.travelPreferences.interests.map(i => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setScreen('onboarding')}
                className="text-xs text-orange-500 font-semibold hover:text-orange-600"
              >
                ✏️ Update Preferences
              </button>
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-orange-500" />
            <p className="font-bold text-gray-900 dark:text-white">Achievements</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ACHIEVEMENTS.map(a => (
              <div key={a.id} className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center ${
                a.earned
                  ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 opacity-40'
              }`}>
                <span className="text-2xl">{a.icon}</span>
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{a.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {[
            { icon: '⚙️', label: 'Settings', action: () => setScreen('settings') },
            { icon: '🎁', label: 'Rewards & Points', action: () => setScreen('rewards') },
            { icon: '📞', label: 'Help & Support', action: () => setScreen('support') },
            { icon: '🔒', label: 'Privacy & Security', action: () => {} },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <span className="text-xl">{icon}</span>
              <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          🚪 Sign Out
        </button>

        <p className="text-center text-xs text-gray-400">TripForge v2.5.0 • Made with ❤️ for travellers</p>
      </div>
    </div>
  );
}
