'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remover a coluna antiga 'acatech'
    await queryInterface.removeColumn('projetos', 'acatech');

    // Adicionar a nova coluna 'prioridade'
    await queryInterface.addColumn('projetos', 'prioridade', {
      type: Sequelize.STRING,  // Você pode ajustar o tipo de dado conforme sua necessidade
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter as alterações
    await queryInterface.removeColumn('projetos', 'prioridade');
    await queryInterface.addColumn('projetos', 'acatech', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
