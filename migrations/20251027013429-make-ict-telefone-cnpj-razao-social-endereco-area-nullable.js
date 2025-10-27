"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("icts", "telefone", {
      type: Sequelize.STRING(13),
      allowNull: true,
    });

    await queryInterface.changeColumn("icts", "endereco", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.changeColumn("icts", "cnpj", {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
    });

    await queryInterface.changeColumn("icts", "razao_social", {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("icts", "telefone", {
      type: Sequelize.STRING(13),
      allowNull: false,
    });

    await queryInterface.changeColumn("icts", "endereco", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn("icts", "cnpj", {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn("icts", "razao_social", {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    });
  },
};
