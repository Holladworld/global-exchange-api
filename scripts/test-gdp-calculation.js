require('dotenv').config();
const dataProcessingService = require('../services/dataProcessingService');

const testGDPCalculation = async () => {
  console.log('🧪 Testing GDP Calculation Logic...\n');
  
  // Test 1: Basic GDP calculation
  console.log('1. Testing GDP calculation with various inputs:');
  dataProcessingService.testGDPCalculation();

  // Test 2: Test with real currency codes
  console.log('\n2. Testing with real currency scenarios:');
  const testScenarios = [
    {
      name: 'Nigeria',
      population: 206139589,
      currencies: [{ code: 'NGN', name: 'Naira', symbol: '₦' }],
      expectedRate: 1600 // Approximate NGN rate
    },
    {
      name: 'United States', 
      population: 331002651,
      currencies: [{ code: 'USD', name: 'Dollar', symbol: '$' }],
      expectedRate: 1
    },
    {
      name: 'Country with no currency',
      population: 1000000,
      currencies: [],
      expectedRate: null
    }
  ];

  // Mock exchange rates for testing
  const mockExchangeRates = {
    'NGN': 1600,
    'USD': 1,
    'EUR': 0.85
  };

  for (const scenario of testScenarios) {
    const processed = await dataProcessingService.processCountryData(scenario, mockExchangeRates);
    console.log(`   ${scenario.name}:`);
    console.log(`      Currency: ${processed.currency_code}`);
    console.log(`      Exchange Rate: ${processed.exchange_rate}`);
    console.log(`      Estimated GDP: ${processed.estimated_gdp}`);
    console.log(`      Valid: ${processed.estimated_gdp !== undefined ? '✅' : '❌'}`);
  }

  console.log('\n🎯 GDP Calculation Test Complete!');
};

testGDPCalculation();