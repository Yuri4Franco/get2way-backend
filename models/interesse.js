'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Interesse extends Model {
    static associate(models) {
      Interesse.belongsTo(models.Oferta, {
        foreignKey: 'oferta_id', 
        as: 'Oferta'
      });
      Interesse.hasOne(models.Parceria, {
        foreignKey: 'interesse_id',
      });
      Interesse.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
      });
    }
  }
  
  const STATUS = {
    PENDENTE: 'pendente',
    ACEITO: 'aceito',
    RECUSADO: 'rejeitado',
  };

  Interesse.init({
    proposta: DataTypes.STRING,
    oferta_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: Object.values(STATUS),
      defaultValue: STATUS.PENDENTE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Interesse',
    tableName: 'interesses'
  });

  Interesse.STATUS = STATUS;

  return Interesse;
};