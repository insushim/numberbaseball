import Redis from 'ioredis';
import { logger } from '../utils/logger';

/**
 * In-memory Redis fallback for single-server deployments.
 * Implements the subset of Redis commands used in this project.
 */
class InMemoryRedis {
  private store = new Map<string, string>();
  private hashes = new Map<string, Map<string, string>>();
  private sortedSets = new Map<string, { score: number; member: string }[]>();
  private sets = new Map<string, Set<string>>();
  private ttls = new Map<string, NodeJS.Timeout>();

  async ping() { return 'PONG'; }

  // String commands
  async get(key: string) { return this.store.get(key) || null; }

  async set(key: string, value: string, ...args: any[]) {
    this.store.set(key, value);
    if (args[0] === 'EX' && typeof args[1] === 'number') {
      this.clearTtl(key);
      this.ttls.set(key, setTimeout(() => { this.store.delete(key); this.ttls.delete(key); }, args[1] * 1000));
    }
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string) {
    this.store.set(key, value);
    this.clearTtl(key);
    this.ttls.set(key, setTimeout(() => { this.store.delete(key); this.ttls.delete(key); }, seconds * 1000));
    return 'OK';
  }

  async del(key: string) {
    this.clearTtl(key);
    const existed = this.store.has(key);
    this.store.delete(key);
    this.hashes.delete(key);
    this.sortedSets.delete(key);
    this.sets.delete(key);
    return existed ? 1 : 0;
  }

  // Hash commands
  async hset(key: string, field: string, value: string) {
    if (!this.hashes.has(key)) this.hashes.set(key, new Map());
    this.hashes.get(key)!.set(field, value);
    return 1;
  }

  async hget(key: string, field: string) {
    return this.hashes.get(key)?.get(field) || null;
  }

  async hdel(key: string, field: string) {
    const h = this.hashes.get(key);
    if (!h) return 0;
    const existed = h.has(field);
    h.delete(field);
    return existed ? 1 : 0;
  }

  async hexists(key: string, field: string) {
    return this.hashes.get(key)?.has(field) ? 1 : 0;
  }

  // Sorted set commands
  async zadd(key: string, score: number, member: string) {
    if (!this.sortedSets.has(key)) this.sortedSets.set(key, []);
    const ss = this.sortedSets.get(key)!;
    const idx = ss.findIndex(e => e.member === member);
    if (idx >= 0) { ss[idx].score = score; } else { ss.push({ score, member }); }
    ss.sort((a, b) => a.score - b.score);
    return 1;
  }

  async zrem(key: string, member: string) {
    const ss = this.sortedSets.get(key);
    if (!ss) return 0;
    const idx = ss.findIndex(e => e.member === member);
    if (idx >= 0) { ss.splice(idx, 1); return 1; }
    return 0;
  }

  async zrange(key: string, start: number, stop: number) {
    const ss = this.sortedSets.get(key) || [];
    const end = stop < 0 ? ss.length + stop + 1 : stop + 1;
    return ss.slice(start, end).map(e => e.member);
  }

  async zrangebyscore(key: string, min: number, max: number) {
    const ss = this.sortedSets.get(key) || [];
    return ss.filter(e => e.score >= min && e.score <= max).map(e => e.member);
  }

  async zcard(key: string) {
    return (this.sortedSets.get(key) || []).length;
  }

  // Set commands
  async sadd(key: string, member: string) {
    if (!this.sets.has(key)) this.sets.set(key, new Set());
    this.sets.get(key)!.add(member);
    return 1;
  }

  async srem(key: string, member: string) {
    const s = this.sets.get(key);
    if (!s) return 0;
    const existed = s.has(member);
    s.delete(member);
    return existed ? 1 : 0;
  }

  async scard(key: string) {
    return this.sets.get(key)?.size || 0;
  }

  async quit() { return 'OK'; }

  // Event emitter stubs
  on(_event: string, _fn: (...args: any[]) => void) { return this; }

  private clearTtl(key: string) {
    const t = this.ttls.get(key);
    if (t) { clearTimeout(t); this.ttls.delete(key); }
  }
}

let redis: any;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('connect', () => {
    logger.info('Redis connected');
  });

  redis.on('error', (err: Error) => {
    logger.error('Redis connection error:', err);
  });
} else {
  logger.info('REDIS_URL not set, using in-memory store (single-server mode)');
  redis = new InMemoryRedis();
}

export { redis };
export default redis;
