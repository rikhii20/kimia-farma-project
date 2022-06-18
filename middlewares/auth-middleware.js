const { Admin } = require("../models");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error-handler");

module.exports = {
  isLogin: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "No token detected",
          result: {},
        });
      }
      token = token.replace("Bearer ", "");
      jwt.verify(token, process.env.SECRET_TOKEN, async (error, decoded) => {
        if (error) {
          return res.status(401).json({
            status: "Unauthorized",
            message: "Invalid access token",
            result: {},
          });
        }
        const admin = await Admin.findOne({
          where: {
            id: decoded.id,
          },
        });
        if (!admin) {
          return res.status(401).json({
            status: "Unauthorized",
            message: "Admin not found",
            result: {},
          });
        }
        req.admin = {
          id: decoded.id,
          nama: decoded.nama,
        };
        next();
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
