const { Sequelize } = require('sequelize');

// Use Railway's environment variables
const dbConfig = {
  database: process.env.MYSQLDATABASE || 'railway',
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  host: process.env.MYSQLHOST || 'containers-us-west-146.railway.app',
  port: process.env.MYSQLPORT || 3306,
};

console.log('🔧 Database Config:', {
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
    logging: false,
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