const { sequelize } = require('../config/database');
const Country = require('./country');

const db = {
  sequelize,
  Country,
};

// Future model associations will go here

module.exports = db;