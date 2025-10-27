'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('empresas', 'uf', {
      type: Sequelize.STRING(2),
      allowNull: true,
    });

    await queryInterface.addColumn('empresas', 'cidade', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('empresas', 'uf');
    await queryInterface.removeColumn('empresas', 'cidade');
  }
};
