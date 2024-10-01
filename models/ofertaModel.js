const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Projeto = require('./projetoModel');

const Oferta = sequelize.define('Oferta', {
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ativa', 'inativa'),
      allowNull: false,
    }
  });
  
  Oferta.belongsTo(Projeto, { foreignKey: 'projeto_id' });
  
  module.exports = Oferta;