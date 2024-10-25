'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Oferta extends Model {
    static associate(models) {
      Oferta.hasMany(models.Interesse, {
        foreignKey: 'oferta_id',
        as: 'interesses', // Alias para facilitar a busca
      });
      Oferta.belongsTo(models.Projeto, {
        foreignKey: 'projeto_id',
      });
      Oferta.belongsTo(models.Impulso, { foreignKey: 'impulso_id' });
    }
  }
  Oferta.init({
    data_inicio: DataTypes.DATE,
    data_fim: DataTypes.DATE,
    projeto_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Oferta',
    tableName: 'ofertas'
  });
  return Oferta;
};
