import { Turf, StatsItem } from './types';

export const PREMIUM_TURF: Turf = {
  id: 'lord', // Map to standard TurfId to avoid breaking core types
  name: "Runmakers Arena Box Cricket",
  location: "Infront of Omfed Plant, Railway Station Rd, Chowk, Bankobija, Jeypore, Odisha 764002",
  mapsUrl: "https://www.google.com/maps/place/Runmakers+Arena+Box+Cricket/data=!4m2!3m1!1s0x0:0x453d498e3c55270?sa=X&ved=1t:2428&hl=en-IN&ictx=111",
  rating: 5.0,
  reviewsCount: 21,
  specs: {
    pitchType: "Premium Cushioned Synthetic AstroTurf Matting",
    size: "120ft x 70ft (Standard Championship Box)",
    capacity: "Up to 14 players (6v6 / 7v7 matches)",
    lighting: "Professional Zero-Shadow High-Lux LED Rig"
  },
  amenities: [
    "Retractable Rain & Sun Protective Canopy",
    "Smart Multi-Angle Action Cameras",
    "Cricket Training Bowling Machine",
    "Cozy Team Dugout & Sports Refreshments"
  ],
  basePricePerHour: 1000,
  imageUrl: "https://images.unsplash.com/photo-1540747737956-37872404459a?auto=format&fit=crop&q=80&w=800",
  tagline: "Sports club in Jeypore, Odisha. Built for ultimate performance, consistent bounce, and premium stadium floodlighting active daily from 6:00 AM to 11:00 PM."
};

export const STATS: StatsItem[] = [
  {
    value: "5.0 / 5.0",
    label: "Google Rating",
    description: "Highly rated premier box arena with 100% positive player sentiment.",
    trend: "21 Verified Reviews"
  },
  {
    value: "6am - 11pm",
    label: "Operating Hours",
    description: "Available seven days a week, with night sessions illuminated by pro LEDs.",
    trend: "Open Daily"
  },
  {
    value: "100%",
    label: "All-Weather Ready",
    description: "Equipped with state-of-the-art overhead cover for absolute uninterrupted fun.",
    trend: "Rain-or-Shine"
  },
  {
    value: "Jeypore, OD",
    label: "Arena Location",
    description: "Conveniently situated right in front of the Omfed Plant on Railway Station Road.",
    trend: "Easy Access"
  }
];
