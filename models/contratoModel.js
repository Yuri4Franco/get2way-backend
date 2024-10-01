const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Projeto = require('./projetoModel');
const InteresseHasUsuario = require('./interesse_has_usuarioModel');

const Contrato = sequelize.define('Contrato', {
    data_inicio: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    data_fim: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ativa', 'inativa'),
      allowNull: false,
    }
  },
  {
    tableName: 'contrato',
    timestamps: false
  }
);
  
  Contrato.belongsTo(Projeto, { foreignKey: 'projeto_id' });
  Contrato.belongsTo(InteresseHasUsuario, { foreignKey: 'interesse_id' });
  Contrato.belongsTo(InteresseHasUsuario, { foreignKey: 'usuario_id' });
  
  module.exports = Contrato;