// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const countryRoutes = require('./routes/countryRoutes');

const app = express();
const PORT = process.env.PORT || 3010;

// Essential middleware only
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Health check (essential for Railway)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/countries', countryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'GlobalExchangeAPI', 
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'POST /countries/refresh', 
      'GET /countries',
      'GET /countries/:name',
      'DELETE /countries/:name',
      'GET /countries/status',
      'GET /countries/image'
    ]
  });
});

// Handle missing cache directory for images
const fs = require('fs');
const cacheDir = './cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Start server - CRITICAL FOR RAILWAY
const startServer = async () => {
  try {
    console.log('🚀 Starting GlobalExchangeAPI...');
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Port: ${PORT}`);
    
    // Database connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync database (create tables if needed)
    await sequelize.sync();
    console.log('✅ Database synchronized');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎯 Server running on port ${PORT}`);
      console.log(`📍 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;