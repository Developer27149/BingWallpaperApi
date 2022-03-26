const express = require("express");
const router = require("./routes");
const { _404 } = require("./routes/404");
require("dotenv").config();

const app = express();
app.use(router);
app.use(_404);

app.listen(process.env.PORT, () => {
  console.log("App is listen:", process.env.PORT);
});
