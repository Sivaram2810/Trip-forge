import { useState } from 'react';
import type { ReactNode } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_USER } from '../data/constants';

export default function LoginScreen() {
  const { setScreen, setUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@tripforge.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please fill all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      setUser(DEMO_USER);
      setScreen('dashboard');
    } else {
      setError('Invalid credentials. Try demo@tripforge.com / demo123');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password || !phone) { setError('Please fill all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setUser({ ...DEMO_USER, name, email, phone });
    setScreen('dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=700"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,12,41,0.85), rgba(48,43,99,0.75))' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🌍</div>
            <span className="text-white text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif' }}>TripForge</span>
          </div>
          <div>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Your Next<br />
              <span style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Adventure
              </span><br />
              Awaits
            </h2>
            <p className="text-purple-200/70 text-lg leading-relaxed">
              Plan, book, and forge your perfect journey with AI-powered travel intelligence.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[['195', 'Countries'], ['50K+', 'Happy Travellers'], ['₹0', 'Booking Fee']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <p className="text-white text-2xl font-bold">{num}</p>
                  <p className="text-purple-300/60 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-1 rounded-full flex-1 ${i === 0 ? '' : 'opacity-30'}`}
                style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🌍</div>
            <span className="text-gray-900 text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif' }}>TripForge</span>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            {/* Tab switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-8">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    mode === m
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {mode === 'login' ? 'Welcome back! 👋' : 'Join TripForge 🌍'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account and start exploring'}
            </p>

            {/* Demo hint */}
            {mode === 'login' && (
              <div className="mb-4 p-3 rounded-xl border text-xs"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.05), rgba(236,72,153,0.05))', borderColor: 'rgba(249,115,22,0.2)' }}>
                <span className="font-semibold text-orange-600 dark:text-orange-400">Demo credentials:</span>
                <span className="text-gray-600 dark:text-gray-400"> demo@tripforge.com / demo123</span>
              </div>
            )}

            <div className="space-y-4">
              {mode === 'register' && (
                <InputField icon={<User size={16} />} placeholder="Full Name" value={name} onChange={setName} />
              )}
              <InputField icon={<Mail size={16} />} placeholder="Email Address" value={email} onChange={setEmail} type="email" />
              {mode === 'register' && (
                <InputField icon={<Phone size={16} />} placeholder="Phone Number" value={phone} onChange={setPhone} type="tel" />
              )}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></div>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              onClick={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-70 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Processing...</>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
              )}
            </button>

            {mode === 'login' && (
              <button className="w-full mt-3 text-xs text-center text-orange-500 dark:text-orange-400 hover:underline">
                Forgot password?
              </button>
            )}

            {/* Social login */}
            <div className="mt-6">
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                <span className="px-4 text-xs text-gray-400">or continue with</span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[{ emoji: '🔵', name: 'Google' }, { emoji: '📘', name: 'Facebook' }].map(({ emoji, name }) => (
                  <button
                    key={name}
                    onClick={handleLogin}
                    className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span>{emoji}</span> {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to TripForge's{' '}
            <span className="text-orange-500 hover:underline cursor-pointer">Terms of Service</span> &{' '}
            <span className="text-orange-500 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, value, onChange, type = 'text' }: {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
      />
    </div>
  );
}
