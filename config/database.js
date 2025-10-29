const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Create MySQL Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, 
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? 
      (msg) => logger.debug(`SQL: ${msg}`) : false,
    pool: {
      max: process.env.NODE_ENV === 'production' ? 10 : 5,
      min: process.env.NODE_ENV === 'production' ? 2 : 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
    },
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`✅ MySQL connection established to database: ${process.env.DB_NAME}`);
    return true;
  } catch (error) {
    logger.error(`❌ MySQL connection failed for user ${process.env.DB_USER}@${process.env.DB_HOST}:`, error.message);
    
    // Specific error messages
    if (error.original?.code === 'ER_ACCESS_DENIED_ERROR') {
      logger.error('💡 Check DB_USER and DB_PASSWORD in .env file');
    } else if (error.original?.code === 'ER_BAD_DB_ERROR') {
      logger.error(`💡 Database '${process.env.DB_NAME}' doesn't exist. Create it first.`);
    } else if (error.original?.code === 'ECONNREFUSED') {
      logger.error('💡 MySQL service might not be running. Start with: sudo systemctl start mysql');
    }
    
    return false;
  }
};

module.exports = { sequelize, testConnection };