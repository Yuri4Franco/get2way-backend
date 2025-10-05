"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    // status do interesse - pendente, aceito, rejeitado
    
    await queryInterface.addColumn("interesses", "status", {
      type: Sequelize.ENUM("pendente", "aceito", "rejeitado"),
      defaultValue: "pendente",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("interesses", "status");
  },
};
