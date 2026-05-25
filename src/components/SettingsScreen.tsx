import type { ReactNode } from 'react';
import { ArrowLeft, Moon, Sun, Bell, Globe, Shield, Trash2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCY_RATES } from '../data/constants';

export default function SettingsScreen() {
  const { setScreen, darkMode, setDarkMode, notifications, setNotifications, currency, setCurrency } = useApp();

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? '' : 'bg-gray-200 dark:bg-gray-700'}`}
      style={value ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : {}}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Appearance */}
        <SettingsSection title="Appearance">
          <SettingsRow
            icon={darkMode ? <Moon size={18} className="text-indigo-500" /> : <Sun size={18} className="text-yellow-500" />}
            label="Dark Mode"
            sub="Switch between light and dark theme"
            right={<ToggleSwitch value={darkMode} onChange={setDarkMode} />}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsRow
            icon={<Bell size={18} className="text-orange-500" />}
            label="Push Notifications"
            sub="Get updates about your trips"
            right={<ToggleSwitch value={notifications} onChange={setNotifications} />}
          />
          <SettingsRow
            icon={<Bell size={18} className="text-pink-500" />}
            label="Email Alerts"
            sub="Booking confirmations and offers"
            right={<ToggleSwitch value={true} onChange={() => {}} />}
          />
          <SettingsRow
            icon={<Bell size={18} className="text-green-500" />}
            label="Deal Notifications"
            sub="Flash sales and limited offers"
            right={<ToggleSwitch value={notifications} onChange={setNotifications} />}
          />
        </SettingsSection>

        {/* Language & Currency */}
        <SettingsSection title="Localisation">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Globe size={18} className="text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Display Currency</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred currency</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-semibold transition-all ${
                    currency === code
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <span>{data.flag}</span>
                  <span>{code}</span>
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection title="Privacy & Security">
          <SettingsRow
            icon={<Shield size={18} className="text-green-500" />}
            label="Two-Factor Authentication"
            sub="Add an extra layer of security"
            right={<ChevronRight size={16} className="text-gray-400" />}
          />
          <SettingsRow
            icon={<Shield size={18} className="text-blue-500" />}
            label="Privacy Settings"
            sub="Manage your data and privacy"
            right={<ChevronRight size={16} className="text-gray-400" />}
          />
          <SettingsRow
            icon={<Shield size={18} className="text-purple-500" />}
            label="Download My Data"
            sub="Export all your TripForge data"
            right={<ChevronRight size={16} className="text-gray-400" />}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingsRow
            icon={<span className="text-lg">📱</span>}
            label="App Version"
            sub="v2.4.1 (Build 2401)"
            right={<span className="text-xs text-green-500 font-semibold">Up to date</span>}
          />
          <SettingsRow
            icon={<span className="text-lg">📜</span>}
            label="Terms of Service"
            sub="Read our terms and conditions"
            right={<ChevronRight size={16} className="text-gray-400" />}
          />
          <SettingsRow
            icon={<span className="text-lg">🔒</span>}
            label="Privacy Policy"
            sub="How we handle your data"
            right={<ChevronRight size={16} className="text-gray-400" />}
          />
          <SettingsRow
            icon={<span className="text-lg">⭐</span>}
            label="Rate TripForge"
            sub="Share your experience"
            right={<ChevronRight size={16} className="text-gray-400" />}
          />
        </SettingsSection>

        {/* Danger zone */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800 overflow-hidden">
          <p className="px-4 py-2 text-xs font-bold text-red-500 uppercase tracking-widest border-b border-red-100 dark:border-red-800">Danger Zone</p>
          <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 size={18} className="text-red-500" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Delete Account</p>
              <p className="text-xs text-red-500/70 dark:text-red-400/70">Permanently remove all your data</p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">TripForge © 2025 • Made with ❤️ for travellers</p>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">{title}</p>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">{children}</div>
    </div>
  );
}

function SettingsRow({ icon, label, sub, right }: { icon: ReactNode; label: string; sub: string; right: ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
      </div>
      {right}
    </div>
  );
}
