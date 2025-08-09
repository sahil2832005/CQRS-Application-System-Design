# Getting Started with CQRS Application

This guide will help you set up and run the CQRS Application System Design project on your local machine.

## Quick Start

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- MongoDB (local installation or MongoDB Atlas account)
- Redis (optional, for enhanced read performance)
- Docker and Docker Compose (optional, for containerized deployment)

### Step 1: Clone the Repository

```bash
git clone https://github.com/sahil2832005/CQRS-Application-System-Design.git
cd CQRS-Application-System-Design
```

### Step 2: Set Up Environment Variables

Create environment files for each service:

```bash
# Main environment variables
cp .env.example .env

# User service environment variables
cp services/user-service/.env.example services/user-service/.env
```

Edit the `.env` files to configure:
- Database connections
- JWT secrets
- Service ports
- Other service-specific settings

### Step 3: Install Dependencies

```bash
# Install shared dependencies
cd shared
npm install
cd ..

# Install user service dependencies
cd services/user-service
npm install
cd ../..
```

### Step 4: Start Services (Development Mode)

```bash
# Start user service
cd services/user-service
npm run dev
```

This will start the user service with hot-reloading enabled.

### Step 5: Test the API

Once the services are running, you can test the API endpoints:

```bash
# Register a new user
curl -X POST http://localhost:3001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"Password123!"}'

# Login
curl -X POST http://localhost:3001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

## Docker Deployment (Optional)

To run the entire system using Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running: `mongo --eval "db.serverStatus()"`
- Check connection string in `.env` file
- Ensure network connectivity to MongoDB server

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping`
- The application will fall back to MongoDB if Redis is unavailable
- Set `CACHE_ENABLED=false` in `.env` to disable Redis entirely

### API Gateway Issues

- Check if the API gateway service is running
- Verify routing configuration in the API gateway

## Next Steps

- Explore the API documentation
- Check out the developer guide for more detailed information
- Try implementing a new feature following the CQRS pattern
