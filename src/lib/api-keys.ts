// lib/api-keys.ts
import { encryptApiKey, decryptApiKey } from './crypto';
import client from './mongodb';
import { Provider } from '@/types';
import { Document, ObjectId } from 'mongodb';

// Interface for how the provider is stored in MongoDB
interface ProviderDocument extends Document {
  _id: ObjectId;
  id: string;
  name: string;
  type: 'amadeus' | 'skyscanner' | 'serp' | 'direct';
  isActive: boolean;
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  updatedAt: Date;
}

export class ApiKeyManager {
  private static async getCollection() {
    const mongoClient = await client;
    return mongoClient.db("boarding-sky").collection<ProviderDocument>('api_keys');
  }

  static async storeProviderKeys(provider: Provider) {
    const collection = await this.getCollection();
    
    const encryptedData: Omit<ProviderDocument, '_id'> = {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      isActive: provider.isActive,
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey ? encryptApiKey(provider.apiKey) : undefined,
      apiSecret: provider.apiSecret ? encryptApiKey(provider.apiSecret) : undefined,
      updatedAt: new Date()
    };

    await collection.updateOne(
      { id: provider.id },
      { $set: encryptedData },
      { upsert: true }
    );
  }

  static async getProvider(providerId: string): Promise<Provider | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ id: providerId });

    if (!doc) return null;

    try {
      // Map MongoDB document to Provider type
      const provider: Provider = {
        id: doc.id,
        name: doc.name,
        type: doc.type,
        isActive: doc.isActive,
        baseUrl: doc.baseUrl,
        apiKey: doc.apiKey ? decryptApiKey(doc.apiKey) : undefined,
        apiSecret: doc.apiSecret ? decryptApiKey(doc.apiSecret) : undefined
      };

      return provider;
    } catch (error) {
      console.error(`Failed to decrypt provider keys for ${providerId}:`, error);
      throw new Error('Failed to retrieve provider keys');
    }
  }

  static async deleteProvider(providerId: string) {
    const collection = await this.getCollection();
    await collection.deleteOne({ id: providerId });
  }

  static async rotateKeys(providerId: string, newApiKey?: string, newApiSecret?: string) {
    const provider = await this.getProvider(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    await this.storeProviderKeys({
      ...provider,
      apiKey: newApiKey || provider.apiKey,
      apiSecret: newApiSecret || provider.apiSecret,
    });
  }

  static async validateProviderKeys(providerId: string): Promise<boolean> {
    try {
      const provider = await this.getProvider(providerId);
      return provider !== null && 
             (provider.apiKey !== undefined || provider.apiSecret !== undefined);
    } catch {
      return false;
    }
  }
}