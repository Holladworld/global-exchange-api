const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Sequelize validation error
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

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: {
        [err.errors[0].path]: 'must be unique',
      },
    });
  }

  // Sequelize database connection error
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Database connection unavailable',
      details: 'Please try again later',
    });
  }

  // External API error (from our custom services)
  if (err.message.includes('External data source unavailable')) {
    return res.status(503).json({
      error: 'External data source unavailable',
      details: err.message.replace('External data source unavailable: ', ''),
    });
  }

  // Country not found (from our controller)
  if (err.message === 'Country not found') {
    return res.status(404).json({
      error: 'Country not found',
    });
  }

  // Default server error (don't leak details in production)
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({
    error: 'Internal server error',
    ...(isProduction ? {} : { details: err.message, stack: err.stack })
  });
};

module.exports = { errorHandler };