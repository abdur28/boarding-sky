// lib/web-crypto.ts
export class WebCrypto {
    private static async getKey(): Promise<CryptoKey> {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(process.env.ENCRYPTION_KEY);
      
      return await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    }
  
    static async encrypt(text: string): Promise<string> {
      const key = await this.getKey();
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );
  
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    }
  
    static async decrypt(encryptedData: string): Promise<string> {
      const key = await this.getKey();
      const decoder = new TextDecoder();
      
      // Convert base64 to array buffer
      const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Extract IV and encrypted data
      const iv = data.slice(0, 12);
      const encrypted = data.slice(12);
      
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted
      );
      
      return decoder.decode(decrypted);
    }
  }
  