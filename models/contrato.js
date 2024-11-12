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
      Contrato.belongsTo(models.Interesse, { foreignKey: 'interesse_id' });
    }
  }
  Contrato.init({
    data_inicio: DataTypes.DATE,
    data_fim: DataTypes.DATE,
    status: DataTypes.STRING,
    interesse_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Contrato',
    tableName: 'contratos'
  });
  return Contrato;
};