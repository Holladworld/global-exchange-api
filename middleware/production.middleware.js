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

// Production error handling (don't leak stack traces)
const productionErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Don't expose error details in production
    if (err.statusCode >= 500) {
      logger.error('Production Error:', {
        message: err.message,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      
      return res.status(err.statusCode || 500).json({
        error: 'Internal server error'
      });
    }
  }
  next(err);
};

module.exports = { productionSecurity, productionErrorHandler };