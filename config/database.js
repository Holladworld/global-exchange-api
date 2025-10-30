const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const env = process.env.NODE_ENV || 'development';

let databaseConfig;

if (env === 'production') {
  databaseConfig = {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    }
  };
} else {
  databaseConfig = {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  };
}

// Use DATABASE_URL from environment (Railway provides this)
const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;


if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in the environment');
}

logger.info(`Initializing database for ${env} environment`);

const sequelize = new Sequelize(databaseUrl, databaseConfig);

module.exports = { sequelize };