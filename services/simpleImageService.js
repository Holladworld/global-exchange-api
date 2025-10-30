const Country = require('../models/country');
const logger = require('../utils/logger');

class SimpleImageService {
  async generateSummaryImage() {
    try {
      logger.info('📊 Generating simple summary (no image available in production)');
      
      // Just log the summary instead of generating image
      const totalCountries = await Country.count();
      const topCountries = await Country.findAll({
        order: [['estimated_gdp', 'DESC']],
        limit: 5,
      });
      
      console.log('=== GLOBALEXCHANGEAPI SUMMARY ===');
      console.log(`Total Countries: ${totalCountries}`);
      console.log('Top 5 GDP Countries:');
      topCountries.forEach((country, index) => {
        console.log(`${index + 1}. ${country.name}: $${country.estimated_gdp}`);
      });
      
      // Return null to indicate no image was generated
      return null;
    } catch (error) {
      logger.error('Summary generation failed:', error);
      return null;
    }
  }

  async getImagePath() {
    return null; // No image available
  }
}

module.exports = new SimpleImageService();