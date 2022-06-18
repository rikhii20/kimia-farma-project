require("dotenv").config()
const express = require("express");
const morgan = require("morgan")
const app = express();
const port = process.env.PORT || 1313;
const cors = require("cors")
const routes = require("./routes")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use("/api/v1", routes)

app.listen(port, () => {
  console.log("app is running at port", port);
});
