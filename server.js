require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models'); // Updated import

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

// Database check endpoint
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GlobalExchangeAPI - Server is running!',
    version: '1.0.0',
    endpoints: {
      '/health': 'Health check',
      '/health/db': 'Database health check'
    }
  });
});

// Start server with database sync
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Sync database models (creates tables)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false }); // force: true would drop tables - DANGEROUS!
      console.log('✅ Database tables synchronized');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 DB Health check: http://localhost:${PORT}/health/db`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;