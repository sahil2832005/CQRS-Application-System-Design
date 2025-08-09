/**
 * Delete user command - CQRS command for user deletion
 */

const User = require('../models/user');
const userReadModel = require('../queries/userReadModel');

/**
 * Command handler for deleting a user
 * @param {String} userId ID of the user to delete
 * @returns {Promise<Boolean>} Success status
 */
const deleteUser = async (userId) => {
  try {
    // Find and delete user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Sync with read model (Redis cache)
    await userReadModel.handleUserDeleted(userId);
    
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = deleteUser;
