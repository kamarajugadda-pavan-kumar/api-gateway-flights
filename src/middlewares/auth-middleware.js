const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { JWT_SECRET } = require("../config/server-config");
const { validateToken } = require("../utils/common/jwt");

const authMiddleware = (req, res, next) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new AppError(
        "Email and password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    ErrorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    res.status(error.statusCode).json(ErrorResponse);
  }
};

const validateJWTMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new AppError("JWT token missing", StatusCodes.UNAUTHORIZED);
    }

    const payload = validateToken(token);
    req.user = payload;
    next();
  } catch (error) {
    ErrorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    res.status(error.statusCode).json(ErrorResponse);
  }
};

module.exports = { authMiddleware, validateJWTMiddleware };
