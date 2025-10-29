require('dotenv').config();
const logger = require('../utils/logger');

// Set production environment
process.env.NODE_ENV = 'production';

logger.info('Starting GlobalExchangeAPI in PRODUCTION mode...');
logger.info('Environment: production');
logger.info('Starting server...');

// Import and start the server
require('../server');