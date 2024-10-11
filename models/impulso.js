'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Impulso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Impulso.init({
    tipo: DataTypes.STRING,
    descricao: DataTypes.STRING,
    valor: DataTypes.STRING,
    data_inicio: DataTypes.STRING,
    data_fim: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Impulso',
  });
  return Impulso;
};