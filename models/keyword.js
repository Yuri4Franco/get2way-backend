'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Keyword extends Model {
    static associate(models) {
      // Relacionamento N:N com Projetos
      Keyword.belongsToMany(models.Projeto, {
        through: 'projeto_keywords', // Tabela intermediária
        foreignKey: 'keyword_id',
      });
    }
  }
  Keyword.init(
    {
      nome: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Keyword',
      tableName: 'keywords',
    }
  );
  return Keyword;
};
