export type Provider = {
  id: string;
  name: string;
  isActive: boolean;
  apiKey?: string;
  apiSecret?: string;
  baseUrl: string;
  token?: string;
  expiresIn?: number;
  type: 'amadeus' | 'sabre' | 'travelport' | 'custom';
}

export interface ProviderTokens {
  [providerId: string]: {
      token: string;
      expiresAt: number;
  };
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
  departureDate: string;
  returnDate?: string;
  providerIds?: Array<string>;
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  duration: string;
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
    name?: string;
  };
  operating?: {
    carrierCode: string;
    number?: string;
  };
  stops?: Array<{
    iataCode: string;
    duration?: string;
  }>;
}

export interface Itinerary {
  duration: string;
  segments: Array<FlightSegment>;
}

export interface FareDetail {
  cabin: string;
  class?: string;
  fareBasis?: string;
  features?: {
    changeable?: boolean;
    refundable?: boolean;
    changeFeeCurrency?: string;
    changeFeeAmount?: number;
  };
  baggage: {
    cabin?: {
      quantity: number;
      weight?: number;
      weightUnit?: string;
    };
    checked?: {
      quantity: number;
      weight?: number;
      weightUnit?: string;
    };
  };
}


export interface FlightOffer {
  id?: string;
  providerId: string;
  source?: 'GDS' | 'NDC' | 'OTHER';
  travelClass: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  }
  price: {
    amount: number;
    currency: string;
    breakdown?: {
      base: number;
      taxes: number;
      fees: number;
    };
  };
  itineraries: Array<Itinerary>;
  fareDetails: Array<FareDetail>;

  meta: {
    lastTicketingDate?: string;
    numberOfBookableSeats?: number;
    sustainabilityData?: {
      emissions?: number;
      isEcoContender?: boolean;
    };
    validatingCarrier: string;
  };
  dictionaries?: {
    carriers: Record<string, string>;
    aircraft: Record<string, string>;
    locations: Record<string, {
      cityCode: string;
      countryCode: string;
    }>;
  };

}

export interface HotelLocation {
  latitude: number;
  longitude: number;
  address?: string;
  cityCode?: string;
  countryCode?: string;
}

export interface HotelImage {
  thumbnail: string;
  original?: string;
  alt?: string;
}

