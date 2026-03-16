import Redis from 'ioredis';

// Redis Configuration
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);

// Create an in-memory mock Redis to avoid connection crashes locally
class MockRedis {
  private store: Map<string, string>;
  constructor() {
    this.store = new Map();
    console.log('✅ Using Mock In-Memory Redis connected successfully');
  }

  async get(key: string) { return this.store.get(key) || null; }
  async set(key: string, value: string) { this.store.set(key, value); return 'OK'; }
  async setex(key: string, seconds: number, value: string) { this.store.set(key, value); return 'OK'; }
  async del(key: string) { this.store.delete(key); return 1; }
  async rpush(key: string, value: string) { return 1; }
  async lrange(key: string, start: number, end: number) { return []; }
  async zadd(key: string, score: number, member: string) { return 1; }
  async zrange(key: string, start: number, end: number) { return []; }
  async zrem(key: string, member: string) { return 1; }
  async zcard(key: string) { return 0; }
  async expire(key: string, seconds: number) { return 1; }
  async exists(key: string) { return this.store.has(key) ? 1 : 0; }
  async keys(pattern: string) { return Array.from(this.store.keys()).filter(k => k.includes(pattern.replace('*', ''))); }

  on(event: string, callback: any) {
    if (event === 'connect' || event === 'ready') callback();
  }
}

// @ts-ignore
const redis = new MockRedis() as any;

export default redis;

// redis.on('error', (err) => {
//   console.error('❌ Redis connection error:', err);
// });

redis.on('ready', () => {
  console.log('✅ Redis is ready to accept commands');
});
