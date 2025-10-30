require('dotenv').config();
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
    docs: 'https://github.com/yourusername/global-exchange-api'
  });
});

// Start server - CRITICAL FOR RAILWAY
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync(); // Create tables if needed
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Production server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();