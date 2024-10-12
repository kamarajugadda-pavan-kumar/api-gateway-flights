const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  FLIGHT_SEARCH_SERVICE: process.env.FLIGHT_SEARCH_SERVICE,
  FLIGHT_BOOKING_SERVICE: process.env.FLIGHT_BOOKING_SERVICE,
  NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE,
};
