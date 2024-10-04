'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rota extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rota.belongsTo(models.Empresa, { foreignKey: 'empresa_id' });
      Rota.hasMany(models.Programa, { foreignKey: 'rota_id' });
    }
  }
  Rota.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    empresa_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rota',
    tableName: 'rotas'
  });
  return Rota;
};