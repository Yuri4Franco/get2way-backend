'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parceria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Parceria.belongsTo(models.Interesse, { foreignKey: 'interesse_id' });
    }
  }
  Parceria.init({
    status: DataTypes.STRING,
    interesse_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Parceria',
    tableName: 'parcerias'
  });
  return Parceria;
};