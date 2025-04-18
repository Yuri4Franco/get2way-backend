'use strict';
const {
  Model
} = require('sequelize');
const responsavel = require('./responsavel');
module.exports = (sequelize, DataTypes) => {
  class Projeto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Projeto.belongsTo(models.Programa, { foreignKey: 'programa_id' });
      Projeto.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'Responsavel' });
      Projeto.hasMany(models.Oferta, { foreignKey: 'projeto_id' });
      Projeto.belongsTo(models.Impulso, { foreignKey: 'impulso_id', as: 'Impulso' });
      Projeto.belongsToMany(models.Keyword, {
        through: 'projeto_keywords', // Tabela intermediária
        foreignKey: 'projeto_id',
        as: 'keywords' // Alias para facilitar a busca
      });
    }
  }
  Projeto.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    data_inicio: DataTypes.DATE,
    data_fim: DataTypes.DATE,
    status: DataTypes.STRING,
    trl: DataTypes.INTEGER,
    acatech: DataTypes.INTEGER,
    prioridade: DataTypes.STRING,
    justificativas: DataTypes.STRING,
    objsmart: DataTypes.STRING,
    beneficios: DataTypes.STRING,
    produto: DataTypes.STRING,
    requisitos: DataTypes.STRING,
    stakeholders: DataTypes.STRING,
    equipe: DataTypes.STRING,
    premissas: DataTypes.STRING,
    grupo_de_entrega: DataTypes.STRING,
    restricoes: DataTypes.STRING,
    riscos: DataTypes.STRING,
    linha_do_tempo: DataTypes.STRING,
    custos: DataTypes.STRING,
    upload: DataTypes.STRING,
    programa_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
    impulso_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Projeto',
    tableName: 'projetos'
  });
  return Projeto;
};