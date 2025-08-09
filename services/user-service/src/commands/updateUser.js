/**
 * Update user command - CQRS command for user updates
 */

const User = require('../models/user');
const userReadModel = require('../queries/userReadModel');

/**
 * Command handler for updating a user
 * @param {String} userId ID of the user to update
 * @param {Object} updateData Data to update
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (userId, updateData) => {
  try {
    // Prevent password updates through this command
    if (updateData.password) {
      delete updateData.password;
    }
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const userObj = user.toJSON();
    
    // Sync with read model (Redis cache)
    await userReadModel.handleUserUpdated(userObj);
    
    return userObj;
  } catch (error) {
    throw error;
  }
};

module.exports = updateUser;