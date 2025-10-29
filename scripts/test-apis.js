require('dotenv').config();
const countriesService = require('../services/countriesService');
const exchangeService = require('../services/exchangeService');

const testAPIs = async () => {
  console.log('🧪 Testing External APIs...\n');

  // Test Countries API
  console.log('1. Testing Countries API...');
  const countriesResult = await countriesService.testConnection();
  
  if (countriesResult.success) {
    console.log('✅ Countries API: SUCCESS');
    console.log(`   📊 Countries fetched: ${countriesResult.count}`);
    console.log(`   🎯 Sample country: ${countriesResult.sample.name}`);
  } else {
    console.log('❌ Countries API: FAILED');
    console.log(`   💡 Error: ${countriesResult.error}`);
  }

  console.log('\n2. Testing Exchange Rates API...');
  const exchangeResult = await exchangeService.testConnection();
  
  if (exchangeResult.success) {
    console.log('✅ Exchange Rates API: SUCCESS');
    console.log(`   📊 Currencies fetched: ${exchangeResult.count}`);
    console.log(`   💰 Sample rates: USD=${exchangeResult.sample.USD}, EUR=${exchangeResult.sample.EUR}`);
  } else {
    console.log('❌ Exchange Rates API: FAILED');
    console.log(`   💡 Error: ${exchangeResult.error}`);
  }

  console.log('\n🎯 API Test Summary:');
  console.log(`   Countries API: ${countriesResult.success ? '✅' : '❌'}`);
  console.log(`   Exchange API: ${exchangeResult.success ? '✅' : '❌'}`);

  // Exit with appropriate code
  process.exit(countriesResult.success && exchangeResult.success ? 0 : 1);
};

testAPIs();