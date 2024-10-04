const { Sequelize } = require('sequelize');
const config = require('../config/config.json'); // Importando o config.json
const env = process.env.NODE_ENV || 'development'; // Definindo o ambiente

// Pegando as configurações do config.json de acordo com o ambiente
const dbConfig = config[env];

// Configurar a conexão com o MySQL usando Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: console.log
  }
);

// Testando a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco de dados com Sequelize');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

// Sincronizando as tabelas
sequelize.sync({ force: false })
  .then(() => {
    console.log('Tabelas Sincronizadas');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar as tabelas:', err);
  });

module.exports = sequelize;
