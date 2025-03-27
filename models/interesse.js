'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Interesse extends Model {
    static associate(models) {
      Interesse.belongsTo(models.Oferta, {
        foreignKey: 'oferta_id', as: 'Oferta'
      });
      Interesse.hasOne(models.Parceria, {
        foreignKey: 'interesse_id',
      });
      Interesse.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
      });
    }
  }
  Interesse.init({
    proposta: DataTypes.STRING,
    oferta_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Interesse',
    tableName: 'interesses'
  });
  return Interesse;
};
