"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("responsaveis", "cargo", {
      type: Sequelize.STRING(45),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("responsaveis", "cargo", {
      type: Sequelize.STRING(45),
      allowNull: false,
    });
  },
};
