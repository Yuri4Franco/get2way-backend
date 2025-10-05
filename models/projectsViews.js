"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectView extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectView.belongsTo(models.Projeto, {
        foreignKey: "project_id",
        as: "projeto",
      });
    }
  }
  ProjectView.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      project_id: DataTypes.INTEGER,
      viewed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ProjectView",
      tableName: "project_views",
      underscored: true,
      timestamps: false,
    }
  );
  return ProjectView;
};
