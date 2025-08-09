/**
 * List users query - CQRS query for listing users
 */

const userReadModel = require('./userReadModel');

/**
 * Query handler for listing users with pagination
 * @param {Object} options Options for filtering and pagination
 * @returns {Promise<Object>} Users and pagination info
 */
const listUsers = async (options = {}) => {
  try {
    // Use the read model, which implements caching
    return await userReadModel.listUsers(options);
  } catch (error) {
    throw error;
  }
};

/**
 * Query handler for searching users
 * @param {String} query Search query string
 * @returns {Promise<Array>} Array of matching users
 */
const searchUsers = async (query) => {
  try {
    return await userReadModel.searchUsers(query);
  } catch (error) {
    throw error;
  }
};

module.exports = { 
  listUsers,
  searchUsers
};