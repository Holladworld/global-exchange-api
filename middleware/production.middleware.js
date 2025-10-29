const logger = require('../utils/logger');

// Production-specific security headers
const productionSecurity = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Additional security headers for production
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Log important production events
    if (req.method === 'POST' && req.path === '/countries/refresh') {
      logger.info(`PRODUCTION_REFRESH: Triggered from IP ${req.ip}`);
    }
  }
  next();
};

// Production error handler (REPLACES the regular error handler in production)
const productionErrorHandler = (err, req, res, next) => {
  // Log the error for monitoring
  logger.error('Production Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Handle different error types with production-safe responses
  if (err.name === 'SequelizeValidationError') {
    const details = {};
    err.errors.forEach(error => {
      details[error.path] = error.message;
    });

    return res.status(400).json({
      error: 'Validation failed',
      details: details,
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: {
        [err.errors[0].path]: 'must be unique',
      },
    });
  }

  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Database connection unavailable',
      details: 'Please try again later',
    });
  }

  if (err.message.includes('External data source unavailable')) {
    return res.status(503).json({
      error: 'External data source unavailable',
      details: err.message.replace('External data source unavailable: ', ''),
    });
  }

  if (err.message === 'Country not found') {
    return res.status(404).json({
      error: 'Country not found',
    });
  }

  // Default error - don't expose internal details in production
  const errorResponse = {
    error: 'Internal server error'
  };

  // Only include error ID for tracking (you might want to implement error tracking)
  if (process.env.NODE_ENV === 'production') {
    const errorId = Date.now().toString(36); // Simple error ID
    errorResponse.errorId = errorId;
    logger.error(`Error ID: ${errorId}`, err);
  }

  res.status(500).json(errorResponse);
};

module.exports = { productionSecurity, productionErrorHandler };