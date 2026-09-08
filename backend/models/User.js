const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('org', 'consumer', 'admin'),
    allowNull: false
  },
  wallet_address: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = User;