export interface HotelRating {
  overall: number;
  totalReviews: number;
  location?: number;
  breakdown?: Array<{
    name: string;
    description?: string;
    totalMentions: number;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

export interface HotelPrice {
  current: number;
  original?: number;
  currency: string;
  beforeTaxes?: number;
  includesTaxes: boolean;
  discount?: {
    label: string;
    amount: number;
    percentage?: number;
  };
}

export interface NearbyPlace {
  name: string;
  category?: string;
  rating?: number;
  reviews?: number;
  transportations: Array<{
    type: string;
    duration: string;
  }>;
}

export interface HotelOffer {
  id: string;
  type: 'hotel' | 'resort' | 'apartment';
  name: string;
  provider: string;
  description: string;
  location: HotelLocation;
  
  // Basic info
  hotelClass?: number;
  checkIn?: string;
  checkOut?: string;
  amenities: string[];
  images: HotelImage[];
  
  // Pricing
  price: HotelPrice;
  refundable?: boolean;
  paymentOptions?: {
    prePayment?: boolean;
    payAtProperty?: boolean;
    depositRequired?: boolean;
  };
  
  // Ratings and reviews
  rating: HotelRating;
  
  // Additional information
  brand?: {
    name: string;
    logo?: string;
  };
  nearbyPlaces?: NearbyPlace[];
  badges?: string[];
  
  // Booking info
  availableRooms?: number;
  sponsored?: boolean;
  propertyToken?: string;
  
  // Custom metadata
  meta?: Record<string, any>;
}

// Helper type for specific provider responses
export interface SerpApiHotelOffer extends HotelOffer {
  provider: 'serp';
  serpapi_property_details_link: string;
}

export interface AmadeusHotelOffer extends HotelOffer {
  provider: 'amadeus';
  amadeusId: string;
}

// types/index.ts

export interface HotelOfferDetails {
  type: 'hotel' | 'vacation_rental';
  id: string;
  propertyId?: string;
  name: string;
  description: string;
  rooms: Array<{
      id: string;
      name: string;
      description?: string;
      maxOccupancy: number;
      amenities: string[];
      images: Array<{
          url: string;
          alt?: string;
      }>;
      price: {
          amount: number;
          currency: string;
          breakdown?: {
              baseRate: number;
              taxes: number;
              fees: number;
          };
      };
      cancellationPolicy?: {
          isCancellable: boolean;
          deadline?: string;
          penalties?: Array<{
              from: string;
              amount: number;
              currency: string;
          }>;
      };
  }>;
  availableRooms?: number;
  bookingOptions?: {
      paymentTypes: string[];
      guarantee?: {
          required: boolean;
          amount?: number;
          currency?: string;
      };
  };
}

export interface SearchHotelOffersParams {
  propertyId?: string;
  checkIn: string;
  checkOut: string;
  rooms?: number;
  adults: number;
  children?: number;
  priceRange?: {
      min?: number;
      max?: number;
  };
  amenities?: string[];
  hotelClass?: number[];
  boardType?: string;
  paymentPolicy?: string;
}

// types/car.ts

export interface CarLocation {
  id: string;
  name: string;
  type: 'airport' | 'city' | 'station' | 'other';
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface CarVendor {
  id: string;
  name: string;
  logo?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CarAgent {
  id: string;
  name: string;
  logo?: string;
  type: 'vendor' | 'broker' | 'other';
  rating?: number;
  reviewCount?: number;
}

export interface CarFeatures {
  transmission: 'automatic' | 'manual';
  airConditioning: boolean;
  doors: number;
  seats: number;
  baggageCapacity: {
    large: number;
    small: number;
  };
  category: string; // e.g., 'economy', 'luxury', 'suv', etc.
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  fuelPolicy: 'full_to_full' | 'full_to_empty' | 'pre_purchase';
}

export interface CarPrice {
  amount: number;
  currency: string;
  breakdown?: {
    baseRate: number;
    taxes: number;
    fees: number;
    insurance?: number;
    extras?: number;
  };
  includesTaxes: boolean;
  includesInsurance: boolean;
}

export interface CarInsurance {
  type: 'basic' | 'medium' | 'full';
  coverage: {
    collision?: boolean;
    theft?: boolean;
    thirdParty?: boolean;
    personal?: boolean;
  };
  excess?: {
    amount: number;
    currency: string;
  };
}

export interface CarOffer {
  id: string;
  provider: string;
  status: 'available' | 'on_request' | 'sold_out';
  
  // Vehicle information
  name: string;
  model?: string;
  brand?: string;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  features: CarFeatures;
  
  // Location details
  pickupLocation: CarLocation;
  dropoffLocation: CarLocation;
  pickupDateTime: string;
  dropoffDateTime: string;
  
  // Pricing and booking
  price: CarPrice;
  insurance: CarInsurance[];
  cancellationPolicy?: {
    isCancellable: boolean;
    deadline?: string;
    charge?: {
      amount: number;
      currency: string;
    };
  };
  
  // Provider information
  vendor: CarVendor;
  agent: CarAgent;
  
  // Additional info
  mileage?: {
    limit?: number;
    unlimited: boolean;
    unit: 'km' | 'miles';
  };
  requiredDocuments?: string[];
  restrictions?: {
    minAge?: number;
    maxAge?: number;
    minLicenseHeld?: number;
    requiredCreditCard: boolean;
  };
  
  // Booking details
  deepLink?: string;
  meta?: Record<string, any>;
}

// For Skyscanner specific response
export interface SkyscannerCarOffer extends CarOffer {
  provider: 'skyscanner';
  skyscanner_session_token?: string;
}