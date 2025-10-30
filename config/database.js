const { Sequelize } = require('sequelize');

// Railway provides DATABASE_URL or separate MySQL vars
const sequelize = new Sequelize(
  process.env.DB_NAME || 'railway',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // No SQL logs in production
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    }
  }
);

module.exports = { sequelize };