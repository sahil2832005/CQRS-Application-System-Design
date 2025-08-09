/**
 * User routes
 */

const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);

// Admin routes
router.get('/', authenticate, isAdmin, userController.listUsers);

module.exports = router;