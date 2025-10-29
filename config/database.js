const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Import environment configs
const developmentConfig = require('./development');
const productionConfig = require('./production');

const envConfig = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;

// Create MySQL Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'global_exchange_db',
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: envConfig.database.logging,
    pool: envConfig.database.pool,
    dialectOptions: {
      // MySQL specific options
      decimalNumbers: true, // Return numbers as numbers, not strings
    },
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`✅ MySQL ${process.env.NODE_ENV || 'development'} connection established`);
    return true;
  } catch (error) {
    logger.error('❌ Unable to connect to MySQL database:', error.message);
    
    // Helpful error messages
    if (error.original?.code === 'ECONNREFUSED') {
      logger.error('💡 MySQL service might not be running. Start with: sudo systemctl start mysql');
    } else if (error.original?.code === 'ER_ACCESS_DENIED_ERROR') {
      logger.error('💡 Check DB_USER and DB_PASSWORD in .env');
    } else if (error.original?.code === 'ER_BAD_DB_ERROR') {
      logger.error('💡 Create database: CREATE DATABASE global_exchange_db;');
    }
    
    return false;
  }
};

module.exports = { sequelize, testConnection, envConfig };