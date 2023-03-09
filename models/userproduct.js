'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  UserProduct.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      },
      onUpdate: "cascade",
      onDelete: "cascade"
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Products",
        key: "id"
      },
      onUpdate: "cascade",
      onDelete: "cascade"
    }
  }, {
    sequelize,
    modelName: 'UserProduct',
  });
  return UserProduct;
};