# User Service

This microservice handles user management, authentication, and authorization using the CQRS pattern.

## CQRS Implementation

The User Service implements CQRS (Command Query Responsibility Segregation) by separating read and write operations:

- **Commands**: Handle write operations in `src/commands/`
  - Persist data to MongoDB (primary datastore)
  - Emit events when state changes
  
- **Queries**: Handle read operations in `src/queries/`
  - Retrieve data from Redis (fast read cache)
  - Fall back to MongoDB when Redis is unavailable

## Technical Architecture

### Database Separation

- **Write DB**: MongoDB - Used for durable storage of user data
- **Read DB**: Redis - Used for fast retrieval of user data

### Key Components

1. **Commands**: Handle state changes
   - `createUser.js`: User registration
   - `updateUser.js`: Profile updates
   - `deleteUser.js`: Account deletion

2. **Queries**: Handle data retrieval
   - `getUser.js`: Get user by ID
   - `listUsers.js`: List users with pagination
   - `userReadModel.js`: Read model with caching logic

3. **Models**: Data schemas
   - `user.js`: Mongoose schema for users

4. **Middleware**: Request processing
   - `auth.js`: Authentication middleware
   - `validation.js`: Request validation

5. **Config**: Service configuration
   - `db.js`: MongoDB connection
   - `redis.js`: Redis connection with fallback mechanisms

## API Endpoints

### Authentication
- `POST /api/v1/users/register`: Register a new user
- `POST /api/v1/users/login`: Authenticate user and get token
- `POST /api/v1/users/logout`: Invalidate user token

### User Management
- `GET /api/v1/users/me`: Get current user profile
- `PUT /api/v1/users/me`: Update current user profile
- `DELETE /api/v1/users/me`: Delete current user account

### Admin Endpoints
- `GET /api/v1/users`: List all users (paginated)
- `GET /api/v1/users/:id`: Get user by ID
- `PUT /api/v1/users/:id`: Update user by ID
- `DELETE /api/v1/users/:id`: Delete user by ID
- `GET /api/v1/users/search`: Search users

## Environment Variables

```
# Server
PORT=3001
NODE_ENV=development
API_PREFIX=/api/v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/user-service

# Redis
REDIS_URI=redis://localhost:6379
CACHE_ENABLED=true

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=1d
```

## Error Handling

The service implements a centralized error handling mechanism with:
- Custom error classes
- Consistent error responses
- Detailed logging for debugging

## Fallback Mechanisms

Redis connectivity issues are handled gracefully:
- Automatic fallback to MongoDB when Redis is unavailable
- Graceful handling of Redis connection errors
- Cached operations retry with progressive backoff

## Testing

- Unit tests: `npm test`
- Integration tests: `npm run test:integration`
- Manual testing script: `node test-cqrs.js`

## Development Notes

- Redis is optional but recommended for production use
- MongoDB connection is required
- The service will work without Redis, falling back to MongoDB for all operations
