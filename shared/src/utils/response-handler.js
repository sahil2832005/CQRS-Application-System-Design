/**
 * HTTP response handler for consistent API responses
 */

class ResponseHandler {
  /**
   * Send a success response
   * 
   * @param {object} res - Express response object
   * @param {any} data - Response data
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   */
  static success(res, data = null, statusCode = 200, message = 'Success') {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send an error response
   * 
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {object} errors - Additional error details
   */
  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send a not found error response
   * 
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  /**
   * Send a validation error response
   * 
   * @param {object} res - Express response object
   * @param {object} errors - Validation errors
   * @param {string} message - Error message
   */
  static validationError(res, errors, message = 'Validation failed') {
    return this.error(res, message, 400, errors);
  }
}

module.exports = ResponseHandler;
