import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRAVEL_FACTS } from '../data/constants';

export default function SplashScreen() {
  const { setScreen, user } = useApp();
  const [fact, setFact] = useState(TRAVEL_FACTS[0]);
  const [, setFactIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'fact' | 'done'>('logo');

  useEffect(() => {
    const phases: { delay: number; action: () => void }[] = [
      { delay: 400, action: () => setPhase('tagline') },
      { delay: 1200, action: () => setPhase('fact') },
      { delay: 3200, action: () => setPhase('done') },
    ];
    const timers = phases.map(p => setTimeout(p.action, p.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100));
    }, 55);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(i => {
        const next = (i + 1) % TRAVEL_FACTS.length;
        setFact(TRAVEL_FACTS[next]);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      setTimeout(() => {
        setScreen(user ? 'dashboard' : 'login');
      }, 500);
    }
  }, [phase, user, setScreen]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-pulse"
            style={{
              width: `${Math.random() * 120 + 20}px`,
              height: `${Math.random() * 120 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#f97316', '#ec4899', '#8b5cf6', '#06b6d4'][i % 4],
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Globe animation */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div
          className="relative"
          style={{
            opacity: phase === 'logo' ? 0 : 1,
            transform: phase === 'logo' ? 'scale(0.5) translateY(20px)' : 'scale(1) translateY(0)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Logo glow */}
          <div className="absolute inset-0 rounded-3xl blur-2xl opacity-50"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }} />
          <div className="relative w-28 h-28 rounded-3xl flex items-center justify-center text-6xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>
            🌍
          </div>

          {/* Orbit ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-orange-400/30"
            style={{ animation: 'spin 4s linear infinite' }} />
          <div className="absolute -inset-3 rounded-3xl border border-pink-400/20"
            style={{ animation: 'spin 6s linear infinite reverse' }} />
        </div>

        {/* Brand name */}
        <div
          style={{
            opacity: phase === 'logo' ? 0 : 1,
            transform: phase === 'logo' ? 'translateY(10px)' : 'translateY(0)',
            transition: 'all 0.8s ease 0.3s',
          }}
        >
          <h1 className="text-6xl font-black tracking-tight text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span className="text-white">Trip</span>
            <span style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Forge</span>
          </h1>
          <p className={`text-center text-purple-200/70 mt-1 text-lg font-light tracking-widest transition-all duration-700 ${phase !== 'logo' ? 'opacity-100' : 'opacity-0'}`}>
            FORGE YOUR PERFECT JOURNEY
          </p>
        </div>

        {/* Fact card */}
        <div
          className="max-w-sm mx-auto px-8 text-center"
          style={{
            opacity: phase === 'fact' ? 1 : 0,
            transform: phase === 'fact' ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.6s ease',
          }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
            <p className="text-xs text-purple-300 font-semibold uppercase tracking-widest mb-2">Did you know?</p>
            <p className="text-white/90 text-sm leading-relaxed transition-all duration-500">{fact}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f97316, #ec4899)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-purple-300/60">Loading experience...</span>
            <span className="text-xs text-purple-300/60">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-8 text-center">
        <p className="text-purple-400/40 text-xs tracking-widest uppercase">The World Awaits You ✈️</p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
