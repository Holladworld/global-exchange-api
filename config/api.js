module.exports = {
  countries: {
    url: process.env.COUNTRIES_API_URL || 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies',
    timeout: 15000 // 15 seconds
  },
  exchange: {
    url: process.env.EXCHANGE_API_URL || 'https://open.er-api.com/v6/latest/USD', 
    timeout: 10000 // 10 seconds
  }
};