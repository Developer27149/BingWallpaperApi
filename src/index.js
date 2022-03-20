const express = require("express");
require("dotenv").config();

const app = express();

app.get("/", async (req, res) => {
  res.send("index");
});

app.listen(process.env.PORT, () => {
  console.log("App is listen:", process.env.PORT);
});
