'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Interesse extends Model {
    static associate(models) {
      Interesse.belongsTo(models.Oferta, {
        foreignKey: 'oferta_id',
      });
      Interesse.belongsToMany(models.Usuario, {
        through: 'interesse_has_usuarios',
        foreignKey: 'interesse_id',
        as: 'usuarios', // Alias para facilitar a busca
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
