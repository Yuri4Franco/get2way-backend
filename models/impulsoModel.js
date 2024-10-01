const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Impulso = sequelize.define('Impulso', {
  tipo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  valor: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  data_inicio: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  data_fim: {
    type: DataTypes.STRING(45),
    allowNull: true,
  }
},
{
  tableName: 'impulso',
  timestamps: false
}
);

module.exports = Impulso;
