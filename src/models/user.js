"use strict";
const { Model } = require("sequelize");
const { encryptPassword } = require("../utils/common/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Role, {
        through: models.User_Role,
        foreignKey: "userId",
        otherKey: "roleId",
      });
    }
  }
  User.init(
    {
      emailId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        async beforeSave(user) {
          user.password = encryptPassword(user.password);
        },
      },
    }
  );
  return User;
};
