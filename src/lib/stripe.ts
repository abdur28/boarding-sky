// lib/stripe.ts
import 'server-only';
import Stripe from 'stripe';
import { ApiKeyManager } from './api-keys';

let stripeInstance: Stripe | null = null;

export async function getStripe(): Promise<Stripe> {
  if (stripeInstance) {
    return stripeInstance;
  }

  try {
    const provider = await ApiKeyManager.getProvider('stripe');
    if (!provider?.apiKey) {
      throw new Error('Stripe secret key not configured');
    }

    stripeInstance = new Stripe(provider.apiKey, {
      typescript: true,
    });

    return stripeInstance;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    throw new Error('Failed to initialize Stripe client');
  }
}

export async function getStripeWebhookSecret(): Promise<string> {
  const provider = await ApiKeyManager.getProvider('stripe');
  if (!provider?.apiSecret) {
    throw new Error('Stripe webhook secret not configured');
  }
  return provider.apiSecret;
}