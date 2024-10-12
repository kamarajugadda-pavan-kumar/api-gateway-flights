const CRUDRepository = require("./crud-repository");
const { User, Airplane, Airport, Sequelize } = require("../models");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

class UserRepository extends CRUDRepository {
  constructor() {
    super(User);
  }

  async createUser(data) {
    try {
      const user = await this.createResource(data);
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("RepositoryError", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
module.exports = FlightRepository;
