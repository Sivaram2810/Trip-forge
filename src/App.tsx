import { AppProvider, useApp } from './context/AppContext';
import ScreenTransition from './components/ScreenTransition';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import OnboardingScreen from './components/OnboardingScreen';
import Dashboard from './components/Dashboard';
import PreferencesScreen from './components/PreferencesScreen';
import LoadingScreen from './components/LoadingScreen';
import PlanScreen from './components/PlanScreen';
import PaymentScreen from './components/PaymentScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import ProfileScreen from './components/ProfileScreen';
import WishlistScreen from './components/WishlistScreen';
import SupportScreen from './components/SupportScreen';
import SettingsScreen from './components/SettingsScreen';
import RewardsScreen from './components/RewardsScreen';
import TripDetailScreen from './components/TripDetailScreen';

function AppRouter() {
  const { screen } = useApp();

  const noTransitionScreens = ['splash', 'loading'];

  const content = (() => {
    switch (screen) {
      case 'splash': return <SplashScreen />;
      case 'login': return <LoginScreen />;
      case 'onboarding': return <OnboardingScreen />;
      case 'dashboard': return <Dashboard />;
      case 'preferences': return <PreferencesScreen />;
      case 'loading': return <LoadingScreen />;
      case 'plan': return <PlanScreen />;
      case 'payment': return <PaymentScreen />;
      case 'confirmation': return <ConfirmationScreen />;
      case 'profile': return <ProfileScreen />;
      case 'wishlist': return <WishlistScreen />;
      case 'support': return <SupportScreen />;
      case 'settings': return <SettingsScreen />;
      case 'rewards': return <RewardsScreen />;
      case 'trip-detail': return <TripDetailScreen />;
      default: return <Dashboard />;
    }
  })();

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
