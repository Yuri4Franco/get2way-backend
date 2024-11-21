'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove a coluna impulso_id da tabela ofertas
    await queryInterface.removeColumn('ofertas', 'impulso_id');

    // Adiciona a coluna impulso_id à tabela projetos
    await queryInterface.addColumn('projetos', 'impulso_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'impulsos',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverte a operação: adiciona impulso_id de volta à tabela ofertas
    await queryInterface.addColumn('ofertas', 'impulso_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'impulsos',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true,
    });

    // Remove a coluna impulso_id da tabela projetos
    await queryInterface.removeColumn('projetos', 'impulso_id');
  },
};
