'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contrato extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contrato.belongsTo(models.Projeto, { foreignKey: 'projeto_id' });
      Contrato.belongsTo(models.InteresseHasUsuario, { foreignKey: 'interesse_id' });
      Contrato.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    }
  }
  Contrato.init({
    data_inicio: DataTypes.STRING,
    data_fim: DataTypes.STRING,
    status: DataTypes.STRING,
    projeto_id: DataTypes.INTEGER,
    interesse_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Contrato',
    tableName: 'contratos'
  });
  return Contrato;
};