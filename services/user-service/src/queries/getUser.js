/**
 * Get user query - CQRS query for fetching user
 */

const userReadModel = require('./userReadModel');

/**
 * Query handler for getting a user by ID
 * @param {String} userId ID of the user to find
 * @returns {Promise<Object>} User data
 */
const getUserById = async (userId) => {
  try {
    // Use the read model, which implements caching
    return await userReadModel.getUserById(userId);
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserById };