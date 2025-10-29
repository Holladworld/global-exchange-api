const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models');
const Country = require('../models/country');

describe('GlobalExchangeAPI Integration Tests', () => {
  beforeAll(async () => {
    // Ensure database is connected
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Health Endpoints', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });

    test('GET /health/db should return database status', async () => {
      const response = await request(app).get('/health/db');
      expect([200, 503]).toContain(response.status);
    });
  });

  describe('Countries Endpoints', () => {
    test('GET /countries should return array', async () => {
      const response = await request(app).get('/countries');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /countries/status should return statistics', async () => {
      const response = await request(app).get('/countries/status');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total_countries');
      expect(response.body).toHaveProperty('last_refreshed_at');
    });

    test('GET /countries?region=Africa should filter by region', async () => {
      const response = await request(app).get('/countries?region=Africa');
      expect(response.status).toBe(200);
      
      if (response.body.length > 0) {
        expect(response.body[0].region).toMatch(/Africa/i);
      }
    });

    test('GET /countries?sort=gdp_desc should sort by GDP', async () => {
      const response = await request(app).get('/countries?sort=gdp_desc');
      expect(response.status).toBe(200);
      
      if (response.body.length > 1) {
        const firstGDP = response.body[0].estimated_gdp;
        const secondGDP = response.body[1].estimated_gdp;
        
        // Check if sorted descending (considering null values)
        if (firstGDP && secondGDP) {
          expect(firstGDP >= secondGDP).toBe(true);
        }
      }
    });

    test('GET /countries/image should return image or 404', async () => {
      const response = await request(app).get('/countries/image');
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('Invalid sort parameter should return 400', async () => {
      const response = await request(app).get('/countries?sort=invalid_sort');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Non-existent endpoint should return 404', async () => {
      const response = await request(app).get('/nonexistent-endpoint');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});