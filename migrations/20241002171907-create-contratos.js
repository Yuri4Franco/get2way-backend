'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('contratos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      data_inicio: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      data_fim: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ativa', 'inativa'),
        allowNull: false,
      },
      projeto_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projetos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      interesse_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'interesses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('contratos');
  },
};