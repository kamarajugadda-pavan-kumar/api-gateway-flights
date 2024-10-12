"use strict";
const { roles } = require("../utils/common/enums");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = roles;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Roles", [
      {
        name: ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: CUSTOMER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: FLIGHT_COMPANY,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Roles", null, {});
  },
};
