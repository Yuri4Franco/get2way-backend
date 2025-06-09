'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('empresas',
      'telefone', {
      type: Sequelize.STRING(13),
      allowNull: false,
    });

    await queryInterface.changeColumn('icts',
      'telefone', {
      type: Sequelize.STRING(13),
      allowNull: false,
    });

    await queryInterface.changeColumn('usuarios',
      'telefone', {
      type: Sequelize.STRING(13),
      allowNull: false,
      unique: false,
    });

    await queryInterface.removeConstraint('usuarios', 'telefone'); //tornando possível cadastrar usuários com o mesmo telefone (integração via SMS não é uma preocupação)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('empresas',
      'telefone', {
      type: Sequelize.STRING(45),
      allowNull: false,
    });

    await queryInterface.changeColumn('icts',
      'telefone', {
      type: Sequelize.STRING(45),
      allowNull: false,
    });

    await queryInterface.changeColumn('usuarios',
      'telefone', {
      type: Sequelize.STRING(45),
      allowNull: false,
      unique: true,
    });
  }
};
