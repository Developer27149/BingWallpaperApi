const express = require("express");
const { run } = require("../utils/spider");
const router = express.Router();

router.get("/", async (_, res) => {
  try {
    let url;
    const day = new Date().getDay();
    if (globalThis.day === day && globalThis.url) {
      url = globalThis.url;
    } else {
      url = await run();
      globalThis.day = day;
      globalThis.url = url;
    }
    res.json({ url, hdUrl: url.replace("1920x1080", "UHD") });
  } catch (error) {
    res.json({ url: null });
  }
});

module.exports = router;
