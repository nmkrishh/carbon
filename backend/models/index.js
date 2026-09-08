const sequelize = require('../config/db');
const User = require('./User');
const Credit = require('./Credit');
const Listing = require('./Listing');
const Transaction = require('./Transaction');

// Define associations
User.hasMany(Credit, { foreignKey: 'org_id' });
Credit.belongsTo(User, { foreignKey: 'org_id' });

Credit.hasOne(Listing, { foreignKey: 'credit_id' });
Listing.belongsTo(Credit, { foreignKey: 'credit_id' });

User.hasMany(Listing, { foreignKey: 'seller_id' });
Listing.belongsTo(User, { foreignKey: 'seller_id' });

Listing.hasMany(Transaction, { foreignKey: 'listing_id' });
Transaction.belongsTo(Listing, { foreignKey: 'listing_id' });

User.hasMany(Transaction, { foreignKey: 'buyer_id' });
Transaction.belongsTo(User, { foreignKey: 'buyer_id' });

module.exports = {
  sequelize,
  User,
  Credit,
  Listing,
  Transaction
};
