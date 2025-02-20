import { randomBytes } from 'crypto';


export function generateKeys() {
  const encryptionKey = randomBytes(32);
  const salt = randomBytes(16);

  console.log('Add these to your .env file:');
  console.log(`ENCRYPTION_KEY=${encryptionKey.toString('hex')}`);
  console.log(`ENCRYPTION_SALT=${salt.toString('hex')}`);
}

generateKeys();