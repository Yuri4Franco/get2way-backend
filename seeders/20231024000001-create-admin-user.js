const bcrypt = require('bcryptjs');
const { Usuario, Responsavel, Empresa } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senha = bcrypt.hashSync('senha123', 10);
    const dateNow = new Date();

    // Inserir empresa
    await queryInterface.bulkInsert('Empresas', [
      {
        nome: 'Instituto Agregar',
        cnpj: '48851721000131',
        razao_social: 'Instituto Agregar',
        endereco: 'R. Konrad Adenauer, 555 - Sala B - Centro, Panambi - RS, 98280-000',
        area: 'Inovação',
        telefone: '555596821340',
        email: 'contato@institutoagregar.com.br',
        site: 'institutoagregar.com.br',
        foto_perfil: '/uploads/fotos/01.jpg',
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ]);

    // Buscar ID da empresa recém-inserida
    const empresa = await queryInterface.sequelize.query(
      `SELECT id FROM Empresas WHERE cnpj = '48851721000131' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const empresaId = empresa[0]?.id;

    // Inserir usuário
    await queryInterface.bulkInsert('Usuarios', [
      {
        nome: 'Patrícia Lazarotti Garcia',
        email: 'patricia@institutoagregar.com.br',
        senha,
        tipo: 'admin',
        endereco: 'Panambi-RS',
        telefone: '555591299413',
        primeiro_acesso: 1,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ]);

    // Buscar ID do usuário
    const usuarios = await queryInterface.sequelize.query(
      `SELECT id, email FROM Usuarios WHERE email = 'patricia@institutoagregar.com.br';`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Associar responsável com empresa
    const responsaveis = usuarios.map((usuario) => ({
      usuario_id: usuario.id,
      cargo: 'Gestora Executiva',
      empresa_id: empresaId,
      ict_id: null,
      createdAt: dateNow,
      updatedAt: dateNow,
    }));

    await queryInterface.bulkInsert('Responsaveis', responsaveis);
  },

  down: async (queryInterface, Sequelize) => {
    // Deletar responsáveis associados
    await queryInterface.bulkDelete('Responsaveis', {
      usuario_id: Sequelize.literal(`(SELECT id FROM Usuarios WHERE email = 'patricia@institutoagregar.com.br')`)
    });

    // Deletar usuário
    await queryInterface.bulkDelete('Usuarios', {
      email: 'patricia@institutoagregar.com.br'
    });

    // Deletar empresa
    await queryInterface.bulkDelete('Empresas', {
      cnpj: '48851721000131'
    });
  },
};
