import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Screen, User, TripPreferences, TripPlan, WishlistItem } from '../types';

interface AppContextType {
  screen: Screen;
  setScreen: (s: Screen) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  currentPrefs: TripPreferences | null;
  setCurrentPrefs: (p: TripPreferences | null) => void;
  currentPlan: TripPlan | null;
  setCurrentPlan: (p: TripPlan | null) => void;
  selectedTrip: TripPlan | null;
  setSelectedTrip: (t: TripPlan | null) => void;
  trips: TripPlan[];
  addTrip: (t: TripPlan) => void;
  updateTripStatus: (id: string, status: TripPlan['status']) => void;
  wishlist: WishlistItem[];
  toggleWishlist: (destId: string, destName: string) => void;
  isWishlisted: (destId: string) => boolean;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
  currency: string;
  setCurrency: (v: string) => void;
  dashboardSearch: string;
  setDashboardSearch: (v: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUserState] = useState<User | null>(loadFromStorage('tf_user', null));
  const [currentPrefs, setCurrentPrefs] = useState<TripPreferences | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
  const [trips, setTrips] = useState<TripPlan[]>(loadFromStorage('tf_trips', []));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(loadFromStorage('tf_wishlist', []));
  const [darkMode, setDarkModeState] = useState<boolean>(loadFromStorage('tf_dark', false));
  const [notifications, setNotificationsState] = useState<boolean>(loadFromStorage('tf_notif', true));
  const [currency, setCurrencyState] = useState<string>(loadFromStorage('tf_currency', 'INR'));
  const [dashboardSearch, setDashboardSearch] = useState('');

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem('tf_user', JSON.stringify(u));
    else localStorage.removeItem('tf_user');
  };

  const addTrip = (t: TripPlan) => {
    const updated = [t, ...trips];
    setTrips(updated);
    localStorage.setItem('tf_trips', JSON.stringify(updated));
  };

  const updateTripStatus = (id: string, status: TripPlan['status']) => {
    const updated = trips.map(t => t.id === id ? { ...t, status } : t);
    setTrips(updated);
    localStorage.setItem('tf_trips', JSON.stringify(updated));
  };

  const toggleWishlist = (destId: string, destName: string) => {
    let updated: WishlistItem[];
    if (wishlist.find(w => w.destinationId === destId)) {
      updated = wishlist.filter(w => w.destinationId !== destId);
    } else {
      updated = [...wishlist, {
        id: `w_${Date.now()}`,
        destinationId: destId,
        destinationName: destName,
        addedAt: new Date().toISOString(),
        adults: 2,
        children: 0,
        preferredTripType: 'leisure',
      }];
    }
    setWishlist(updated);
    localStorage.setItem('tf_wishlist', JSON.stringify(updated));
  };

  const isWishlisted = (destId: string) => wishlist.some(w => w.destinationId === destId);

  const updateWishlistItem = (id: string, updates: Partial<WishlistItem>) => {
    const updated = wishlist.map(w => w.id === id ? { ...w, ...updates } : w);
    setWishlist(updated);
    localStorage.setItem('tf_wishlist', JSON.stringify(updated));
  };

  const setDarkMode = (v: boolean) => {
    setDarkModeState(v);
    localStorage.setItem('tf_dark', JSON.stringify(v));
  };

  const setNotifications = (v: boolean) => {
    setNotificationsState(v);
    localStorage.setItem('tf_notif', JSON.stringify(v));
  };

  const setCurrency = (v: string) => {
    setCurrencyState(v);
    localStorage.setItem('tf_currency', JSON.stringify(v));
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <AppContext.Provider value={{
      screen, setScreen,
      user, setUser,
      currentPrefs, setCurrentPrefs,
      currentPlan, setCurrentPlan,
      selectedTrip, setSelectedTrip,
      trips, addTrip, updateTripStatus,
      wishlist, toggleWishlist, isWishlisted, updateWishlistItem,
      darkMode, setDarkMode,
      notifications, setNotifications,
      currency, setCurrency,
      dashboardSearch, setDashboardSearch,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
