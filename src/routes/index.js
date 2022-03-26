const joi = require("joi");
const express = require("express");
const { run } = require("../utils/spider");
const router = express.Router();
const { getItemByDateNumber, addOneItem, getItems } = require("../database");
const { getItemCache, setItemCache } = require("../utils/cache");
const { itemSchema } = require("../utils/dataFormatCheck.js");

router.get("/items/get", async (_, res) => {
  try {
    const items = await getItems();
    res.json({ status: 200, msg: "success", result: items });
  } catch (error) {
    res.json({ status: 500, msg: "获取失败", result: {} });
  }
});

router.get("/item/get/:date", async (req, res) => {
  const date = req.params.date;
  try {
    let item = getItemCache(date);
    if (item === undefined) {
      item = await getItemByDateNumber(date);
      setItemCache(item);
    }
    res.json({ status: 200, msg: "success", result: item });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, msg: "服务器数据获取出了问题😭", result: {} });
  }
});

router.post("/item/add", async (req, res) => {
  try {
    const { body } = req;
    const { error } = itemSchema.validate(body);
    await addOneItem(body);
    res.status(200).json({
      status: 200,
      msg: error?.message ?? "success",
    });
  } catch (error) {
    res.json({
      status: "500",
      msg: error,
    });
  }
});

module.exports = router;
