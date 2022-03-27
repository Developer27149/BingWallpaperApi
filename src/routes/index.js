const joi = require("joi");
const express = require("express");
const { run } = require("../utils/spider");
const router = express.Router();
// const { getItemByDateNumber, addOneItem, getItems } = require("../database");
const { getItemByDate, setItem, getItemsByFilter } = require("../database");
const { getItemCache, setItemCache } = require("../utils/cache");
const { itemSchema, filterSchema } = require("../utils/dataFormatCheck.js");

router.post("/item/get", async (req, res) => {
  try {
    const { body } = req;
    let result;
    const { error, value } = filterSchema.validate(body);
    if (!error) {
      result = await getItemsByFilter(value);
    }
    res.json({ status: 200, msg: error ?? "success", result });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, msg: "获取失败", result: {} });
  }
});

router.get("/item/get/:date", async (req, res) => {
  const date = req.params.date;
  try {
    let item = getItemCache(date);
    if (item === undefined) {
      item = await getItemByDate(date);
      console.log("get item by db:", item);
      item && setItemCache(item);
    }
    res.json({ status: 200, msg: "success...", result: item });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, msg: "服务器数据获取出了问题😭", result: {} });
  }
});

router.post("/item/add", async (req, res) => {
  try {
    const { body } = req;
    const { error, value } = itemSchema.validate(body);
    // await addOneItem(body);
    const msg = await setItem(value);
    res.status(200).json({
      status: 200,
      msg: error?.message ?? msg,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "500",
      msg: error,
    });
  }
});

module.exports = router;
