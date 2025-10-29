require('dotenv').config();
const { testConnection } = require('../config/database');
const logger = require('../utils/logger');

const testProduction = async () => {
  console.log('🧪 Testing Production Configuration...\n');
  
  // Check environment
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  Running in development mode. Use: NODE_ENV=production npm test:production');
  }
  
  // Test database connection
  console.log('\n1. Testing Database Connection...');
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.log('❌ Database test failed');
    process.exit(1);
  }
  
  // Test environment variables
  console.log('\n2. Testing Environment Variables...');
  const requiredEnvVars = [
    'NODE_ENV',
    'DB_HOST', 
    'DB_NAME',
    'DB_USER',
    'COUNTRIES_API_URL',
    'EXCHANGE_API_URL'
  ];
  
  let allEnvVarsPresent = true;
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      console.log(`   ❌ Missing: ${envVar}`);
      allEnvVarsPresent = false;
    } else {
      console.log(`   ✅ ${envVar}: ${envVar.includes('PASSWORD') ? '***' : process.env[envVar]}`);
    }
  });
  
  if (!allEnvVarsPresent) {
    console.log('❌ Missing required environment variables');
    process.exit(1);
  }
  
  // Test server startup
  console.log('\n3. Testing Server Startup...');
  try {
    const app = require('../server');
    console.log('   ✅ Server module loads correctly');
  } catch (error) {
    console.log(`   ❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }
  
  console.log('\n🎯 Production Configuration Test: PASSED ✅');
  console.log('💡 Ready for deployment!');
  process.exit(0);
};

testProduction();