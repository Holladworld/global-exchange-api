const dataProcessingService = require('../services/dataProcessingService');
const Country = require('../models/country');

class CountryController {
  async refreshCountries(req, res) {
    try {
      console.log('🔄 Manual refresh triggered via API');
      
      const result = await dataProcessingService.refreshAllCountries();
      
      res.json({
        message: 'Countries refreshed successfully',
        data: result
      });
    } catch (error) {
      console.error('❌ Refresh failed:', error.message);
      
      if (error.message.includes('External data source unavailable')) {
        res.status(503).json({
          error: 'External data source unavailable',
          details: error.message.replace('External data source unavailable: ', '')
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          details: error.message
        });
      }
    }
  }

  async getCountries(req, res) {
    try {
      // We'll implement filtering and sorting here later
      const countries = await Country.findAll();
      res.json(countries);
    } catch (error) {
      console.error('❌ Get countries failed:', error.message);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  async getCountryStatus(req, res) {
    try {
      const totalCountries = await Country.count();
      const lastRefreshed = await Country.max('last_refreshed_at');

      res.json({
        total_countries: totalCountries,
        last_refreshed_at: lastRefreshed
      });
    } catch (error) {
      console.error('❌ Get status failed:', error.message);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
}

module.exports = new CountryController();