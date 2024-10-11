'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela de keywords
    await queryInterface.createTable('keywords', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // Criar tabela intermediária projeto_keywords
    await queryInterface.createTable('projeto_keywords', {
      projeto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'projetos', // Nome da tabela projetos
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      keyword_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'keywords',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('projeto_keywords');
    await queryInterface.dropTable('keywords');
  },
};
