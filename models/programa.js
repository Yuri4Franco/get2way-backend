'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Programa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Programa.belongsTo(models.Rota, { foreignKey: 'rota_id', as: 'Rota' });
      Programa.hasMany(models.Projeto, { foreignKey: 'programa_id' });
    }
  }
  Programa.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    rota_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Programa',
  });
  return Programa;
};