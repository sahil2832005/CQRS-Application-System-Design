/**
 * Create user command - CQRS command for user creation
 */

const User = require('../models/user');
const userReadModel = require('../queries/userReadModel');

/**
 * Command handler for creating a new user
 * @param {Object} userData User data to create
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const user = new User(userData);
    await user.save();
    
    // Get the user as plain object
    const userObj = user.toJSON();
    
    // Sync with read model (Redis cache)
    await userReadModel.handleUserCreated(userObj);
    
    // Return user without sensitive data
    return userObj;
  } catch (error) {
    throw error;
  }
};

module.exports = createUser;