require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

// Import routes
const countryRoutes = require('./routes/countryRoutes');

const app = express();
const PORT = process.env.PORT || 3010;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
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
    res.status(200).json({ 
      status: 'OK', 
      message: 'Database connection healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/countries', countryRoutes);

// Root endpoint - UPDATED WITH COMPLETE DOCUMENTATION
app.get('/', (req, res) => {
  res.json({
    message: 'GlobalExchangeAPI - Server is running!',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Server health check',
      'GET /health/db': 'Database connection health check',
      'POST /countries/refresh': 'Fetch and update all country data from external APIs',
      'GET /countries': 'Get all countries with filtering and sorting',
      'GET /countries/:name': 'Get specific country by name',
      'DELETE /countries/:name': 'Delete country by name', 
      'GET /countries/status': 'Get API statistics and last refresh timestamp'
    },
    query_parameters: {
      'GET /countries': {
        'region': 'Filter by region (e.g., Africa, Europe, Asia)',
        'currency': 'Filter by currency code (e.g., USD, EUR, NGN)',
        'sort': 'Sort results: gdp_desc, gdp_asc, population_desc, population_asc, name_asc, name_desc'
      }
    },
    examples: {
      'Filter African countries': '/countries?region=Africa',
      'Sort by GDP descending': '/countries?sort=gdp_desc',
      'European countries with EUR': '/countries?region=Europe&currency=EUR',
      'Get specific country': '/countries/Nigeria',
      'API status': '/countries/status'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: {
      'GET /': 'This documentation',
      'GET /health': 'Server health check', 
      'GET /health/db': 'Database health check',
      'POST /countries/refresh': 'Refresh country data',
      'GET /countries': 'Get countries with filters',
      'GET /countries/:name': 'Get specific country',
      'DELETE /countries/:name': 'Delete country',
      'GET /countries/status': 'Get API status'
    }
  });
});

// Start server with database sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('✅ Database tables synchronized');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API Documentation: http://localhost:${PORT}/`);
      console.log(`📍 API Base: http://localhost:${PORT}/countries`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;