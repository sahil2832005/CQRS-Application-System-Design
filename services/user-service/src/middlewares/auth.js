/**
 * Authentication middleware
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    console.log('Authentication middleware - checking token');
    
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authentication failed: No Bearer token provided');
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log(`Token received: ${token.substring(0, 15)}...`);
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
      console.log('Token verified successfully');
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: `Invalid token: ${jwtError.message}`
      });
    }
    
    // Find user
    try {
      const user = await User.findById(decoded.id);
      
      if (!user) {
        console.log(`User not found: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (!user.isActive) {
        console.log(`User inactive: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: 'User is inactive'
        });
      }
      
      console.log(`User authenticated: ${decoded.id}, role: ${decoded.role}`);
      
      // Attach user to request
      req.user = decoded;
      next();
    } catch (dbError) {
      console.error('Database error during authentication:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Server error during authentication'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

module.exports = {
  authenticate,
  isAdmin
};