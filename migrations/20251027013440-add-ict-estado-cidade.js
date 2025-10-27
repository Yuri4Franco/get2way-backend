'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('icts', 'uf', {
      type: Sequelize.STRING(2),
      allowNull: true,
    });

    await queryInterface.addColumn('icts', 'cidade', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('icts', 'uf');
    await queryInterface.removeColumn('icts', 'cidade');
  }
};
