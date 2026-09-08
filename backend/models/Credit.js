const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Credit = sequelize.define('Credit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  org_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  doc_url: {
    type: DataTypes.STRING
  },
  token_id: {
    type: DataTypes.INTEGER
  },
  tx_hash: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'listed', 'retired'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'credits',
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Credit;
