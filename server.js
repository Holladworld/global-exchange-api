require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const morgan = require('morgan');

// Install morgan for HTTP logging
// npm install morgan

// Import routes and middleware
const countryRoutes = require('./routes/countryRoutes');
const { errorHandler } = require('./middleware/error.middleware');
const { validateCountryQuery } = require('./middleware/validation.middleware');

const app = express();
const PORT = process.env.PORT || 3010;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

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
      'GET /countries/status': 'Get API status and statistics'
    },
    query_parameters: {
      'region': 'Filter by region (e.g., Africa, Europe)',
      'currency': 'Filter by currency code (e.g., USD, EUR)',
      'sort': 'Sort by: gdp_desc, gdp_asc, population_desc, population_asc, name_asc, name_desc'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  logger.warn(`404 - Endpoint not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware (MUST be last)
app.use(errorHandler);

// Start server with database sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      logger.info('Database tables synchronized');
    }

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
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