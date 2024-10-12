const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const { AuthRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { isValidISODate } = require("../utils/common/dateTime");
const db = require("../models");
const { sequelize } = require("../models");

const signUp = async (data) => {
  const signedUpResponse = await new AuthRepository().signUp(data);
  return signedUpResponse;
};

const signIn = async (data) => {
  const updatedFlight = await new AuthRepository().signIn(data);
  return updatedFlight;
};
module.exports = {
  signUp,
  signIn,
};
