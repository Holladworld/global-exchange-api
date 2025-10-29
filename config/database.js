const { Sequelize } = require('sequelize');

// Use Railway's environment variables
const dbConfig = {
  database: process.env.MYSQLDATABASE || 'railway',
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  host: process.env.MYSQLHOST || 'containers-us-west-146.railway.app',
  port: process.env.MYSQLPORT || 7259,
};

console.log('🔧 Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username ? '***' : 'missing'
});

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username, 
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    retry: {
      max: 3,
      timeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected to Railway MySQL');
    return true;
  } catch (error) {
    console.log('⚠️ Database connection failed:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };