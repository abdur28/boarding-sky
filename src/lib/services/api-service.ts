// lib/services/api-service.ts
import { ApiKeyManager } from '../api-keys';

interface TokenCache {
  [providerId: string]: {
    token: string;
    expiresAt: number;
  };
}

export class ApiService {
  private static tokenCache: TokenCache = {};

  static async getAmadeusClient() {
    const provider = await ApiKeyManager.getProvider('amadeus');
    if (!provider?.apiKey || !provider?.apiSecret) {
      throw new Error('Amadeus credentials not configured');
    }

    const cachedToken = this.tokenCache['amadeus'];
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
      return {
        baseUrl: provider.baseUrl,
        token: cachedToken.token
      };
    }

    const response = await fetch(`${provider.baseUrl}/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: provider.apiKey,
        client_secret: provider.apiSecret
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get Amadeus token');
    }

    const data = await response.json();
    
    this.tokenCache['amadeus'] = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000)
    };

    return {
      baseUrl: provider.baseUrl,
      token: data.access_token
    };
  }

  static async getSkyscannerKey() {
    const provider = await ApiKeyManager.getProvider('skyscanner');
    if (!provider?.apiKey) {
      throw new Error('Skyscanner API key not configured');
    }
    return {
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey
    };
  }

  static async getSerpKey() {
    const provider = await ApiKeyManager.getProvider('serp');
    if (!provider?.apiKey) {
      throw new Error('SERP API key not configured');
    }
    return {
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey
    };
  }

  static async getStripeKeys() {
    const provider = await ApiKeyManager.getProvider('stripe');
    if (!provider?.apiKey) {
      throw new Error('Stripe keys not configured');
    }
    return {
      secretKey: provider.apiKey,
      webhookSecret: provider.apiSecret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    };
  }
}
