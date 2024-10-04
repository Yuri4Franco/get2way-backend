'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('interesse_has_usuarios', {
      interesse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'interesses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });

    await queryInterface.addConstraint('interesse_has_usuarios', {
      fields: ['interesse_id', 'usuario_id'],
      type: 'unique',
      name: 'interesse_usuario_unique_constraint'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('interesse_has_usuarios');
  }
};
