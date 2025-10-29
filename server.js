// Load environment variables (this should not show debug messages)
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const morgan = require('morgan');

// Import routes and middleware
const countryRoutes = require('./routes/countryRoutes');
const { errorHandler } = require('./middleware/error.middleware');
const { validateCountryQuery } = require('./middleware/validation.middleware');
const { productionSecurity, productionErrorHandler } = require('./middleware/production.middleware');

const app = express();
const PORT = process.env.PORT || 3010;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Performance middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    error: 'Too many requests, please try again later'
  }
});
app.use(limiter);

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Production security middleware
app.use(productionSecurity);

// HTTP request logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logger.stream }));

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    logger.info('Database health check passed');
    res.status(200).json({ 
      status: 'OK', 
      message: 'Database connection healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Database health check failed:', error.message);
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes with validation middleware
app.use('/countries', validateCountryQuery, countryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.json({
    message: 'GlobalExchangeAPI - Server is running!',
    version: '1.0.0',
    endpoints: {
      '/health': 'Health check',
      '/health/db': 'Database health check',
      'POST /countries/refresh': 'Refresh country data from external APIs',
      'GET /countries': 'Get all countries (supports ?region, ?currency, ?sort)',
      'GET /countries/:name': 'Get specific country by name',
      'DELETE /countries/:name': 'Delete country by name',
      'GET /countries/status': 'Get API status and statistics',
      'GET /countries/image': 'Get summary image'
    },
    query_parameters: {
      'region': 'Filter by region (e.g., Africa, Europe)',
      'currency': 'Filter by currency code (e.g., USD, EUR)',
      'sort': 'Sort by: gdp_desc, gdp_asc, population_desc, population_asc, name_asc, name_desc'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  logger.warn(`404 - Endpoint not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware
if (process.env.NODE_ENV === 'production') {
  app.use(productionErrorHandler);
} else {
  app.use(errorHandler);
}

// Start server with database sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info(` ${process.env.NODE_ENV || 'development'} database connection established`);

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      logger.info('Development database synchronized');
    } else {
      logger.info('Production database connected');
    }

    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API Base: http://localhost:${PORT}/countries`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;