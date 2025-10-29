module.exports = {
  database: {
    pool: {
      max: 5,
      min: 1,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 1000
  }
};