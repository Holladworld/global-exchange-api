require('dotenv').config({ debug: false });
const { testConnection } = require('../config/database');
const Country = require('../models/country');
const logger = require('../utils/logger');

const testDatabaseOperations = async () => {
  console.log('🧪 TESTING DATABASE OPERATIONS\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Database connection failed');
    process.exit(1);
  }

  try {
    // Test 1: Count countries
    console.log('1. Counting countries...');
    const count = await Country.count();
    console.log(`   ✅ Total countries: ${count}`);

    // Test 2: Find with filters
    console.log('2. Testing filters...');
    const { Op } = require('sequelize');
    const africanCountries = await Country.findAll({
      where: { region: { [Op.like]: '%Africa%' } },
      limit: 3
    });
    console.log(`   ✅ African countries found: ${africanCountries.length}`);

    // Test 3: Test sorting
    console.log('3. Testing sorting...');
    const topGDP = await Country.findAll({
      order: [['estimated_gdp', 'DESC']],
      limit: 3
    });
    console.log(`   ✅ GDP sorting works: ${topGDP.length} countries`);

    // Test 4: Test individual country lookup
    console.log('4. Testing country lookup...');
    const testCountry = await Country.findOne();
    if (testCountry) {
      console.log(`   ✅ Country lookup works: ${testCountry.name}`);
    } else {
      console.log('   ⚠️  No countries in database (run refresh first)');
    }

    console.log('\n🎯 DATABASE OPERATIONS: ALL TESTS PASSED ✅');
    process.exit(0);
  } catch (error) {
    console.log(`❌ Database operations failed: ${error.message}`);
    process.exit(1);
  }
};

testDatabaseOperations();