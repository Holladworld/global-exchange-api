const axios = require('axios');
const apiConfig = require('../config/api');

class ExchangeService {
  constructor() {
    this.exchangeRates = null;
    this.lastFetched = null;
    this.cacheDuration = 3600000; // 1 hour cache
  }

  async fetchExchangeRates() {
    try {
      console.log('💱 Fetching exchange rates from Open Exchange Rates API...');
      
      const response = await axios.get(apiConfig.exchange.url, {
        timeout: apiConfig.exchange.timeout
      });

      if (response.data && response.data.rates) {
        this.exchangeRates = response.data.rates;
        this.lastFetched = new Date();
        console.log(`✅ Successfully fetched ${Object.keys(this.exchangeRates).length} exchange rates`);
        return this.exchangeRates;
      } else {
        throw new Error('Invalid response format from exchange API');
      }
    } catch (error) {
      console.error('❌ Failed to fetch exchange rates:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Exchange API timeout - service unavailable');
      }
      
      throw new Error(`Exchange API error: ${error.message}`);
    }
  }

  getExchangeRate(currencyCode) {
    if (!this.exchangeRates || !this.isCacheValid()) {
      return null;
    }
    return this.exchangeRates[currencyCode] || null;
  }

  isCacheValid() {
    if (!this.lastFetched) return false;
    return (Date.now() - this.lastFetched) < this.cacheDuration;
  }

  async getValidExchangeRates() {
    if (!this.isCacheValid()) {
      await this.fetchExchangeRates();
    }
    return this.exchangeRates;
  }

  // Test method to verify API connection
  async testConnection() {
    try {
      const rates = await this.fetchExchangeRates();
      return {
        success: true,
        count: Object.keys(rates).length,
        base: 'USD',
        sample: {
          USD: rates.USD,
          EUR: rates.EUR
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ExchangeService();