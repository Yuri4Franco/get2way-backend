const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Programa = require('./programaModel');
const Impulso = require('./impulsoModel');

const Projeto = sequelize.define('Projeto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  trl: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  acatech: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  data_fim: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  justificativas: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  objsmart: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  beneficios: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  produto: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  requisitos: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  steakholders: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  equipe: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  premissas: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  grupo_de_entrega: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  restricoes: {
    type: DataTypes.STRING(255),
  },
  riscos: {
    type: DataTypes.STRING(255),
  },
  linha_do_tempo: {
    type: DataTypes.STRING(255),
  },
  custos: {
    type: DataTypes.STRING(255),
  },
  upload: {
    type: DataTypes.STRING(255),
  },
  programa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Programa,
      key: 'id',
    }
  },
  impulso_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Impulso,
      key: 'id',
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'projeto',
  timestamps: false
});
Programa.hasMany(Projeto, { foreignKey: 'programa_id' });
Projeto.belongsTo(Programa, { foreignKey: 'programa_id' });

Projeto.hasOne(Impulso, { foreignKey: 'projeto_id' });
Impulso.belongsTo(Projeto, { foreignKey: 'projeto_id' });

module.exports = Projeto;
