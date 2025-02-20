import client from './mongodb';

export class ServiceConfig {
  private static async getCollection() {
    const mongoClient = await client;
    return mongoClient.db("boarding-sky").collection('config');
  }

  static async getServiceStatus(service: 'flight' | 'hotel' | 'car'): Promise<boolean> {
    const collection = await this.getCollection();
    const config = await collection.findOne({});
    return config?.[service]?.enabled || false;
  }

  static async isProviderEnabled(service: 'flight' | 'hotel' | 'car', providerId: string): Promise<boolean> {
    const collection = await this.getCollection();
    const config = await collection.findOne({});
    return config?.[service]?.providers?.includes(providerId) || false;
  }
}
