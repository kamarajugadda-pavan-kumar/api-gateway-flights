"use strict";
const { Model } = require("sequelize");

const { roles } = require("../utils/common/enums");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = roles;

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsToMany(models.User, {
        through: models.User_Role, // through table
        foreignKey: "roleId",
        otherKey: "userId",
      });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.ENUM(ADMIN, CUSTOMER, FLIGHT_COMPANY),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
