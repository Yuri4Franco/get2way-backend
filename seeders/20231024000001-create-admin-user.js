const bcrypt = require('bcryptjs');
const { Usuario, Responsavel } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senha = bcrypt.hashSync('senha123', 10);
    const dateNow = new Date();

    // Inserir usuário admin
    await queryInterface.bulkInsert('Usuarios', [
      {
        nome: 'Administrador',
        email: 'admin@example.com',
        senha,
        tipo: 'admin',
        endereco: 'Endereço Admin',
        telefone: '123456789',
        primeiro_acesso: 1,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ]);

    // Consultar IDs criados para associação
    const usuarios = await queryInterface.sequelize.query(
      `SELECT id, email FROM Usuarios WHERE email IN ('admin@example.com');`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Associar Responsaveis
    const responsaveis = usuarios.map((usuario) => {
      let cargo = '';
      if (usuario.email === 'admin@example.com') cargo = 'Administrador';

      return {
        usuario_id: usuario.id,
        cargo,
        empresa_id: null,
        ict_id: null,
        createdAt: dateNow,
        updatedAt: dateNow,
      };
    });

    await queryInterface.bulkInsert('Responsaveis', responsaveis);
  },

  down: async (queryInterface, Sequelize) => {
    // Deletar responsáveis associados
    await queryInterface.bulkDelete(
      'Responsaveis',
      { usuario_id: Sequelize.literal(`(SELECT id FROM Usuarios WHERE email IN ('admin@example.com'))`) },
      {}
    );

    // Deletar usuários
    await queryInterface.bulkDelete(
      'Usuarios',
      { email: { [Sequelize.Op.in]: ['admin@example.com'] } },
      {}
    );
  },
};