const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 

const Empresa = sequelize.define('Empresa', {
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  razao_social: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  site: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  foto_perfil: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

module.exports = Empresa;
