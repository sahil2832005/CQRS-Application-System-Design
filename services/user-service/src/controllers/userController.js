/**
 * User controller handling HTTP requests
 */

const createUser = require('../commands/createUser');
const updateUser = require('../commands/updateUser');
const { getUserById } = require('../queries/getUser');
const { listUsers } = require('../queries/listUsers');
const { authenticateUser } = require('../utils/auth');

// Controller methods
const userController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const userData = req.body;
      const user = await createUser(userData);
      
      return res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // Login a user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const authData = await authenticateUser(email, password);
      
      return res.status(200).json({
        success: true,
        data: authData,
        message: 'Login successful'
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await getUserById(userId);
      
      return res.status(200).json({
        success: true,
        data: user,
        message: 'User profile retrieved successfully'
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      const user = await updateUser(userId, updateData);
      
      return res.status(200).json({
        success: true,
        data: user,
        message: 'User profile updated successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // List users (admin only)
  listUsers: async (req, res) => {
    try {
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };
      
      const result = await listUsers(options);
      
      return res.status(200).json({
        success: true,
        ...result,
        message: 'Users retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = userController;