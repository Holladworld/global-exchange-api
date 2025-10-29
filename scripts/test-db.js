require('dotenv').config();
const { testConnection } = require('../config/database');

const testDbConnection = async () => {
  console.log('🧪 Testing database connection...');
  const connected = await testConnection();
  
  if (connected) {
    console.log('✅ Database test PASSED');
    process.exit(0);
  } else {
    console.log('❌ Database test FAILED - Please check your MySQL setup');
    process.exit(1);
  }
};

testDbConnection();