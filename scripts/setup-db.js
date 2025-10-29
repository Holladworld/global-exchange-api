require('dotenv').config();
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

const setupDatabase = async () => {
  try {
    logger.info('🚀 Setting up database for Railway...');
    
    // Test connection
    await sequelize.authenticate();
    logger.info('✅ Database connection successful');
    
    // Sync models (creates tables)
    await sequelize.sync({ force: false });
    logger.info('✅ Database tables synchronized');
    
    logger.info('🎯 Database setup complete!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();