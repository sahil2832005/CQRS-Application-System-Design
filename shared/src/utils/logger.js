/**
 * Logger utility for consistent logging across services
 */

const logger = {
  info: (message, context = {}) => {
    console.log(JSON.stringify({ level: 'info', message, context, timestamp: new Date().toISOString() }));
  },
  
  error: (message, error = null, context = {}) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error ? { message: error.message, stack: error.stack } : null,
      context,
      timestamp: new Date().toISOString()
    }));
  },
  
  warn: (message, context = {}) => {
    console.warn(JSON.stringify({ level: 'warn', message, context, timestamp: new Date().toISOString() }));
  },
  
  debug: (message, context = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify({ level: 'debug', message, context, timestamp: new Date().toISOString() }));
    }
  }
};

module.exports = logger;
