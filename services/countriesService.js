const axios = require('axios');
const apiConfig = require('../config/api');

class CountriesService {
  async fetchAllCountries() {
    try {
      console.log('🌍 Fetching countries from REST Countries API...');
      
      const response = await axios.get(apiConfig.countries.url, {
        timeout: apiConfig.countries.timeout
      });

      console.log(`✅ Successfully fetched ${response.data.length} countries`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch countries:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Countries API timeout - service unavailable');
      }
      
      throw new Error(`Countries API error: ${error.message}`);
    }
  }

  extractCurrencyCode(currencies) {
    if (!currencies || currencies.length === 0) {
      return null;
    }
    return currencies[0].code || null;
  }

  // Test method to verify API connection
  async testConnection() {
    try {
      const countries = await this.fetchAllCountries();
      return {
        success: true,
        count: countries.length,
        sample: countries[0] // Return first country as sample
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new CountriesService();