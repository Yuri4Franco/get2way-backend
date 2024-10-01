const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Oferta = require('./ofertaModel');

const Interesse = sequelize.define('Interesse', {
    proposta: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },
  {
    tableName: 'interesse',
    timestamps: false
  }
);
  
  Interesse.belongsTo(Oferta, { foreignKey: 'oferta_id' });
  
  module.exports = Interesse;