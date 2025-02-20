
// lib/utils/key-rotation.ts
import { ApiKeyManager } from '../api-keys';
import crypto from 'crypto';

export class KeyRotation {
  static async rotateAmadeusKeys(): Promise<{
    success: boolean;
    message?: string;
    newClientId?: string;
    newClientSecret?: string;
  }> {
    try {
      const newClientId = crypto.randomBytes(32).toString('hex');
      const newClientSecret = crypto.randomBytes(32).toString('hex');

      await ApiKeyManager.rotateKeys('amadeus', newClientId, newClientSecret);

      return {
        success: true,
        newClientId,
        newClientSecret
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to rotate Amadeus keys'
      };
    }
  }

  static async rotateSkyscannerKey(): Promise<{
    success: boolean;
    message?: string;
    newApiKey?: string;
  }> {
    try {
      const newApiKey = crypto.randomBytes(32).toString('hex');
      await ApiKeyManager.rotateKeys('skyscanner', newApiKey);

      return {
        success: true,
        newApiKey
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to rotate Skyscanner key'
      };
    }
  }

  static async rotateSerpKey(): Promise<{
    success: boolean;
    message?: string;
    newApiKey?: string;
  }> {
    try {
      const newApiKey = crypto.randomBytes(32).toString('hex');
      await ApiKeyManager.rotateKeys('serp', newApiKey);

      return {
        success: true,
        newApiKey
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to rotate SERP key'
      };
    }
  }

  static async rotateStripeKeys(): Promise<{
    success: boolean;
    message?: string;
    newSecretKey?: string;
    newWebhookSecret?: string;
  }> {
    try {
      const newSecretKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
      const newWebhookSecret = `whsec_${crypto.randomBytes(32).toString('hex')}`;

      await ApiKeyManager.rotateKeys('stripe', newSecretKey, newWebhookSecret);

      return {
        success: true,
        newSecretKey,
        newWebhookSecret
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to rotate Stripe keys'
      };
    }
  }
}