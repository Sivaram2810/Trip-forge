export type Screen =
  | 'splash'
  | 'login'
  | 'dashboard'
  | 'preferences'
  | 'loading'
  | 'plan'
  | 'payment'
  | 'confirmation'
  | 'profile'
  | 'wishlist'
  | 'support'
  | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: string;
  joinedDate: string;
  tripsCompleted: number;
  countriesVisited: number;
  totalSpent: number;
  phone: string;
  bio: string;
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
  interests: string[];
  priority: 'budget' | 'comfort' | 'experience';
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
}
