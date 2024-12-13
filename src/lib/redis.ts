// import { createClient } from 'redis';
import Redis from "ioredis"

const redisClient = new Redis("rediss://default:AclOAAIncDE4MjkxZmQ5OTY0ZGI0NTBhOTIzNDVjNWYwMGVjM2FlMXAxNTE1MzQ@wise-newt-51534.upstash.io:6379");
// const redisClient = createClient();

// const redisClient = createClient({
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//       host: process.env.REDIS_HOST,
//       port: process.env.REDIS_PORT
//   }
// });

redisClient.on('error', (err: Error) => {
  console.log('Redis error:', err);
});

redisClient.on('end', () => {
  console.log('Disconnected from Redis');
});

redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err: Error) => {
  console.log('Failed to connect to Redis:', err);
});

export default redisClient;
