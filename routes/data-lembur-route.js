const express = require("express");
const router = express.Router();
const {
  createLembur,
  getDataLemburs,
  getDataLembur,
  editDataLembur,
  deleteDataLembur,
  exportDataToExcel,
} = require("../controllers/data-lembur-controller");
const { isLogin } = require("../middlewares/auth-middleware");

router.post("/", isLogin, createLembur);
router.get("/", isLogin, getDataLemburs);
router.get("/:id", isLogin, getDataLembur);
router.get("/export/:id", isLogin, exportDataToExcel);
router.put("/:id", isLogin, editDataLembur);
router.delete("/:id", isLogin, deleteDataLembur);

module.exports = router;
