'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('impulsos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tipo: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      descricao: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      valor: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      data_inicio: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      data_fim: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('impulsos');
  },
};
