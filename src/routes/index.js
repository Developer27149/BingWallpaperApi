const joi = require("joi");
const express = require("express");
const { run } = require("../utils/spider");
const router = express.Router();
const _ = require("lodash");
const {
  getItemByDate,
  getAllItems,
  addItem,
  getItemsByFilter,
  updateItem,
} = require("../database");
const { getItemCache, setItemCache } = require("../utils/cache");
const { itemSchema, filterSchema } = require("../utils/dataFormatCheck.js");
const dayjs = require("dayjs");

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
      if (!_.isEmpty(item)) {
        setItemCache(date, item);
      } else {
        const url = await run();
        item = {
          date: dayjs().format("YYYY-MM-DD"),
          like: 0,
          url,
          uhdUrl: url.replace("1920x1080", "UHD"),
        };
        setItemCache(date, item);
        addItem(item);
      }
    }
    res.json({ status: 200, msg: "success...", result: item });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, msg: "服务器数据获取出了问题😭", result: {} });
  }
});

router.get("/item/today", async (req, res) => {
  try {
    const date = dayjs().format("YYYY-MM-DD");
    let item = getItemCache(date);
    if (!item) {
      // 从数据库查是否有今天的数据
      const _item = await getItemByDate(date);
      if (_.isEmpty(_item)) {
        const url = await run();
        item = {
          date,
          like: 0,
          url,
          uhdUrl: url.replace("1920x1080", "UHD"),
        };
        setItemCache(date, item);
        updateItem(item);
      } else {
        item = _item;
      }
    }
    res.json({ status: 200, msg: "success!", result: item });
  } catch (error) {
    console.log("Unable to get today item,", error);
    res.json({
      status: 500,
      msg: "unable to get item at today.sorry.",
      result: null,
    });
  }
});

router.post("/item/add", async (req, res) => {
  try {
    const { body } = req;
    const { error, value } = itemSchema.validate(body);
    // await addOneItem(body);
    const msg = await addItem(value);
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
