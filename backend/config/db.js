const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/carbon_credit', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
