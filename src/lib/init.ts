// lib/init.ts
import { Encryption } from './crypto';

let isInitialized = false;

export async function initializeApp() {
  if (isInitialized) return;
  
  try {
    Encryption.initialize();
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize encryption:', error);
    throw error;
  }
}
