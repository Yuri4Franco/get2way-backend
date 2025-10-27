"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("usuarios", "telefone", {
      type: Sequelize.STRING(13),
      allowNull: true,
    });

    await queryInterface.changeColumn("usuarios", "endereco", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("usuarios", "telefone", {
      type: Sequelize.STRING(13),
      allowNull: false,
    });

    await queryInterface.changeColumn("usuarios", "endereco", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
