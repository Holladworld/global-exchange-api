// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3010;

// Basic middleware
app.use(express.json());

// Health check - ALWAYS WORKS
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GlobalExchangeAPI is running',
    timestamp: new Date().toISOString()
  });
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'GlobalExchangeAPI', 
    version: '1.0.0',
    status: 'running'
  });
});

// Start server with basic error handling
const startServer = async () => {
  try {
    console.log('🚀 Starting GlobalExchangeAPI...');
    
    // Try database connection (but don't crash if it fails)
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected');
      await sequelize.sync();
      console.log('✅ Database synchronized');
    } catch (dbError) {
      console.log('⚠️ Database connection failed, but continuing without DB');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎯 Server running on port ${PORT}`);
      console.log(`📍 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Critical startup error:', error.message);
    // Don't exit - keep the server running
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🔄 Server running in fallback mode on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;