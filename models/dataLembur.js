"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DataLembur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DataLembur.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
    }
  }
  DataLembur.init(
    {
      tanggal: DataTypes.DATEONLY,
      uraian_pekerjaan: DataTypes.STRING,
      jam_datang: DataTypes.TIME,
      jam_pulang: DataTypes.TIME,
      istirahat: DataTypes.INTEGER,
      durasi: DataTypes.FLOAT,
      goal_pekerjaan: DataTypes.STRING,
      datetime: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DataLembur",
    }
  );
  return DataLembur;
};
