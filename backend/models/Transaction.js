const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tx_hash: {
    type: DataTypes.STRING
  },
  amount_paid: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  tableName: 'transactions',
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Transaction;
