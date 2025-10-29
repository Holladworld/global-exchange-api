require('dotenv').config({ debug: false });

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
const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { error: 'Too many requests, please try again later' }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(productionSecurity);
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/health/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'OK', message: 'Database connection healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'ERROR', message: 'Database connection failed', error: error.message });
  }
});

app.use('/countries', validateCountryQuery, countryRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'GlobalExchangeAPI - Server is running!',
    version: '1.0.0',
    endpoints: {
      '/health': 'Health check',
      '/health/db': 'Database health check',
      'POST /countries/refresh': 'Refresh country data',
      'GET /countries': 'Get all countries (with filters)',
      'GET /countries/:name': 'Get specific country',
      'DELETE /countries/:name': 'Delete country',
      'GET /countries/status': 'Get API status',
      'GET /countries/image': 'Get summary image'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl, method: req.method });
});

if (process.env.NODE_ENV === 'production') {
  app.use(productionErrorHandler);
} else {
  app.use(errorHandler);
}

// START SERVER - SINGLE VERSION
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.log('⚠️ Database connection failed, continuing startup');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;