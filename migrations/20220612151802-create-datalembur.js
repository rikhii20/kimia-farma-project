"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DataLemburs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.DATEONLY,
      },
      uraian_pekerjaan: {
        type: Sequelize.STRING,
      },
      jam_datang: {
        type: Sequelize.TIME,
      },
      jam_pulang: {
        type: Sequelize.TIME,
      },
      istirahat: {
        type: Sequelize.INTEGER,
      },
      durasi: {
        type: Sequelize.INTEGER,
      },
      goal_pekerjaan: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DataLemburs");
  },
};
