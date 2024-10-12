const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const { AuthRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { isValidISODate } = require("../utils/common/dateTime");
const { Role } = require("../models");
const { sequelize } = require("../models");
const { roles } = require("../utils/common/enums");
const { comparePassword } = require("../utils/common/bcrypt");
const { generateToken } = require("../utils/common/jwt");

const signUp = async (data) => {
  const user = await new AuthRepository().createUser(data);
  const role = await Role.findOne({ where: { name: roles.CUSTOMER } });
  await user.addRole(role);
  return user;
};

const signIn = async (data) => {
  const user = await new AuthRepository().findUserByEmail(data.emailId);
  let userRoles = await user.getRoles();
  userRoles = userRoles.map((role) => role.name);
  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }
  return generateToken({
    id: user.id,
    emailId: user.emailId,
    roles: userRoles,
  });
};

module.exports = {
  signUp,
  signIn,
};
