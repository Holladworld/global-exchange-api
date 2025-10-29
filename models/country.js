const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  capital: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  population: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  currency_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  exchange_rate: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: true,
  },
  estimated_gdp: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true,
  },
  flag_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  last_refreshed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'countries',
  timestamps: true,
  underscored: true,
});

module.exports = Country;