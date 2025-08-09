/**
 * Authentication utilities for the user-service
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

/**
 * Generate JWT token for a user
 * @param {Object} user User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY }
  );
};

/**
 * Authenticate a user with email and password
 * @param {String} email User email
 * @param {String} password User password
 * @returns {Promise<Object>} User and token
 */
const authenticateUser = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken(user);
    
    return {
      user: user.toJSON(),
      token
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
  authenticateUser
};