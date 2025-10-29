const dataProcessingService = require('../services/dataProcessingService');
const Country = require('../models/country');
const { Op } = require('sequelize');

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
      const { region, currency, sort } = req.query;
      
      console.log(`🔍 GET /countries query:`, { region, currency, sort });
      
      // Build where clause for filtering
      const whereClause = {};
      
      if (region) {
        whereClause.region = {
          [Op.iLike]: `%${region}%` // Case-insensitive search for PostgreSQL
        };
      }
      
      if (currency) {
        whereClause.currency_code = currency.toUpperCase();
      }

      // Build order clause for sorting
      let orderClause = [['name', 'ASC']]; // Default sort by name ascending
      
      if (sort) {
        switch (sort) {
          case 'gdp_desc':
            orderClause = [['estimated_gdp', 'DESC NULLS LAST']];
            break;
          case 'gdp_asc':
            orderClause = [['estimated_gdp', 'ASC NULLS LAST']];
            break;
          case 'population_desc':
            orderClause = [['population', 'DESC']];
            break;
          case 'population_asc':
            orderClause = [['population', 'ASC']];
            break;
          case 'name_desc':
            orderClause = [['name', 'DESC']];
            break;
          case 'name_asc':
            orderClause = [['name', 'ASC']];
            break;
          default:
            // Invalid sort parameter, use default
            console.warn(`⚠️ Invalid sort parameter: ${sort}, using default`);
        }
      }

      const countries = await Country.findAll({
        where: whereClause,
        order: orderClause,
      });

      console.log(`✅ Found ${countries.length} countries with filters`);
      res.json(countries);
    } catch (error) {
      console.error('❌ Get countries failed:', error.message);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  async getCountryByName(req, res) {
    try {
      const { name } = req.params;
      
      console.log(`🔍 GET /countries/${name}`);
      
      const country = await Country.findOne({
        where: {
          name: {
            [Op.iLike]: name // Case-insensitive search
          }
        }
      });

      if (!country) {
        return res.status(404).json({
          error: 'Country not found'
        });
      }

      res.json(country);
    } catch (error) {
      console.error('❌ Get country by name failed:', error.message);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  async deleteCountry(req, res) {
    try {
      const { name } = req.params;
      
      console.log(`🗑️ DELETE /countries/${name}`);
      
      const country = await Country.findOne({
        where: {
          name: {
            [Op.iLike]: name
          }
        }
      });

      if (!country) {
        return res.status(404).json({
          error: 'Country not found'
        });
      }

      await country.destroy();
      
      console.log(`✅ Deleted country: ${name}`);
      res.json({
        message: 'Country deleted successfully',
        country: {
          name: country.name
        }
      });
    } catch (error) {
      console.error('❌ Delete country failed:', error.message);
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