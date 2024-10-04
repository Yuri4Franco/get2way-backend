'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('projetos', 'status', {
        type: Sequelize.STRING(50),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'trl', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'acatech', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'justificativas', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'objsmart', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'beneficios', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'produto', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'requisitos', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'steakholders', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'equipe', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'premissas', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'grupo_de_entrega', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.addColumn('projetos', 'restricoes', {
        type: Sequelize.STRING(255),
        allowNull: true,
      }),
      queryInterface.addColumn('projetos', 'riscos', {
        type: Sequelize.STRING(255),
        allowNull: true,
      }),
      queryInterface.addColumn('projetos', 'linha_do_tempo', {
        type: Sequelize.STRING(255),
        allowNull: true,
      }),
      queryInterface.addColumn('projetos', 'custos', {
        type: Sequelize.STRING(255),
        allowNull: true,
      }),
      queryInterface.addColumn('projetos', 'upload', {
        type: Sequelize.STRING(255),
        allowNull: true,
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('projetos', 'status'),
      queryInterface.removeColumn('projetos', 'trl'),
      queryInterface.removeColumn('projetos', 'acatech'),
      queryInterface.removeColumn('projetos', 'justificativas'),
      queryInterface.removeColumn('projetos', 'objsmart'),
      queryInterface.removeColumn('projetos', 'beneficios'),
      queryInterface.removeColumn('projetos', 'produto'),
      queryInterface.removeColumn('projetos', 'requisitos'),
      queryInterface.removeColumn('projetos', 'steakholders'),
      queryInterface.removeColumn('projetos', 'equipe'),
      queryInterface.removeColumn('projetos', 'premissas'),
      queryInterface.removeColumn('projetos', 'grupo_de_entrega'),
      queryInterface.removeColumn('projetos', 'restricoes'),
      queryInterface.removeColumn('projetos', 'riscos'),
      queryInterface.removeColumn('projetos', 'linha_do_tempo'),
      queryInterface.removeColumn('projetos', 'custos'),
      queryInterface.removeColumn('projetos', 'upload'),
    ]);
  }
};
