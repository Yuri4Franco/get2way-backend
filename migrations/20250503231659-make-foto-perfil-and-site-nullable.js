"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("icts", "foto_perfil", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn("icts", "site", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.changeColumn("empresas", "foto_perfil", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn("empresas", "site", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("icts", "foto_perfil", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn("icts", "site", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn("empresas", "foto_perfil", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn("empresas", "site", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },
};
