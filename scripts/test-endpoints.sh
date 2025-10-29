#!/bin/bash

echo "🧪 TESTING PRODUCTION ENDPOINTS"
echo "================================"

BASE_URL="http://localhost:3010"

# Test Health Endpoints
echo "1. Testing Health Endpoints..."
curl -s "$BASE_URL/health" | jq '.status' | grep -q "OK" && echo "✅ Health Check: PASS" || echo "❌ Health Check: FAIL"
curl -s "$BASE_URL/health/db" | jq '.status' | grep -q "OK" && echo "✅ DB Health: PASS" || echo "❌ DB Health: FAIL"

# Test Countries Endpoints
echo -e "\n2. Testing Countries Endpoints..."
curl -s "$BASE_URL/countries" | jq 'length' && echo "✅ GET /countries: PASS" || echo "❌ GET /countries: FAIL"
curl -s "$BASE_URL/countries/status" | jq '.total_countries' && echo "✅ GET /countries/status: PASS" || echo "❌ GET /countries/status: FAIL"

# Test Filtering
echo -e "\n3. Testing Filtering..."
curl -s "$BASE_URL/countries?region=Africa" | jq 'length' > /dev/null && echo "✅ Region Filter: PASS" || echo "❌ Region Filter: FAIL"
curl -s "$BASE_URL/countries?sort=gdp_desc" | jq 'length' > /dev/null && echo "✅ GDP Sort: PASS" || echo "❌ GDP Sort: FAIL"

# Test Image Endpoint
echo -e "\n4. Testing Image Endpoint..."
curl -s -I "$BASE_URL/countries/image" | head -n 1 | grep -q "404\|200" && echo "✅ Image Endpoint: RESPONDS" || echo "❌ Image Endpoint: FAIL"

echo -e "\n🎯 ENDPOINT TESTING COMPLETE"