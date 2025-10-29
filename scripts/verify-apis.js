const axios = require('axios');

const verifyAPIs = async () => {
  console.log('🔍 Verifying External APIs...\n');

  // Test Countries API
  console.log('1. Testing REST Countries API...');
  try {
    const countriesResponse = await axios.get('https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies');
    console.log('✅ REST Countries API: WORKING');
    console.log(`   📊 Total countries: ${countriesResponse.data.length}`);
    console.log(`   🎯 Sample: ${countriesResponse.data[0].name} (${countriesResponse.data[0].currencies[0]?.code || 'No currency'})`);
  } catch (error) {
    console.log('❌ REST Countries API: FAILED');
    console.log(`   💡 Error: ${error.message}`);
  }

  // Test Exchange Rates API
  console.log('\n2. Testing Open Exchange Rates API...');
  try {
    const exchangeResponse = await axios.get('https://open.er-api.com/v6/latest/USD');
    console.log('✅ Open Exchange Rates API: WORKING');
    console.log(`   📊 Total currencies: ${Object.keys(exchangeResponse.data.rates).length}`);
    console.log(`   💰 Sample rates: USD=1, EUR=${exchangeResponse.data.rates.EUR}`);
  } catch (error) {
    console.log('❌ Open Exchange Rates API: FAILED');
    console.log(`   💡 Error: ${error.message}`);
  }
};

verifyAPIs();