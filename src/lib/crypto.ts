// lib/crypto.ts
import { randomBytes, createCipheriv, createDecipheriv, CipherGCM, DecipherGCM } from 'crypto';

export class Encryption {
  private static algorithm = 'aes-256-gcm';
  private static keyLength = 32;
  private static ivLength = 12;
  private static authTagLength = 16;
  private static encryptionKey: Buffer | null = null;

  static initialize() {
    if (this.encryptionKey) return; // Already initialized

    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable is not set');
    }

    try {
      this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
      
      if (this.encryptionKey.length !== this.keyLength) {
        throw new Error(`Encryption key must be ${this.keyLength} bytes`);
      }
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      throw new Error('Invalid encryption key format');
    }
  }

  static isInitialized(): boolean {
    return this.encryptionKey !== null;
  }

  private static getKey(): Buffer {
    if (!this.encryptionKey) {
      this.initialize(); // Try to initialize if not already done
      if (!this.encryptionKey) {
        throw new Error('Encryption not initialized');
      }
    }
    return this.encryptionKey;
  }

  static encrypt(text: string): string {
    const key = this.getKey();
    const iv = randomBytes(this.ivLength);
    
    const cipher = createCipheriv(
      this.algorithm,
      key,
      iv
    ) as CipherGCM;

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([
      iv,
      authTag,
      encrypted
    ]).toString('hex');
  }

  static decrypt(encryptedHex: string): string {
    const key = this.getKey();
    const buffer = Buffer.from(encryptedHex, 'hex');
    
    const iv = buffer.subarray(0, this.ivLength);
    const authTag = buffer.subarray(this.ivLength, this.ivLength + this.authTagLength);
    const encrypted = buffer.subarray(this.ivLength + this.authTagLength);

    const decipher = createDecipheriv(
      this.algorithm,
      key,
      iv
    ) as DecipherGCM;

    decipher.setAuthTag(authTag);

    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]).toString('utf8');
  }
}

// Initialize encryption at module load time
if (typeof process !== 'undefined' && process.env.ENCRYPTION_KEY) {
  try {
    Encryption.initialize();
  } catch (error) {
    console.error('Failed to initialize encryption at module load:', error);
  }
}

export const encryptApiKey = (apiKey: string): string => {
  try {
    if (!Encryption.isInitialized()) {
      Encryption.initialize();
    }
    return Encryption.encrypt(apiKey);
  } catch (error) {
    console.error('Failed to encrypt API key:', error);
    throw new Error('Encryption failed');
  }
};

export const decryptApiKey = (encryptedKey: string): string => {
  try {
    if (!Encryption.isInitialized()) {
      Encryption.initialize();
    }
    return Encryption.decrypt(encryptedKey);
  } catch (error) {
    console.error('Failed to decrypt API key:', error);
    throw new Error('Decryption failed');
  }
};