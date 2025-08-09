/**
 * Entry point for the user-service
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const connectDB = require('./config/db');
// Redis client for read models
const redis = require('./config/redis');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Request timeout handling - increase timeout to 30 seconds
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// Routes
app.use(`${config.API_PREFIX}/users`, userRoutes);

// 404 handler
app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.originalUrl}`
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'user-service',
    time: new Date().toISOString(),
    cacheStatus: redis.isRedisAvailable() ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});