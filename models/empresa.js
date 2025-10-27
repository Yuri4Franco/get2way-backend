'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Empresa.hasMany(models.Rota, { foreignKey: 'empresa_id' });
      Empresa.hasMany(models.Responsavel, { foreignKey: 'empresa_id' });
      Empresa.hasMany(models.Impulso, { foreignKey: 'empresa_id' });
    }
  }
  Empresa.init({
    nome: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    razao_social: DataTypes.STRING,
    endereco: DataTypes.STRING,
    cidade: DataTypes.STRING,
    uf: DataTypes.STRING,
    area: DataTypes.STRING,
    telefone: DataTypes.STRING,
    email: DataTypes.STRING,
    site: DataTypes.STRING,
    foto_perfil: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresas'
  });
  return Empresa;
};