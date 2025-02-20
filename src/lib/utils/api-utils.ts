// lib/utils/api-utils.ts
import { ApiService } from '../services/api-service';
import { ServiceConfig } from '../service-config';

export class ApiUtils {
  static async validateAmadeusToken(): Promise<boolean> {
    try {
      const client = await ApiService.getAmadeusClient();
      const response = await fetch(`${client.baseUrl}/security/oauth2/token/validate`, {
        headers: {
          'Authorization': `Bearer ${client.token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async testAmadeusConnection(): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const isEnabled = await ServiceConfig.getServiceStatus('flight');
      if (!isEnabled) {
        return { 
          success: false, 
          message: 'Flight service is disabled' 
        };
      }

      const isProviderEnabled = await ServiceConfig.isProviderEnabled('flight', 'amadeus');
      if (!isProviderEnabled) {
        return { 
          success: false, 
          message: 'Amadeus provider is not enabled' 
        };
      }

      const client = await ApiService.getAmadeusClient();
      const response = await fetch(`${client.baseUrl}/reference-data/urls/checkin-links?airlineCode=BA`, {
        headers: {
          'Authorization': `Bearer ${client.token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: `API Error: ${error.errors?.[0]?.detail || 'Unknown error'}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test Amadeus connection'
      };
    }
  }

  static async testSkyscannerConnection(): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const { apiKey, baseUrl } = await ApiService.getSkyscannerKey();
      const response = await fetch(`${baseUrl}/geo/v1/market/GB`, {
        headers: {
          'x-api-key': apiKey
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: `API Error: ${error.message || 'Unknown error'}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test Skyscanner connection'
      };
    }
  }

  static async testSerpConnection(): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const { apiKey, baseUrl } = await ApiService.getSerpKey();
      const response = await fetch(`${baseUrl}?api_key=${apiKey}&engine=google_hotels&q=test`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: `API Error: ${error.message || 'Unknown error'}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test SERP connection'
      };
    }
  }

  static async testStripeConnection(): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const { secretKey } = await ApiService.getStripeKeys();
      const response = await fetch('https://api.stripe.com/v1/balance', {
        headers: {
          'Authorization': `Bearer ${secretKey}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: `API Error: ${error.message || 'Unknown error'}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test Stripe connection'
      };
    }
  }
}
