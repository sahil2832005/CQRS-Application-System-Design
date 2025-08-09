/**
 * Base DTO class for data transfer objects
 */
class BaseDTO {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  toJSON() {
    return { ...this };
  }
}

/**
 * User DTO for transferring user data between services
 */
class UserDTO extends BaseDTO {
  constructor(data = {}) {
    super();
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    // Remove sensitive data
    delete this.password;
  }
}

/**
 * Error DTO for standardizing error responses
 */
class ErrorDTO extends BaseDTO {
  constructor(message, code, details = null) {
    super();
    this.message = message;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = {
  BaseDTO,
  UserDTO,
  ErrorDTO
};
