require('dotenv').config();
const { sequelize, Country } = require('../models');

const testModel = async () => {
  try {
    console.log('🧪 Testing Country model...');
    
    // Sync just the Country model
    await Country.sync({ force: false });
    console.log('✅ Country model synchronized successfully');
    
    // Test basic model operations
    const testCountry = await Country.create({
      name: 'Test Country',
      capital: 'Test Capital',
      region: 'Test Region',
      population: 1000000,
      currency_code: 'TST',
      exchange_rate: 1.5,
      estimated_gdp: 666666.67,
      flag_url: 'https://example.com/flag.png'
    });
    
    console.log('✅ Country model create operation successful');
    console.log(`✅ Created test country: ${testCountry.name}`);
    
    // Clean up test data
    await testCountry.destroy();
    console.log('✅ Test data cleaned up');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Model test failed:', error.message);
    process.exit(1);
  }
};

testModel();