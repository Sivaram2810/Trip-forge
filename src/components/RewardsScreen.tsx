import { useState } from 'react';
import { ArrowLeft, Gift, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REWARDS_DATA } from '../data/constants';

export default function RewardsScreen() {
  const { setScreen, trips } = useApp();
  const [activeTab, setActiveTab] = useState<'points' | 'rewards' | 'history'>('points');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);

  const data = REWARDS_DATA;
  const progressPct = Math.min(100, (data.points / (data.points + data.pointsToNext)) * 100);

  // Earn points from actual bookings
  const earnedFromBookings = trips.filter(t => t.status === 'booked' || t.status === 'completed')
    .reduce((sum, t) => sum + Math.round(t.totalCost / 100), 0);
  const totalPoints = data.points + earnedFromBookings;

  const handleRedeem = (rewardId: string, cost: number) => {
    if (totalPoints < cost) return;
    setRedeemingId(rewardId);
    setTimeout(() => {
      setRedeemedIds(prev => [...prev, rewardId]);
      setRedeemingId(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gift size={18} className="text-orange-500" />
            Rewards & Points
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Points Card */}
        <div className="rounded-2xl p-5 text-white overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
          <div className="absolute top-0 right-0 text-8xl opacity-5">🌍</div>
          <div className="relative z-10">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Total Points Balance</p>
            <p className="text-5xl font-black mb-1"
              style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {totalPoints.toLocaleString()}
            </p>
            <p className="text-white/60 text-sm mb-4">TripForge Reward Points</p>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs text-white/60">
                <span>{data.tier}</span>
                <span>{data.nextTier}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #f97316, #ec4899)' }} />
              </div>
              <p className="text-xs text-white/50">{data.pointsToNext} more points to {data.nextTier}</p>
            </div>

            <div className="flex gap-3">
              {[
                { icon: '✈️', label: 'Earn per trip', val: '~1000 pts' },
                { icon: '👥', label: 'Per referral', val: '500 pts' },
                { icon: '⭐', label: 'Per review', val: '50 pts' },
              ].map(item => (
                <div key={item.label} className="flex-1 bg-white/10 rounded-xl p-2 text-center">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-xs text-white/50">{item.label}</p>
                  <p className="text-xs font-bold text-white">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {(['points', 'rewards', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                activeTab === t ? 'text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
              style={activeTab === t ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
            >
              {t === 'points' ? '⭐ Earn' : t === 'rewards' ? '🎁 Redeem' : '📋 History'}
            </button>
          ))}
        </div>

        {/* Earn Points */}
        {activeTab === 'points' && (
          <div className="space-y-3">
            <p className="font-bold text-gray-900 dark:text-white">How to earn points</p>
            {[
              { icon: '✈️', title: 'Book a Trip', desc: 'Earn 1 point per ₹100 spent on bookings', pts: '~1000 pts' },
              { icon: '👥', title: 'Refer a Friend', desc: 'They sign up, you both get bonus points', pts: '500 pts' },
              { icon: '⭐', title: 'Write a Review', desc: 'Share your experience after a trip', pts: '50 pts' },
              { icon: '📱', title: 'App Daily Check-in', desc: 'Open the app every day', pts: '10 pts/day' },
              { icon: '🎂', title: 'Birthday Bonus', desc: 'Special points on your birthday', pts: '200 pts' },
              { icon: '📸', title: 'Share Travel Photo', desc: 'Post a trip photo on social media', pts: '25 pts' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <span className="text-xs font-black text-orange-600 dark:text-orange-400">{item.pts}</span>
              </div>
            ))}
          </div>
        )}

        {/* Redeem Rewards */}
        {activeTab === 'rewards' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Redeem Points</p>
              <span className="text-sm font-black text-orange-600 dark:text-orange-400">Balance: {totalPoints.toLocaleString()} pts</span>
            </div>
            {data.rewards.map(reward => {
              const isRedeemed = redeemedIds.includes(reward.id);
              const isRedeeming = redeemingId === reward.id;
              const canAfford = totalPoints >= reward.points;
              return (
                <div key={reward.id} className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 ${isRedeemed ? 'opacity-50' : ''}`}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-orange-50 dark:bg-orange-900/20">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{reward.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">{reward.category}</span>
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                        <Star size={10} className="inline" /> {reward.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => !isRedeemed && handleRedeem(reward.id, reward.points)}
                    disabled={isRedeemed || isRedeeming || !canAfford}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isRedeemed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      !canAfford ? 'bg-gray-100 text-gray-400 dark:bg-gray-800' :
                      'text-white hover:opacity-90'
                    }`}
                    style={!isRedeemed && canAfford ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
                  >
                    {isRedeeming ? '...' : isRedeemed ? '✅ Done' : !canAfford ? 'Need pts' : 'Redeem'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <p className="font-bold text-gray-900 dark:text-white">Points History</p>
            {data.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  activity.type === 'earned' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {activity.type === 'earned' ? '⬆️' : '⬇️'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{activity.desc}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                </div>
                <span className={`text-sm font-black ${activity.type === 'earned' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {activity.type === 'earned' ? '+' : ''}{activity.points}
                </span>
              </div>
            ))}

            {/* Trips-based history */}
            {trips.filter(t => t.status === 'booked' || t.status === 'completed').map(trip => (
              <div key={trip.id} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-green-100 dark:bg-green-900/30">⬆️</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{trip.preferences.destination} trip</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Booked trip</p>
                </div>
                <span className="text-sm font-black text-green-600 dark:text-green-400">+{Math.round(trip.totalCost / 100)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
