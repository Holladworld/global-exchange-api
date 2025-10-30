require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

// Import routes
const countryRoutes = require('./routes/countryRoutes');

const app = express();
const PORT = process.env.PORT || 3010;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://global-exchange-api-production.up.railway.app'
];

if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(
    'https://global-exchange-api-production.up.railway.app',
    'https://*.railway.app'
  );
}

app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

// API Routes
app.use('/countries', countryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'GlobalExchangeAPI is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GlobalExchangeAPI - Production Ready',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      'GET /health': 'Health check',
      'POST /countries/refresh': 'Refresh country data',
      'GET /countries': 'Get all countries with filtering',
      'GET /countries/:name': 'Get specific country',
      'DELETE /countries/:name': 'Delete country',
      'GET /countries/status': 'Get API status',
      'GET /countries/image': 'Get summary image'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      logger.info('Database synchronized');
    }

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;