'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projetos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      descricao: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      trl: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      acatech: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      prioridade: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      data_inicio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      data_fim: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      justificativas: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      objsmart: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      beneficios: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      produto: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      requisitos: {
        type: Sequelize.STRING(255),
        allowNull: true, 
      },
      stakeholders: {
        type: Sequelize.STRING(255),
        allowNull: true, 
      },
      equipe: {
        type: Sequelize.STRING(255),
        allowNull: true, 
      },
      premissas: {
        type: Sequelize.STRING(255),
        allowNull: true, 
      },
      grupo_de_entrega: {
        type: Sequelize.STRING(255),
        allowNull: true, 
      },
      restricoes: {
        type: Sequelize.STRING(255),
        allowNull: true, 
      },
      riscos: {
        type: Sequelize.STRING(255),
        allowNull: true, 
      },
      linha_do_tempo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      custos: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      upload: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      estilo: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      impulso_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'impulsos',
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
      programa_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'programas',
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
    await queryInterface.dropTable('projetos');
  },
};
