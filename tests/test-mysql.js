require('dotenv').config();
const { testConnection } = require('../config/database');

const testMySQL = async () => {
  console.log('🧪 Testing MySQL Connection...\n');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const connected = await testConnection();
  
  if (connected) {
    console.log('✅ MySQL Connection: SUCCESS');
    console.log('💡 Next: Run npm run test:model to test database operations');
    process.exit(0);
  } else {
    console.log('❌ MySQL Connection: FAILED');
    console.log('💡 Please check:');
    console.log('   1. MySQL service is running: sudo systemctl status mysql');
    console.log('   2. Database exists: CREATE DATABASE global_exchange_db;');
    console.log('   3. .env file has correct credentials');
    process.exit(1);
  }
};

testMySQL();