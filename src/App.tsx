import { AppProvider, useApp } from './context/AppContext';
import ScreenTransition from './components/ScreenTransition';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import PreferencesScreen from './components/PreferencesScreen';
import LoadingScreen from './components/LoadingScreen';
import PlanScreen from './components/PlanScreen';
import PaymentScreen from './components/PaymentScreen';
import ProfileScreen from './components/ProfileScreen';
import WishlistScreen from './components/WishlistScreen';
import SupportScreen from './components/SupportScreen';
import SettingsScreen from './components/SettingsScreen';

function AppRouter() {
  const { screen } = useApp();

  const content = (() => {
    switch (screen) {
      case 'splash':        return <SplashScreen />;
      case 'login':         return <LoginScreen />;
      case 'dashboard':     return <Dashboard />;
      case 'preferences':   return <PreferencesScreen />;
      case 'loading':       return <LoadingScreen />;
      case 'plan':          return <PlanScreen />;
      case 'payment':       return <PaymentScreen />;
      case 'confirmation':  return <PaymentScreen />;
      case 'profile':       return <ProfileScreen />;
      case 'wishlist':      return <WishlistScreen />;
      case 'support':       return <SupportScreen />;
      case 'settings':      return <SettingsScreen />;
      default:              return <Dashboard />;
    }
  })();

  // Screens that don't need transition (handle their own animations)
  const noTransitionScreens = ['splash', 'loading'];

  if (noTransitionScreens.includes(screen)) {
    return content;
  }

  return (
    <ScreenTransition screenKey={screen}>
      {content}
    </ScreenTransition>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
