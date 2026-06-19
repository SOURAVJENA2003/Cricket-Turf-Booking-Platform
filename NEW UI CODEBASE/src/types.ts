export type TurfId = 'lord' | 'wankhede' | 'eden' | 'melbourne';

export interface Turf {
  id: TurfId;
  name: string;
  location: string;
  mapsUrl?: string;
  rating: number;
  reviewsCount: number;
  specs: {
    pitchType: string;
    size: string;
    capacity: string;
    lighting: string;
  };
  amenities: string[];
  basePricePerHour: number;
  imageUrl: string;
  tagline: string;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g. "18:00 - 19:00"
  isPeak: boolean;
  status: 'available' | 'booked' | 'selected';
}

export interface BookingState {
  turfId: TurfId;
  date: string; // YYYY-MM-DD
  selectedSlots: string[]; // TimeSlot ids
  addons: {
    gearKit: boolean; // Includes bats, pads, helmets
    matchUmpire: boolean; // Standard level 1 umpire
    recording: boolean; // 4K action cameras automated recording
    beverageBundle: boolean; // Hydration packs
  };
}

export interface StatsItem {
  value: string;
  label: string;
  description: string;
  trend: string;
}
