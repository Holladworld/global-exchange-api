const Joi = require('joi');


const countryQuerySchema = Joi.object({
  region: Joi.string().trim().max(255).optional(),
  currency: Joi.string().trim().max(10).optional(),
  sort: Joi.string().valid(
    'gdp_desc', 'gdp_asc', 
    'population_desc', 'population_asc',
    'name_asc', 'name_desc'
  ).optional(),
});

const validateCountryQuery = (req, res, next) => {
  const { error } = countryQuerySchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message;
        return acc;
      }, {}),
    });
  }
  
  next();
};

module.exports = { validateCountryQuery };