const Country = require('../models/country');
const countriesService = require('./countriesService');
const exchangeService = require('./exchangeService');

class DataProcessingService {
  calculateEstimatedGDP(population, exchangeRate) {
    if (!exchangeRate || exchangeRate <= 0) {
      return 0;
    }

    // Random multiplier between 1000-2000 as required
    const randomMultiplier = Math.floor(Math.random() * 1001) + 1000;
    const gdp = (population * randomMultiplier) / exchangeRate;
    
    return parseFloat(gdp.toFixed(2)); // Round to 2 decimal places
  }

  async processCountryData(countryData, exchangeRates) {
    const currencyCode = countriesService.extractCurrencyCode(countryData.currencies);
    const exchangeRate = currencyCode ? exchangeRates[currencyCode] : null;
    
    const estimated_gdp = this.calculateEstimatedGDP(
      countryData.population,
      exchangeRate
    );

    return {
      name: countryData.name,
      capital: countryData.capital || null,
      region: countryData.region || null,
      population: countryData.population,
      currency_code: currencyCode,
      exchange_rate: exchangeRate,
      estimated_gdp: estimated_gdp,
      flag_url: countryData.flag || null,
      last_refreshed_at: new Date(),
    };
  }

  async refreshAllCountries() {
    console.log('🔄 Starting countries refresh process...');
    
    let exchangeRates;
    let countriesData;

    // Step 1: Fetch exchange rates
    try {
      exchangeRates = await exchangeService.getValidExchangeRates();
      console.log(`✅ Fetched ${Object.keys(exchangeRates).length} exchange rates`);
    } catch (error) {
      console.error('❌ Failed to fetch exchange rates:', error.message);
      throw new Error('External data source unavailable: Could not fetch data from exchange API');
    }

    // Step 2: Fetch countries data
    try {
      countriesData = await countriesService.fetchAllCountries();
      console.log(`✅ Fetched ${countriesData.length} countries`);
    } catch (error) {
      console.error('❌ Failed to fetch countries:', error.message);
      throw new Error('External data source unavailable: Could not fetch data from countries API');
    }

    // Step 3: Process each country
    const processedCountries = [];
    const errors = [];

    for (const countryData of countriesData) {
      try {
        const processedData = await this.processCountryData(countryData, exchangeRates);
        processedCountries.push(processedData);
      } catch (error) {
        errors.push({
          country: countryData.name,
          error: error.message
        });
        console.warn(`⚠️ Failed to process ${countryData.name}:`, error.message);
      }
    }

    // Step 4: Save to database
    let savedCount = 0;
    let updatedCount = 0;

    for (const countryData of processedCountries) {
      try {
        const [country, created] = await Country.upsert(countryData, {
          conflictFields: ['name'],
          returning: true,
        });

        if (created) {
          savedCount++;
        } else {
          updatedCount++;
        }
      } catch (error) {
        errors.push({
          country: countryData.name,
          error: `Database error: ${error.message}`
        });
        console.error(`❌ Failed to save ${countryData.name}:`, error.message);
      }
    }

    console.log(`💾 Database update: ${savedCount} new, ${updatedCount} updated`);
    
    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} errors occurred during processing`);
    }

    return {
      totalProcessed: processedCountries.length,
      saved: savedCount,
      updated: updatedCount,
      errors: errors,
      timestamp: new Date()
    };
  }

  // Test the GDP calculation
  testGDPCalculation() {
    console.log('🧪 Testing GDP Calculation...');
    
    const testCases = [
      { population: 1000000, exchangeRate: 1.5, expected: 'between 666666 and 1333333' },
      { population: 50000000, exchangeRate: 450, expected: 'between 111111 and 222222' },
      { population: 1000000, exchangeRate: null, expected: 0 },
      { population: 1000000, exchangeRate: 0, expected: 0 },
    ];

    testCases.forEach((testCase, index) => {
      const result = this.calculateEstimatedGDP(testCase.population, testCase.exchangeRate);
      console.log(`   Test ${index + 1}: Population ${testCase.population}, Rate ${testCase.exchangeRate}`);
      console.log(`        Result: ${result}, Expected: ${testCase.expected}`);
    });
  }
}

module.exports = new DataProcessingService();