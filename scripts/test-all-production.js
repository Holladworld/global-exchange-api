require('dotenv').config({ debug: false });
const { testConnection } = require('../config/database');
const logger = require('../utils/logger');

const testAllProduction = async () => {
  console.log('🧪 COMPREHENSIVE PRODUCTION TEST SUITE\n');
  console.log('=' .repeat(50));

  let allTestsPassed = true;

  // Test 1: Environment
  console.log('\n1. ✅ Testing Environment...');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${process.env.PORT || 3010}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('   ⚠️  Running in development mode. Use: NODE_ENV=production npm run test:production');
  }

  // Test 2: Database Connection
  console.log('\n2. ✅ Testing Database Connection...');
  try {
    const dbConnected = await testConnection();
    if (dbConnected) {
      console.log('   ✅ MySQL connection successful');
    } else {
      console.log('   ❌ MySQL connection failed');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ Database test error: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 3: Required Environment Variables
  console.log('\n3. ✅ Testing Environment Variables...');
  const requiredEnvVars = [
    'NODE_ENV',
    'DB_HOST', 
    'DB_NAME',
    'DB_USER',
    'COUNTRIES_API_URL',
    'EXCHANGE_API_URL'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      console.log(`   ❌ Missing: ${envVar}`);
      allTestsPassed = false;
    } else {
      const value = envVar.includes('PASSWORD') ? '***' : process.env[envVar];
      console.log(`   ✅ ${envVar}: ${value}`);
    }
  });

  // Test 4: Server Module Loading
  console.log('\n4. ✅ Testing Server Module...');
  try {
    const app = require('../server');
    console.log('   ✅ Server module loads correctly');
    
    // Test basic server functionality
    if (app && typeof app.listen === 'function') {
      console.log('   ✅ Server has required methods');
    } else {
      console.log('   ❌ Server missing required methods');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ Server module failed: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 5: External APIs (quick check)
  console.log('\n5. ✅ Testing External API URLs...');
  try {
    const countriesUrl = new URL(process.env.COUNTRIES_API_URL);
    const exchangeUrl = new URL(process.env.EXCHANGE_API_URL);
    console.log('   ✅ Countries API URL: Valid');
    console.log('   ✅ Exchange API URL: Valid');
  } catch (error) {
    console.log('   ❌ Invalid API URLs in environment');
    allTestsPassed = false;
  }

  // Test 6: Security Configuration
  console.log('\n6. ✅ Testing Security Configuration...');
  if (process.env.ALLOWED_ORIGINS) {
    console.log('   ✅ CORS origins configured');
  } else {
    console.log('   ⚠️  No CORS origins configured (using localhost)');
  }

  // Final Results
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ALL PRODUCTION TESTS PASSED! ✅');
    console.log('💡 Ready for deployment to Railway!');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('💡 Please fix the issues above before deployment');
  }
  console.log('='.repeat(50));

  process.exit(allTestsPassed ? 0 : 1);
};

// Run tests
testAllProduction();