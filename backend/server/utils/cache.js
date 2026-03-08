/**
 * 内存缓存工具类
 * @description 提供简单的内存缓存机制，支持TTL（生存时间）
 */

class MemoryCache {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0
        };

        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 60000);
    }

    set(key, value, ttl = 300000) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        this.cache.set(key, {
            value,
            createdAt: Date.now(),
            ttl
        });

        if (ttl > 0) {
            const timer = setTimeout(() => {
                this.delete(key);
            }, ttl);
            this.timers.set(key, timer);
        }

        this.stats.sets++;
        return true;
    }

    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return item.value;
    }

    has(key) {
        return this.cache.has(key);
    }

    delete(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        
        const result = this.cache.delete(key);
        if (result) {
            this.stats.deletes++;
        }
        return result;
    }

    clear() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
        this.cache.clear();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0
        };
        return true;
    }

    cleanup() {
        const now = Date.now();
        const keysToDelete = [];

        this.cache.forEach((item, key) => {
            if (now - item.createdAt > item.ttl) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.delete(key));
        return keysToDelete.length;
    }

    size() {
        return this.cache.size;
    }

    getStats() {
        const total = this.stats.hits + this.stats.misses;
        const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;

        return {
            ...this.stats,
            size: this.cache.size,
            hitRate: `${hitRate}%`
        };
    }

    getOrSet(key, fetchFunction, ttl = 300000) {
        const cachedValue = this.get(key);
        
        if (cachedValue !== null) {
            return cachedValue;
        }

        const value = fetchFunction();
        this.set(key, value, ttl);
        return value;
    }

    async getOrSetAsync(key, fetchFunction, ttl = 300000) {
        const cachedValue = this.get(key);
        
        if (cachedValue !== null) {
            return cachedValue;
        }

        const value = await fetchFunction();
        this.set(key, value, ttl);
        return value;
    }

    destroy() {
        clearInterval(this.cleanupInterval);
        this.clear();
    }
}

const globalCache = new MemoryCache();

const CacheUtil = {
    set: (key, value, ttl) => globalCache.set(key, value, ttl),
    get: (key) => globalCache.get(key),
    has: (key) => globalCache.has(key),
    delete: (key) => globalCache.delete(key),
    clear: () => globalCache.clear(),
    size: () => globalCache.size(),
    getStats: () => globalCache.getStats(),
    getOrSet: (key, fetchFunction, ttl) => globalCache.getOrSet(key, fetchFunction, ttl),
    getOrSetAsync: (key, fetchFunction, ttl) => globalCache.getOrSetAsync(key, fetchFunction, ttl)
};

module.exports = CacheUtil;
