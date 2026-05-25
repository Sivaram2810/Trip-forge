import { useState, type ReactNode } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User as UserType } from '../types';

export default function LoginScreen() {
  const { setScreen, setUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => /^[\+]?[0-9\s\-]{8,15}$/.test(p.trim());

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    // Load stored users
    const stored = localStorage.getItem('tf_users');
    const users: (UserType & { password: string })[] = stored ? JSON.parse(stored) : [];
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);

    if (!found) {
      setLoading(false);
      setError('Invalid email or password. Please try again.');
      return;
    }

    const { password: _pw, ...userWithoutPw } = found;
    setUser(userWithoutPw as UserType);
    setLoading(false);

    if (!userWithoutPw.onboardingComplete) {
      setScreen('onboarding');
    } else {
      setScreen('dashboard');
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (phone && !validatePhone(phone)) { setError('Please enter a valid phone number.'); return; }
    if (!password) { setError('Please create a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    // Check if email already exists
    const stored = localStorage.getItem('tf_users');
    const users: (UserType & { password: string })[] = stored ? JSON.parse(stored) : [];
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      setLoading(false);
      setError('An account with this email already exists. Please login.');
      return;
    }

    const newUser: UserType = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: '🧳',
      tier: 'Explorer',
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      phone: phone.trim(),
      bio: 'Travel enthusiast ready to explore the world!',
      onboardingComplete: false,
    };

    const allUsers = [...users, { ...newUser, password }];
    localStorage.setItem('tf_users', JSON.stringify(allUsers));

    setUser(newUser);
    setLoading(false);
    setScreen('onboarding');
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left panel - desktop */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10 animate-pulse"
              style={{
                width: `${(i * 47 % 100) + 30}px`,
                height: `${(i * 47 % 100) + 30}px`,
                left: `${(i * 19) % 90}%`,
                top: `${(i * 23) % 90}%`,
                background: ['#f97316', '#ec4899', '#8b5cf6', '#06b6d4'][i % 4],
                animationDelay: `${(i * 0.4) % 3}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🌍</div>
            <h1 className="text-5xl font-black text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Trip<span style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Forge</span>
            </h1>
            <p className="text-purple-200/70 text-lg font-light tracking-widest">FORGE YOUR PERFECT JOURNEY</p>
          </div>
          <div className="space-y-6 mb-10">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Your Next<br />
              <span style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Adventure</span><br />
              Awaits
            </h2>
            <p className="text-purple-200/70 text-base leading-relaxed max-w-sm">
              Plan, book, and forge your perfect journey with AI-powered travel intelligence.
            </p>
          </div>
          <div className="flex gap-6">
            {[['195+', 'Countries'], ['50K+', 'Happy Travellers'], ['₹0', 'Booking Fee']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{num}</p>
                <p className="text-purple-300/60 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 bg-white dark:bg-gray-950 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}>🌍</div>
          <span className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>TripForge</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {mode === 'login' ? 'Welcome back! 👋' : 'Join TripForge 🌍'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account and start exploring'}
          </p>

          <div className="space-y-3">
            {mode === 'register' && (
              <InputField icon={<User size={16} className="text-gray-400" />} placeholder="Full Name" value={name} onChange={setName} />
            )}
            <InputField icon={<Mail size={16} className="text-gray-400" />} placeholder="Email Address" value={email} onChange={setEmail} type="email" />
            {mode === 'register' && (
              <InputField icon={<Phone size={16} className="text-gray-400" />} placeholder="Phone Number (optional)" value={phone} onChange={setPhone} type="tel" />
            )}
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              <button
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
            </div>
          )}

          <button
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In →' : 'Create Account →'
            )}
          </button>

          {mode === 'login' && (
            <button className="w-full mt-2 text-center text-xs text-orange-500 hover:text-orange-600 font-medium py-1">
              Forgot password?
            </button>
          )}

          <div className="mt-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{ emoji: '🔵', name: 'Google' }, { emoji: '📘', name: 'Facebook' }].map(({ emoji, name }) => (
                <button
                  key={name}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>{emoji}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            By continuing, you agree to TripForge's{' '}
            <span className="text-orange-500 cursor-pointer">Terms of Service</span> &{' '}
            <span className="text-orange-500 cursor-pointer">Privacy Policy</span>
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
      <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>
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
