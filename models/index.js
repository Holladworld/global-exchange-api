const { sequelize } = require('../config/database');
const Country = require('./country');

// Initialize models
const models = {
  Country,
};

// Sync all models with database
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Failed to sync database models:', error);
  }
};

module.exports = {
  sequelize,
  ...models,
  syncModels,
};