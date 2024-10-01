const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  endereco: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  tipo: {
    type: DataTypes.ENUM('empresa', 'ict', 'aluno', 'adm'),
    allowNull: false,
  },
  primeiro_acesso: {
    type: DataTypes.TINYINT,
    allowNull: false,
  }
},
{
  tableName: 'usuario',
  timestamps: false
}
);

module.exports = Usuario;
