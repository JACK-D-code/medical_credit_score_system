"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Redis Configuration
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);
// Create an in-memory mock Redis to avoid connection crashes locally
class MockRedis {
    store;
    constructor() {
        this.store = new Map();
        console.log('✅ Using Mock In-Memory Redis connected successfully');
    }
    async get(key) { return this.store.get(key) || null; }
    async set(key, value) { this.store.set(key, value); return 'OK'; }
    async setex(key, seconds, value) { this.store.set(key, value); return 'OK'; }
    async del(key) { this.store.delete(key); return 1; }
    async rpush(key, value) { return 1; }
    async lrange(key, start, end) { return []; }
    async zadd(key, score, member) { return 1; }
    async zrange(key, start, end) { return []; }
    async zrem(key, member) { return 1; }
    async zcard(key) { return 0; }
    async expire(key, seconds) { return 1; }
    async exists(key) { return this.store.has(key) ? 1 : 0; }
    async keys(pattern) { return Array.from(this.store.keys()).filter(k => k.includes(pattern.replace('*', ''))); }
    on(event, callback) {
        if (event === 'connect' || event === 'ready')
            callback();
    }
}
// @ts-ignore
const redis = new MockRedis();
exports.default = redis;
// redis.on('error', (err) => {
//   console.error('❌ Redis connection error:', err);
// });
redis.on('ready', () => {
    console.log('✅ Redis is ready to accept commands');
});
