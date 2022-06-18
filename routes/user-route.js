const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  editUser,
  deleteUser,
} = require("../controllers/user-controller");
const { isLogin } = require("../middlewares/auth-middleware");

router.post("/", isLogin, createUser);
router.get("/", isLogin, getUsers);
router.get("/:id", isLogin, getUser);
router.put("/:id", isLogin, editUser);
router.delete("/:id", isLogin, deleteUser);

module.exports = router;
