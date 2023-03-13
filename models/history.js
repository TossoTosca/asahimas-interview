'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  History.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      },
      field: "UserId",
      onUpdate: "cascade",
      onDelete: "cascade"
    },
    imgUrl: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    priceBuy: DataTypes.INTEGER,
    priceSell: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};