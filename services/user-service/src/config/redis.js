/**
 * Redis configuration for read models
 */

const redis = require('redis');
const config = require('./index');

// Flag to check if Redis is available
let redisAvailable = false;

// Create Redis client with fallback for local development
let redisClient;

// Mock client for fallback mode - uses in-memory storage
const createMockRedisClient = () => {
  console.warn('Using mock Redis client for development');
  
  // Simple in-memory storage
  const storage = new Map();
  
  return {
    isReady: true,
    connect: () => Promise.resolve(),
    on: () => {},
    get: async (key) => storage.get(key) || null,
    set: async (key, value, options) => {
      storage.set(key, value);
      return 'OK';
    },
    hGetAll: async (key) => storage.get(key) || {},
    hSet: async (key, field, value) => {
      const hash = storage.get(key) || {};
      hash[field] = value;
      storage.set(key, hash);
      return 1;
    },
    expire: async (key, seconds) => {
      setTimeout(() => {
        storage.delete(key);
      }, seconds * 1000);
      return 1;
    },
    del: async (key) => {
      storage.delete(key);
      return 1;
    }
  };
};

// Initialize Redis client based on configuration
const initRedisClient = async () => {
  if (!config.CACHE_ENABLED) {
    console.log('Cache is disabled in configuration, using mock Redis client');
    redisClient = createMockRedisClient();
    return;
  }
  
  try {
    console.log('Initializing Redis client...');
    redisClient = redis.createClient({
      url: config.REDIS_URI,
      socket: {
        reconnectStrategy: (retries) => {
          return Math.min(retries * 50, 3000);
        }
      }
    });
    
    // Setup event handlers
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
      redisAvailable = false;
    });
    
    redisClient.on('connect', () => {
      console.log('Redis client connected');
      redisAvailable = true;
    });
    
    redisClient.on('ready', () => {
      console.log('Redis client ready');
      redisAvailable = true;
    });
    
    redisClient.on('end', () => {
      console.log('Redis client connection closed');
      redisAvailable = false;
    });
    
    // Connect to Redis
    await redisClient.connect().catch(err => {
      console.error('Redis connection error:', err);
      console.log('Falling back to mock Redis client');
      redisClient = createMockRedisClient();
    });
    
  } catch (error) {
    console.error('Redis client initialization error:', error);
    console.log('Falling back to mock Redis client');
    redisClient = createMockRedisClient();
  }
};

// Initialize Redis
initRedisClient().catch(err => {
  console.error('Failed to initialize Redis:', err);
});

// Safe Redis operations with fallback
const safeRedisOp = async (operation, fallbackValue = null) => {
  if (!redisClient || !redisClient.isReady) {
    return fallbackValue;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Redis operation error:', error);
    return fallbackValue;
  }
};

// Wrapped Redis operations with error handling
const getAsync = async (key) => safeRedisOp(() => redisClient.get(key));
const setAsync = async (key, value, options) => safeRedisOp(() => redisClient.set(key, value, options), 'OK');
const delAsync = async (key) => safeRedisOp(() => redisClient.del(key), 1);
const hgetAllAsync = async (key) => safeRedisOp(() => redisClient.hGetAll(key), {});
const hsetAsync = async (key, field, value) => safeRedisOp(() => redisClient.hSet(key, field, value), 1);
const expireAsync = async (key, seconds) => safeRedisOp(() => redisClient.expire(key, seconds), 1);

// Check if Redis is available
const isRedisAvailable = () => redisAvailable && redisClient && redisClient.isReady;

module.exports = {
  redisClient,
  getAsync,
  setAsync,
  delAsync,
  hgetAllAsync,
  hsetAsync,
  expireAsync,
  isRedisAvailable,
  // Default expiry time for cached items (in seconds)
  DEFAULT_EXPIRY: 3600 // 1 hour
};
