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
      // define association here
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