const { Sequelize } = require('sequelize');

// Use Railway's environment variables or fallback
const dbConfig = {
  database: process.env.MYSQLDATABASE || 'global_exchange_db',
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  host: process.env.MYSQLHOST || 'localhost',
  port: process.env.MYSQLPORT || 3306,
};

console.log('🔧 Database Configuration:', {
  host: dbConfig.host,
  database: dbConfig.database
});

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username, 
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    logging: false, // Disable SQL logging
    retry: { max: 2 },
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    return true;
  } catch (error) {
    console.log('⚠️ Database connection failed:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };