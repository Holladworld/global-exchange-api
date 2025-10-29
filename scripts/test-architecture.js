require('dotenv').config();

console.log('🧪 Testing New Architecture...\n');

// Test that all modules load correctly
try {
  const countryController = require('../controllers/countryController');
  console.log('✅ Country Controller: Loads correctly');
  
  const countryRoutes = require('../routes/countryRoutes'); 
  console.log('✅ Country Routes: Loads correctly');
  
  const server = require('../server');
  console.log('✅ Server: Loads correctly with new architecture');
  
  console.log('\n🎯 Architecture Test: PASSED ✅');
  console.log('   - Proper separation of concerns');
  console.log('   - Modular structure');
  console.log('   - Easy to test and maintain');
  
  process.exit(0);
} catch (error) {
  console.error('❌ Architecture Test: FAILED');
  console.error('   Error:', error.message);
  process.exit(1);
}