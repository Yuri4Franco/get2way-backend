const bcrypt = require('bcryptjs');
const { Usuario, Responsavel } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senha = bcrypt.hashSync('senha123', 10);
    const dateNow = new Date();

    // Inserir usuários
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
      {
        nome: 'ICT',
        email: 'ICT@example.com',
        senha,
        tipo: 'ict',
        endereco: 'Endereço ict',
        telefone: '987654321',
        primeiro_acesso: 1,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        nome: 'Empresa',
        email: 'Empresa@example.com',
        senha,
        tipo: 'empresa',
        endereco: 'Endereço Empresa',
        telefone: '01020304',
        primeiro_acesso: 1,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ]);

    // Consultar IDs criados para associação
    const usuarios = await queryInterface.sequelize.query(
      `SELECT id, email FROM Usuarios WHERE email IN ('admin@example.com', 'ICT@example.com', 'Empresa@example.com');`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Associar Responsaveis
    const responsaveis = usuarios.map((usuario) => {
      let cargo = '';
      if (usuario.email === 'admin@example.com') cargo = 'Administrador';
      if (usuario.email === 'ICT@example.com') cargo = 'Professor';
      if (usuario.email === 'Empresa@example.com') cargo = 'Gerente';

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
      { usuario_id: Sequelize.literal(`(SELECT id FROM Usuarios WHERE email IN ('admin@example.com', 'ICT@example.com', 'Empresa@example.com'))`) },
      {}
    );

    // Deletar usuários
    await queryInterface.bulkDelete(
      'Usuarios',
      { email: { [Sequelize.Op.in]: ['admin@example.com', 'ICT@example.com', 'Empresa@example.com'] } },
      {}
    );
  },
};
