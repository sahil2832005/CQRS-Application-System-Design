/**
 * List users query - CQRS query for listing users
 */

const User = require('../models/user');

/**
 * Query handler for listing users with pagination
 * @param {Object} options Options for filtering and pagination
 * @returns {Promise<Object>} Users and pagination info
 */
const listUsers = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      filter = {}
    } = options;
    
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
    
    return {
      users: users.map(user => user.toJSON()),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { listUsers };