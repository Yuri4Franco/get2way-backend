const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Interesse = require('./interesseModel');
const Usuario = require('./usuarioModel');

const InteresseHasUsuario = sequelize.define('InteresseHasUsuario', {}, {
    tableName: 'interesse_has_usuario',
    timestamps: false
  }
);

InteresseHasUsuario.belongsTo(Interesse, { foreignKey: 'interesse_id' });
InteresseHasUsuario.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = InteresseHasUsuario;
