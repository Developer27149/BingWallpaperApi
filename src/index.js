require("dotenv").config();
const bodyParser = require("body-parser");
const { initCache } = require("./utils/cache");
const express = require("express");
const router = require("./routes");
const { _404 } = require("./routes/404");

// init globalThis cache
initCache();

// init app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.use(_404);

app.listen(process.env.PORT || 9696, () => {
  console.log("LET'S GO.");
});
