/**
 * Common constants used across services
 */

module.exports = {
  // General
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // Event Types for inter-service communication
  EVENTS: {
    USER: {
      CREATED: 'user.created',
      UPDATED: 'user.updated',
      DELETED: 'user.deleted'
    },
    ORDER: {
      CREATED: 'order.created',
      UPDATED: 'order.updated',
      PAID: 'order.paid',
      SHIPPED: 'order.shipped',
      DELIVERED: 'order.delivered',
      CANCELED: 'order.canceled'
    }
  }
};
