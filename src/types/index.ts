export type Screen =
  | 'splash'
  | 'login'
  | 'onboarding'
  | 'dashboard'
  | 'preferences'
  | 'loading'
  | 'plan'
  | 'payment'
  | 'confirmation'
  | 'profile'
  | 'wishlist'
  | 'support'
  | 'settings'
  | 'rewards'
  | 'trip-detail';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: string;
  joinedDate: string;
  phone: string;
  bio: string;
  onboardingComplete: boolean;
  travelPreferences?: OnboardingPreferences;
}

export interface OnboardingPreferences {
  tripTypes: string[];
  interests: string[];
  budgetRange: string;
  preferredDestinations: string[];
}

export interface PassengerDetail {
  name: string;
  age: string;
  gender: string;
  type: 'adult' | 'child';
}

export interface TripPreferences {
  from: string;
  destination: string;
  destinationId: string;
  budget: number;
  duration: number;
  tripType: string;
  date: string;
  travellers: number;
  adults: number;
  children: number;
  interests: string[];
  priority: 'budget' | 'comfort' | 'experience';
  passengers?: PassengerDetail[];
}

export interface TripPlan {
  id: string;
  preferences: TripPreferences;
  flight: string;
  hotel: string;
  guide: string;
  cab: string;
  itinerary: string[][];
  totalCost: number;
  createdAt: string;
  status: 'planning' | 'booked' | 'completed';
  bookingRef?: string;
}

export interface BookingDetails {
  tripId: string;
  paymentMethod: 'card' | 'upi' | 'emi';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
  emiMonths?: number;
  totalAmount: number;
  transactionId?: string;
}

export interface WishlistItem {
  id: string;
  destinationId: string;
  destinationName: string;
  addedAt: string;
  preferredTripType?: string;
  adults?: number;
  children?: number;
}
