const bcrypt = require('bcryptjs');
const { Usuario, Responsavel } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senha = bcrypt.hashSync('senha123', 10);

    // Cria o usuário admin
    const adminUsuario = await Usuario.create({
      nome: 'Administrador',
      email: 'admin@example.com',
      senha,
      tipo: 'admin',
      endereco: 'Endereço Admin', // Se o campo for obrigatório
      telefone: '123456789', // Se o campo for obrigatório
      primeiro_acesso: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Cria o registro de responsável associado ao usuário admin
    await Responsavel.create({
      usuario_id: adminUsuario.id, // Associa ao ID do usuário admin criado
      cargo: 'Administrador',
      empresa_id: null, // Deixe null se o admin não estiver associado a uma empresa específica
      ict_id: null // Deixe null se o admin não estiver associado a uma ICT específica
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove o responsável e o usuário admin
    await queryInterface.bulkDelete('Responsaveis', { usuario_id: Sequelize.literal(`(SELECT id FROM Usuarios WHERE email = 'admin@example.com')`) }, {});
    await queryInterface.bulkDelete('Usuarios', { email: 'admin@example.com' }, {});
  }
};
