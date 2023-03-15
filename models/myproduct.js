'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class MyProduct extends Model {
    static associate(models) {
      MyProduct.belongsTo(models.User)
    }
  }
  MyProduct.init({
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
    name: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    priceSell: DataTypes.INTEGER,
    priceBuy: DataTypes.INTEGER
  }, { sequelize });
  return MyProduct;
};
