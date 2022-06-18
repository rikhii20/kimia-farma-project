const { Admin } = require("../models");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error-handler");

module.exports = {
  register: async (req, res) => {
    const { email, password } = req.body;
    try {
      const schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required()
      });
      const { error } = schema.validate({
        email,
        password
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const check = await Admin.findOne({
        where: {
          email,
        },
      });
      if (check) {
        return res.status(400).json({
          status: "Bad Request",
          message: "Email has already exist",
          result: {},
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({
        email,
        password: hashPassword
      });
      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      return res.status(201).json({
        status: "Success",
        message: "Successfully to register",
        result: {
          token,
          user: admin.email
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required(),
      });
      const { error } = schema.validate({ email, password });
      if (error) {
        return res.status(400).json({
          status: "Bad request",
          message: error.message,
          result: {},
        });
      }
      const admin = await Admin.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        return res.status(400).json({
          status: "Bad request",
          message: "Invalid email or password",
          result: {},
        });
      }
      const passwordValid = await bcrypt.compare(password, admin.password);
      if (!passwordValid) {
        return res.status(400).json({
          status: "Bad request",
          message: "Invalid email or password",
          result: {},
        });
      }
      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      return res.status(201).json({
        status: "Success",
        message: "Successfully to login",
        result: {
          token,
          user: admin.email
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
