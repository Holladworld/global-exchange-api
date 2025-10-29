const dataProcessingService = require('../services/dataProcessingService');

describe('Unit Tests', () => {
  describe('GDP Calculation', () => {
    test('should calculate GDP correctly with valid inputs', () => {
      const population = 1000000;
      const exchangeRate = 500;
      
      const gdp = dataProcessingService.calculateEstimatedGDP(population, exchangeRate);
      
      // GDP should be between (1M * 1000 / 500) and (1M * 2000 / 500)
      expect(gdp).toBeGreaterThanOrEqual(2000000); // 2M
      expect(gdp).toBeLessThanOrEqual(4000000);    // 4M
    });

    test('should return 0 when exchange rate is null', () => {
      const gdp = dataProcessingService.calculateEstimatedGDP(1000000, null);
      expect(gdp).toBe(0);
    });

    test('should return 0 when exchange rate is 0', () => {
      const gdp = dataProcessingService.calculateEstimatedGDP(1000000, 0);
      expect(gdp).toBe(0);
    });
  });
});