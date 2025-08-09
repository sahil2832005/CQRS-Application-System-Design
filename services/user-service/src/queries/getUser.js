/**
 * Get user query - CQRS query for fetching user
 */

const User = require('../models/user');

/**
 * Query handler for getting a user by ID
 * @param {String} userId ID of the user to find
 * @returns {Promise<Object>} User data
 */
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.toJSON();
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserById };