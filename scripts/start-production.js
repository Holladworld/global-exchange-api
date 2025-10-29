require('dotenv').config();
const logger = require('../utils/logger');

logger.info('🚀 Starting GlobalExchangeAPI in production mode...');

// Set production environment
process.env.NODE_ENV = 'production';

// Startserver
require('../server');