const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Rota = require('./rotaModel');

const Programa = sequelize.define('Programa', {
  nome: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(255),  
    allowNull: false,
  }
},{
  tableName: 'programa',
  timestamps: false
});

Rota.hasMany(Programa, { foreignKey: 'rota_id' });
Programa.belongsTo(Rota, { foreignKey: 'rota_id' });

module.exports = Programa;
