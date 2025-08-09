# CQRS Application System Design

This repository contains a Node.js application built following the CQRS (Command Query Responsibility Segregation) pattern with a microservices architecture.

## Architecture Overview

- **CQRS Pattern**: Separates read (Query) and write (Command) operations
- **Microservices**: Domain-driven services with separate concerns
- **API Gateway**: Central entry point for all client requests
- **Worker Processes**: For handling background tasks
- **Socket Server**: For real-time communications
- **Security**: Implemented with Nginx, JWT, and best practices
- **Containerization**: Using Docker for consistent deployment

## Folder Structure

- `/api-gateway`: API Gateway service (Express.js)
- `/services`: Contains all domain microservices
  - `/user-service`: User management service
  - `/order-service`: Order management service
- `/workers`: Background job workers
- `/socket-server`: Real-time communication server
- `/nginx`: Nginx configuration for reverse proxy and security
- `/docker`: Docker configuration files
- `/shared`: Shared libraries, utilities, and DTOs

## Getting Started

Instructions for setting up and running the project will go here.
