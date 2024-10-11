'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjetoKeyword extends Model {
    static associate(models) {
      // Definindo relacionamentos
      ProjetoKeyword.belongsTo(models.Projeto, {
        foreignKey: 'projeto_id',
        as: 'Projeto',
      });
      ProjetoKeyword.belongsTo(models.Keyword, {
        foreignKey: 'keyword_id',
        as: 'Keyword',
      });
    }
  }

  ProjetoKeyword.init(
    {
      projeto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Projetos', // Nome da tabela de Projetos
          key: 'id',
        },
      },
      keyword_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Keywords', // Nome da tabela de Keywords
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ProjetoKeyword',
      tableName: 'projeto_keywords', // Nome da tabela intermediária
      timestamps: true, // Para gravar createdAt e updatedAt
    }
  );

  return ProjetoKeyword;
};
