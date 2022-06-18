const { User } = require("../models");
const joi = require("joi");
const errorHandler = require("../utils/error-handler");

module.exports = {
  createUser: async (req, res) => {
    const { nama, status_kepegawaian } = req.body;
    try {
      const schema = joi.object({
        nama: joi.string().required(),
        status_kepegawaian: joi.string().required(),
      });
      const { error } = schema.validate({ nama, status_kepegawaian });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const user = await User.create({
        nama,
        status_kepegawaian,
      });
      return res.status(201).json({
        status: "Success",
        message: "Success to create user",
        result: user,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      if (!users) {
        return res.status(200).json({
          status: "Not found",
          message: "User data is empty",
          result: [],
        });
      }
      return res.status(200).json({
        status: "Success",
        message: "Successfully to retrieve users",
        result: users,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getUser: async (req, res) => {
    const { id: user_id } = req.params;
    try {
      const user = await User.findOne({
        where: {
          id: user_id,
        },
      });
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
          result: {},
        });
      }
      return res.status(200).json({
        status: "Success",
        message: "Successfully to retrieve user",
        result: user,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  editUser: async (req, res) => {
    const { id: user_id } = req.params;
    const { nama, status_kepegawaian } = req.body;
    try {
      const schema = joi.object({
        nama: joi.string(),
        status_kepegawaian: joi.string(),
      });
      const { error } = schema.validate({ nama, status_kepegawaian });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const user = await User.findOne({
        where: {
          id: user_id,
        },
      });
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
          result: {},
        });
      }
      const updateUser = await User.update(
        { nama, status_kepegawaian },
        {
          where: {
            id: user_id,
          },
        }
      );
      if (updateUser[0] != 1) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed update the data / data not found",
          result: {},
        });
      }
      const updatedUser = await User.findOne({
        where: {
          id: user_id,
        },
      });
      return res.status(200).json({
        status: "Success",
        message: "Successfuly to update user",
        result: updatedUser,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteUser: async (req, res) => {
    const { id: user_id } = req.params;
    try {
      const user = await User.findOne({
        where: {
          id: user_id,
        },
      });
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
          result: {},
        });
      }
      await User.destroy({
        where: {
          id: user_id,
        },
      });
      return res.status(200).json({
        status: "Success",
        message: "Successfully to delete user",
        result: user,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
