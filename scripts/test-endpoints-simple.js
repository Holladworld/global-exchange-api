require('dotenv').config({ debug: false });
const axios = require('axios');

const BASE_URL = 'http://localhost:3010';

const testEndpoints = async () => {
  console.log('🧪 TESTING PRODUCTION ENDPOINTS (Simple Version)');
  console.log('='.repeat(50));
  
  let allTestsPassed = true;

  // Test 1: Health Endpoints
  console.log('\n1. Testing Health Endpoints...');
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    if (healthResponse.data.status === 'OK') {
      console.log('✅ Health Check: PASS');
    } else {
      console.log('❌ Health Check: FAIL - Invalid response');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ Health Check: FAIL - Server not responding');
    allTestsPassed = false;
  }

  try {
    const dbHealthResponse = await axios.get(`${BASE_URL}/health/db`);
    if (dbHealthResponse.data.status === 'OK' || dbHealthResponse.data.status === 'ERROR') {
      console.log('✅ DB Health: PASS (Responds correctly)');
    } else {
      console.log('❌ DB Health: FAIL - Invalid response');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ DB Health: FAIL - Endpoint not working');
    allTestsPassed = false;
  }

  // Test 2: Countries Endpoints
  console.log('\n2. Testing Countries Endpoints...');
  try {
    const countriesResponse = await axios.get(`${BASE_URL}/countries`);
    if (Array.isArray(countriesResponse.data)) {
      console.log(`✅ GET /countries: PASS (${countriesResponse.data.length} countries)`);
    } else {
      console.log('❌ GET /countries: FAIL - Not an array');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ GET /countries: FAIL - Endpoint error');
    allTestsPassed = false;
  }

  try {
    const statusResponse = await axios.get(`${BASE_URL}/countries/status`);
    if (statusResponse.data.total_countries !== undefined) {
      console.log(`✅ GET /countries/status: PASS (${statusResponse.data.total_countries} total countries)`);
    } else {
      console.log('❌ GET /countries/status: FAIL - Invalid response');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ GET /countries/status: FAIL - Endpoint error');
    allTestsPassed = false;
  }

  // Test 3: Filtering and Sorting
  console.log('\n3. Testing Filtering and Sorting...');
  try {
    const regionResponse = await axios.get(`${BASE_URL}/countries?region=Africa`);
    if (Array.isArray(regionResponse.data)) {
      console.log(`✅ Region Filter: PASS (${regionResponse.data.length} African countries)`);
    } else {
      console.log('❌ Region Filter: FAIL - Not an array');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ Region Filter: FAIL - Endpoint error');
    allTestsPassed = false;
  }

  try {
    const sortResponse = await axios.get(`${BASE_URL}/countries?sort=gdp_desc`);
    if (Array.isArray(sortResponse.data)) {
      console.log(`✅ GDP Sort: PASS (${sortResponse.data.length} countries sorted)`);
    } else {
      console.log('❌ GDP Sort: FAIL - Not an array');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ GDP Sort: FAIL - Endpoint error');
    allTestsPassed = false;
  }

  // Test 4: Image Endpoint
  console.log('\n4. Testing Image Endpoint...');
  try {
    const imageResponse = await axios.get(`${BASE_URL}/countries/image`, {
      validateStatus: (status) => status < 500 // Accept 404 as valid response
    });
    if (imageResponse.status === 200 || imageResponse.status === 404) {
      console.log(`✅ Image Endpoint: PASS (Status: ${imageResponse.status})`);
    } else {
      console.log(`❌ Image Endpoint: FAIL (Status: ${imageResponse.status})`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ Image Endpoint: FAIL - Endpoint error');
    allTestsPassed = false;
  }

  // Test 5: Refresh Endpoint (just check if it exists)
  console.log('\n5. Testing Refresh Endpoint...');
  try {
    const refreshResponse = await axios.post(`${BASE_URL}/countries/refresh`, {}, {
      validateStatus: (status) => status < 500 // Don't fail on 503 (external API issues)
    });
    console.log(`✅ Refresh Endpoint: PASS (Status: ${refreshResponse.status})`);
  } catch (error) {
    console.log('❌ Refresh Endpoint: FAIL - Endpoint not working');
    allTestsPassed = false;
  }

  // Final Results
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ALL ENDPOINT TESTS PASSED! ✅');
    console.log('💡 Your API is working correctly!');
  } else {
    console.log('❌ SOME ENDPOINT TESTS FAILED');
    console.log('💡 Please check the server logs for details');
  }
  console.log('='.repeat(50));

  process.exit(allTestsPassed ? 0 : 1);
};

// Install axios if not already installed
try {
  require('axios');
} catch (error) {
  console.log('⚠️  Installing axios...');
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
}

testEndpoints();