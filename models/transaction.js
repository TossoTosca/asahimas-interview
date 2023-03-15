'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
    }
  }
  Transaction.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id"
      },
      field: 'UserId',
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    amount: DataTypes.BIGINT,
    invoiceNumber: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};