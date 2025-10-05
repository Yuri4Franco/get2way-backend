"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_views", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "projetos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      viewed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex("project_views", ["project_id"], {
      name: "idx_project_views_project_id",
    });

    await queryInterface.addIndex("project_views", ["viewed_at"], {
      name: "idx_project_views_viewed_at",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("project_views");
  },
};
