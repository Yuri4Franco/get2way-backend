"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("empresas", "telefone", {
      type: Sequelize.STRING(13),
      allowNull: true,
    });

    await queryInterface.changeColumn("empresas", "endereco", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.changeColumn("empresas", "cnpj", {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
    });

    await queryInterface.changeColumn("empresas", "razao_social", {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
    });

    await queryInterface.changeColumn("empresas", "area", {
      type: Sequelize.STRING(45),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("empresas", "telefone", {
      type: Sequelize.STRING(13),
      allowNull: false,
    });

    await queryInterface.changeColumn("empresas", "endereco", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn("empresas", "cnpj", {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn("empresas", "razao_social", {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn("empresas", "area", {
      type: Sequelize.STRING(45),
      allowNull: false,
    });
  },
};
