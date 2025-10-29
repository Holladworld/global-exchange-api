const express = require('express');
const countryController = require('../controllers/countryController');

const router = express.Router();

// Country routes
router.post('/refresh', countryController.refreshCountries);
router.get('/', countryController.getCountries);
router.get('/status', countryController.getCountryStatus);

// We'll add more routes here later
// router.get('/:name', countryController.getCountryByName);
// router.delete('/:name', countryController.deleteCountry);

module.exports = router;