const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Empresa = require('./empresaModel');

const Rota = sequelize.define('Rota', {
  nome: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
});

Rota.belongsTo(Empresa, { foreignKey: 'empresa_id' });

module.exports = Rota;
