# Developer Guide

This document provides guidance for developers working on the CQRS Application System Design project.

## CQRS Development Principles

When implementing features using the CQRS pattern, follow these principles:

1. **Strict Separation**: Keep command (write) and query (read) operations strictly separated
2. **Domain-Driven Design**: Model services around business domains, not technical concerns
3. **Event-Based Communication**: Use events to propagate changes between services
4. **Eventual Consistency**: Accept that read models may be temporarily inconsistent with write models

## Adding a New Feature

### 1. Determine if Command or Query (or both)

- **Command**: Changes system state (create, update, delete)
- **Query**: Retrieves information without changing state

### 2. For Commands

1. Create a new file in the appropriate service's `commands/` directory
2. Define the command handler function
3. Validate input
4. Apply business logic
5. Persist changes to the write database (MongoDB)
6. Emit events for other services to consume
7. Return minimal response (usually just success/failure)

Example command structure:
```javascript
const { validate } = require('../utils/validation');
const User = require('../models/user');
const eventEmitter = require('../utils/eventEmitter');

// Command handler function
const createUser = async (userData) => {
  // 1. Validate input
  validate(userData, 'createUser');
  
  // 2. Apply business logic
  const user = new User(userData);
  
  // 3. Persist to write database
  await user.save();
  
  // 4. Emit events
  eventEmitter.emit('user.created', user);
  
  // 5. Return minimal response
  return { success: true, userId: user._id };
};

module.exports = { createUser };
```

### 3. For Queries

1. Create a new file in the appropriate service's `queries/` directory
2. Define the query handler function
3. Validate query parameters
4. Try to get data from read database (Redis)
5. Fall back to write database if needed
6. Transform data for client consumption
7. Return comprehensive response with requested data

Example query structure:
```javascript
const { validate } = require('../utils/validation');
const userReadModel = require('./userReadModel');

// Query handler function
const getUserById = async (userId) => {
  // 1. Validate input
  validate({ userId }, 'getUserById');
  
  // 2. Get from read model (handles cache)
  const user = await userReadModel.getUserById(userId);
  
  // 3. Transform data if needed
  const transformedUser = {
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    // Don't include sensitive data like password hash
  };
  
  // 4. Return comprehensive response
  return transformedUser;
};

module.exports = { getUserById };
```

## Working with Events

Events are the backbone of communication in a CQRS system:

1. **Emit Events**: When state changes in a command
2. **Listen for Events**: Update read models when relevant events occur
3. **Event Structure**: Always include `type`, `payload`, and `metadata`

Example event handling:
```javascript
// Emitting an event
eventEmitter.emit('user.created', { 
  type: 'user.created',
  payload: user,
  metadata: { 
    timestamp: Date.now(),
    userId: user._id 
  }
});

// Handling an event
eventEmitter.on('user.created', (event) => {
  // Update read models
  userReadModel.handleUserCreated(event.payload);
  
  // Trigger other side effects
  notificationService.sendWelcomeEmail(event.payload.email);
});
```

## Database Best Practices

### MongoDB (Write Database)
- Use Mongoose schemas with strict validation
- Include proper indexes for performance
- Implement optimistic concurrency control

### Redis (Read Database)
- Use appropriate data structures (strings, hashes, sets)
- Set reasonable TTLs for cached items
- Implement fallback mechanisms for Redis failures

## Testing

Always write tests for both commands and queries:

1. **Unit Tests**: Test business logic in isolation
2. **Integration Tests**: Test database interactions
3. **End-to-End Tests**: Test API endpoints

## Adding a New Microservice

1. Create a new directory in `/services/`
2. Follow the established structure:
   ```
   /src
     /commands
     /queries
     /models
     /routes
     /middleware
     /config
     /utils
   ```
3. Create a Docker configuration
4. Update API gateway to route appropriate requests
5. Update shared libraries if needed

## Code Style and Standards

- Follow ESLint configuration
- Use async/await for asynchronous code
- Include proper JSDoc comments
- Follow the error handling patterns established
- Keep functions focused and small

## Troubleshooting Common Issues

### Redis Connection Issues
- Check Redis connection string
- Verify Redis server is running
- Ensure proper error handling in Redis configuration

### MongoDB Connection Issues
- Check MongoDB connection string
- Verify network connectivity to MongoDB instance
- Check for proper authentication

### Authentication Failures
- Verify JWT secret matches across services
- Check token expiration settings
- Ensure auth middleware is properly configured
