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
const PORT = process.env.PORT || 8080; // Railway provides PORT

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
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

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

app.use('/countries', validateCountryQuery, countryRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'GlobalExchangeAPI - Server is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      '/health': 'Health check',
      '/health/db': 'Database health check',
      'POST /countries/refresh': 'Refresh country data',
      'GET /countries': 'Get all countries (with filters)',
      'GET /countries/:name': 'Get specific country',
      'DELETE /countries/:name': 'Delete country',
      'GET /countries/status': 'Get API status',
      'GET /countries/image': 'Get summary image'
    },
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found', 
    path: req.originalUrl, 
    method: req.method 
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(productionErrorHandler);
} else {
  app.use(errorHandler);
}

// START SERVER - IMPROVED VERSION
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Port: ${PORT}`);
    
    // Test database connection with retry logic
    let dbConnected = false;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!dbConnected && retryCount < maxRetries) {
      try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
        dbConnected = true;
        
        // Sync database in production (use carefully)
        if (process.env.NODE_ENV === 'production') {
          console.log('🔄 Syncing database models...');
          await sequelize.sync({ alter: true }); // Use { force: true } only in development!
          console.log('✅ Database models synchronized');
        }
      } catch (dbError) {
        retryCount++;
        console.log(`⚠️ Database connection attempt ${retryCount} failed: ${dbError.message}`);
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying in 5 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          console.log('❌ Max database connection retries reached, starting without DB');
          console.log('💡 Check your Railway MySQL environment variables:');
          console.log('   - MYSQLHOST');
          console.log('   - MYSQLPORT'); 
          console.log('   - MYSQLDATABASE');
          console.log('   - MYSQLUSER');
          console.log('   - MYSQLPASSWORD');
        }
      }
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (dbConnected) {
        console.log('✅ Database: Connected');
      } else {
        console.log('⚠️ Database: Not connected - running in limited mode');
      }
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT. Shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM. Shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();

module.exports = app;