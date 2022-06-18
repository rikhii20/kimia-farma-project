"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.DataLembur, {
        as: "data_lemburs",
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      nama: DataTypes.STRING,
      status_kepegawaian: DataTypes.ENUM("pt", "pkwt", "outsource"),
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
