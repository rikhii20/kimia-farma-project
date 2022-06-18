const { DataLembur, User } = require("../models");
const joi = require("joi").extend(require("@joi/date"));
const errorHandler = require("../utils/error-handler");
const moment = require("moment");

module.exports = {
  createLembur: async (req, res) => {
    const {
      tanggal,
      uraian_pekerjaan,
      jam_datang,
      jam_pulang,
      istirahat,
      goal_pekerjaan,
      user_id,
    } = req.body;

    try {
      const schema = joi.object({
        tanggal: joi.date().format("YYYY-MM-DD").required(),
        uraian_pekerjaan: joi.string().required(),
        jam_datang: joi
          .string()
          .regex(/^([0-9]{2})\:([0-9]{2}):([0-9]{2})$/)
          .required(),
        jam_pulang: joi
          .string()
          .regex(/^([0-9]{2})\:([0-9]{2}):([0-9]{2})$/)
          .required(),
        istirahat: joi.number().required(),
        goal_pekerjaan: joi.string().required(),
        user_id: joi.number().required(),
      });
      const { error } = schema.validate({
        tanggal,
        uraian_pekerjaan,
        jam_datang,
        jam_pulang,
        istirahat,
        goal_pekerjaan,
        user_id,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const datang = new Date(`${tanggal}T${jam_datang}Z`);
      const pulang = new Date(`${tanggal}T${jam_pulang}Z`);
      const diff = (pulang - datang) / 3600000 - istirahat;
      const dataLembur = await DataLembur.create({
        tanggal,
        uraian_pekerjaan,
        jam_datang,
        jam_pulang,
        istirahat,
        durasi: diff,
        goal_pekerjaan,
        datetime: new Date(datang).toLocaleString(),
        user_id,
      });
      return res.status(201).json({
        status: "Success",
        message: "Successfully create the data",
        result: dataLembur,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getDataLemburs: async (req, res) => {
    try {
      const dataLembur = await DataLembur.findAll({
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "nama", "status_kepegawaian"],
          },
        ],
      });
      return res.status(200).json({
        status: "Success",
        message: "Successfully to retrieve the data lembur",
        result: dataLembur,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getDataLembur: async (req, res) => {
    const { id: data_id } = req.params;
    try {
      const dataLembur = await DataLembur.findOne({
        where: {
          id: data_id,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "nama", "status_kepegawaian"],
          },
        ],
      });
      if (!dataLembur) {
        return res.status(404).json({
          status: "Not found",
          message: "Data lembur is not found",
          result: {},
        });
      }
      return res.status(200).json({
        status: "Success",
        message: "Successfully to retrieve the data",
        result: dataLembur,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  editDataLembur: async (req, res) => {
    const { id: data_id } = req.params;
    const {
      tanggal,
      uraian_pekerjaan,
      jam_datang,
      jam_pulang,
      istirahat,
      goal_pekerjaan,
      user_id,
    } = req.body;

    try {
      const schema = joi.object({
        tanggal: joi.date().format("YYYY-MM-DD"),
        uraian_pekerjaan: joi.string(),
        jam_datang: joi.string().regex(/^([0-9]{2})\:([0-9]{2}):([0-9]{2})$/),
        jam_pulang: joi.string().regex(/^([0-9]{2})\:([0-9]{2}):([0-9]{2})$/),
        istirahat: joi.number(),
        goal_pekerjaan: joi.string(),
        user_id: joi.number(),
      });
      const { error } = schema.validate({
        tanggal,
        uraian_pekerjaan,
        jam_datang,
        jam_pulang,
        istirahat,
        goal_pekerjaan,
        user_id,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const dataLembur = await DataLembur.findOne({
        where: { id: data_id },
      });

      const tanggalLembur = dataLembur.tanggal;
      const durasi = dataLembur.durasi;
      const jamDatang = dataLembur.jam_datang;
      const jamPulang = dataLembur.jam_pulang;
      const durasiIstirahat = dataLembur.istirahat;

      if (!dataLembur) {
        if (!dataLembur) {
          return res.status(404).json({
            status: "Not found",
            message: "Data lembur is not found",
            result: {},
          });
        }
      }
      const updateData = await DataLembur.update(
        {
          tanggal,
          uraian_pekerjaan,
          jam_datang,
          jam_pulang,
          istirahat,
          goal_pekerjaan,
          user_id,
        },
        {
          where: {
            id: data_id,
          },
        }
      );
      if (updateData[0] != 1) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed update the data / data not found",
          result: {},
        });
      }
      const updatedDataLembur = await DataLembur.findOne({
        where: {
          id: data_id,
        },
      });
      if (
        jamDatang != updatedDataLembur.jam_datang ||
        jamPulang != updatedDataLembur.jam_pulang ||
        durasiIstirahat != updatedDataLembur.istirahat ||
        tanggalLembur != updatedDataLembur.tanggal
      ) {
        const datang = new Date(
          `${updatedDataLembur.tanggal}T${updatedDataLembur.jam_datang}Z`
        );
        const pulang = new Date(
          `${updatedDataLembur.tanggal}T${updatedDataLembur.jam_pulang}Z`
        );
        const diff = (pulang - datang) / 3600000 - updatedDataLembur.istirahat;
        await DataLembur.update(
          {
            durasi: diff,
            datetime: new Date(datang).toLocaleString(),
          },
          {
            where: {
              id: data_id,
            },
          }
        );
      } else {
        await DataLembur.update(
          {
            durasi: durasi,
          },
          {
            where: {
              id: data_id,
            },
          }
        );
      }
      const updatedDatas = await DataLembur.findOne({
        where: {
          id: data_id,
        },
      });

      return res.status(200).json({
        status: "Success",
        message: "Successfuly to update data lembur",
        result: updatedDatas,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteDataLembur: async (req, res) => {
    const { id: data_id } = req.params;
    try {
      const dataLembur = await DataLembur.findOne({
        id: data_id,
      });
      if (!dataLembur) {
        return res.status(404).json({
          status: "Not Found",
          message: "Data is not found",
          result: {},
        });
      }
      await DataLembur.destroy({ where: { id: data_id } });
      return res.status(200).json({
        status: "Success",
        message: "Successfully to delete the data",
        result: dataLembur,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
