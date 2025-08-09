/**
 * Configuration for the user-service
 */

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/user-service',
  REDIS_URI: process.env.REDIS_URI || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1d',
  API_PREFIX: '/api/v1',
  CACHE_ENABLED: process.env.CACHE_ENABLED === 'true' || false
};