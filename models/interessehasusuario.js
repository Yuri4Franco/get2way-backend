'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InteresseHasUsuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      InteresseHasUsuario.belongsTo(models.Interesse, { foreignKey: 'interesse_id' });
      InteresseHasUsuario.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    }
  }
  InteresseHasUsuario.init({
    interesse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usuario_id:{      
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true}
  }, {
    sequelize,
    modelName: 'InteresseHasUsuario',
    tableName: 'interesse_has_usuarios'
  });
  return InteresseHasUsuario;
};