const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  credit_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'listings',
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Listing;
