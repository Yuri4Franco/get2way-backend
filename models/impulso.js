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
      Impulso.belongsTo(models.Empresa, { foreignKey: 'empresa_id' });
      Impulso.hasMany(models.Projeto, { foreignKey: 'impulso_id', as: 'Projetos' });
    }
  }
  Impulso.init({
    descricao: DataTypes.STRING,
    valor: DataTypes.STRING,
    empresa_id: DataTypes.INTEGER,
    data_inicio: DataTypes.STRING,
    data_fim: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Impulso',
  });
  return Impulso;
};