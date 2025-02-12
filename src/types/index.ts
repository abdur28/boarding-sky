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


export interface flightOffer {
  id: string;
  providerId: string;
  source?: 'GDS' | 'NDC' | 'OTHER';
  
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