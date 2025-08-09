/**
 * User read model service
 * This implements the read side of CQRS, using Redis for fast queries
 */

const redis = require('../config/redis');
const config = require('../config');
const User = require('../models/user');

// Key prefixes for Redis
const KEY_PREFIX = 'user:';
const ALL_USERS_KEY = 'users:all';

/**
 * Check if caching is available
 * @returns {Boolean} True if caching is enabled and Redis is available
 */
const isCachingAvailable = () => {
  return config.CACHE_ENABLED && redis.isRedisAvailable();
};

/**
 * Cache a user in Redis
 * @param {Object} user - User object
 * @param {Number} expiry - Expiry time in seconds (optional)
 */
const cacheUser = async (user, expiry = redis.DEFAULT_EXPIRY) => {
  if (!isCachingAvailable()) return;
  
  try {
    const userId = user._id.toString();
    const userKey = `${KEY_PREFIX}${userId}`;
    
    // Store user as JSON string
    await redis.setAsync(userKey, JSON.stringify(user));
    
    // Set expiry
    if (expiry) {
      await redis.expireAsync(userKey, expiry);
    }
  } catch (error) {
    console.error('Failed to cache user:', error.message);
    // Continue execution even if caching fails
  }
};

/**
 * Get user from cache
 * @param {String} userId - User ID
 * @returns {Object|null} User object or null if not found
 */
const getUserFromCache = async (userId) => {
  if (!isCachingAvailable()) return null;
  
  try {
    const userKey = `${KEY_PREFIX}${userId}`;
    const cachedUser = await redis.getAsync(userKey);
    
    if (!cachedUser) return null;
    
    return JSON.parse(cachedUser);
  } catch (error) {
    console.error('Error retrieving user from cache:', error.message);
    return null;
  }
};

/**
 * Remove user from cache
 * @param {String} userId - User ID
 */
const invalidateUserCache = async (userId) => {
  if (!isCachingAvailable()) return;
  
  try {
    const userKey = `${KEY_PREFIX}${userId}`;
    await redis.delAsync(userKey);
    
    // Also invalidate the all users cache
    await redis.delAsync(ALL_USERS_KEY);
  } catch (error) {
    console.error('Failed to invalidate user cache:', error.message);
    // Continue execution even if cache invalidation fails
  }
};

/**
 * Get user by ID (with cache)
 * @param {String} userId - User ID
 * @returns {Object} User object
 */
const getUserById = async (userId) => {
  try {
    // Try to get from cache first if available
    const cachedUser = await getUserFromCache(userId);
    if (cachedUser) {
      console.log('User retrieved from cache');
      return cachedUser;
    }
  } catch (error) {
    console.error('Cache retrieval failed, falling back to database:', error.message);
    // Continue to database lookup on cache error
  }
  
  // Get from database
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Cache for future requests
    const userObj = user.toJSON();
    await cacheUser(userObj);
    
    return userObj;
  } catch (error) {
    if (error.message === 'User not found') {
      throw error; // Re-throw not found errors
    }
    
    console.error('Database lookup failed:', error.message);
    throw new Error('Failed to retrieve user');
  }
};

/**
 * List users with pagination (with cache)
 * @param {Object} options - Filter and pagination options
 * @returns {Object} Users and pagination info
 */
const listUsers = async (options = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    filter = {}
  } = options;
  
  // For simplicity, we only cache the default listing (no filtering)
  const useCache = isCachingAvailable() && 
    Object.keys(filter).length === 0 && 
    page === 1 && 
    limit === 10 && 
    sortBy === 'createdAt' && 
    sortOrder === 'desc';
  
  // Try to get from cache if appropriate
  if (useCache) {
    try {
      const cachedList = await redis.getAsync(ALL_USERS_KEY);
      if (cachedList) {
        console.log('Users list retrieved from cache');
        return JSON.parse(cachedList);
      }
    } catch (error) {
      console.error('Cache retrieval failed, falling back to database:', error.message);
      // Continue to database lookup
    }
  }
  
  try {
    // Get from database
    // Create sort config
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Count total users for pagination
    const total = await User.countDocuments(filter);
    
    // Find users with pagination
    const users = await User.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const result = {
      users: users.map(user => user.toJSON()),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    };
    
    // Cache default listing if appropriate
    if (useCache) {
      try {
        await redis.setAsync(ALL_USERS_KEY, JSON.stringify(result));
        
        // Also cache individual users
        for (const user of result.users) {
          await cacheUser(user);
        }
      } catch (error) {
        console.error('Failed to cache users list:', error.message);
        // Continue execution even if caching fails
      }
    }
    
    return result;
  } catch (error) {
    console.error('Database query failed:', error.message);
    throw new Error('Failed to retrieve users list');
  }
};

/**
 * Search users by email or name
 * @param {String} query - Search query
 * @returns {Array} Array of matching users
 */
const searchUsers = async (query) => {
  if (!query || query.length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }
  
  try {
    // No caching for search - always hit the database
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    
    return users.map(user => user.toJSON());
  } catch (error) {
    console.error('User search failed:', error.message);
    throw new Error('Failed to search users');
  }
};

/**
 * Handle user created event
 * @param {Object} user - Created user
 */
const handleUserCreated = async (user) => {
  try {
    await cacheUser(user);
    // Invalidate any cached lists
    await redis.delAsync(ALL_USERS_KEY);
    console.log(`User created event handled for user ${user._id}`);
  } catch (error) {
    console.error('Failed to handle user created event:', error.message);
    // Continue execution even if event handling fails
  }
};

/**
 * Handle user updated event
 * @param {Object} user - Updated user
 */
const handleUserUpdated = async (user) => {
  try {
    await invalidateUserCache(user._id);
    await cacheUser(user);
    await redis.delAsync(ALL_USERS_KEY);
    console.log(`User updated event handled for user ${user._id}`);
  } catch (error) {
    console.error('Failed to handle user updated event:', error.message);
    // Continue execution even if event handling fails
  }
};

/**
 * Handle user deleted event
 * @param {String} userId - User ID
 */
const handleUserDeleted = async (userId) => {
  try {
    await invalidateUserCache(userId);
    await redis.delAsync(ALL_USERS_KEY);
    console.log(`User deleted event handled for user ${userId}`);
  } catch (error) {
    console.error('Failed to handle user deleted event:', error.message);
    // Continue execution even if event handling fails
  }
};

module.exports = {
  getUserById,
  listUsers,
  searchUsers,
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted
};
