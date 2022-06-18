const express = require("express");
const router = express.Router();
const authRoute = require("./auth-route");
const userRoute = require("./user-route");
const dataLemburRoute = require("./data-lembur-route");

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/data-lembur", dataLemburRoute);

module.exports = router;
