'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Responsavel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Responsavel.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
      Responsavel.belongsTo(models.Empresa, { foreignKey: 'empresa_id' });
      Responsavel.belongsTo(models.Ict, { foreignKey: 'ict_id' });
    }
  }
  Responsavel.init({
    usuario_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Definindo como chave primária
    },
    cargo: DataTypes.STRING,
    empresa_id: DataTypes.INTEGER,
    ict_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Responsavel',
    tableName: 'responsaveis'
  });
  return Responsavel;
};