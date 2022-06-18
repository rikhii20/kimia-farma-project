module.exports = function (error, res) {
  console.log(error)
  return res.status(500).json({
    status: "Internal Server Error",
    message: error.message,
    result: {},
  });
};
