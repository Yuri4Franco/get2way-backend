const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Usuario = require('./usuarioModel');
const Ict = require('./ictModel');
const Empresa = require('./empresaModel');

const Responsavel = sequelize.define('Responsavel', {
  cargo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  }
},
  {
    tableName: 'responsavel',
    timestamps: false
  }
);

Responsavel.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Responsavel.belongsTo(Empresa, { foreignKey: 'empresa_id' });
Responsavel.belongsTo(Ict, { foreignKey: 'ict_id' });

module.exports = Responsavel;