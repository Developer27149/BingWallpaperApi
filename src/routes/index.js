const joi = require("joi");
const express = require("express");
const { run } = require("../utils/spider");
const router = express.Router();
const _ = require("lodash");
const axios = require("axios").default;

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
      if (!_.isEmpty(item)) {
        setItemCache(date, item);
      } else {
        item = null;
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
        console.log("data not found in aws db");
        const url = await run();
        item = {
          date,
          like: 0,
          url,
          uhdUrl: url.replace("1920x1080", "UHD"),
        };
        setItemCache(date, item);
        addItem(item);
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

router.get("/item/week", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&uhd=1&uhdwidth=3840&uhdheight=2160"
    );
    res.json({
      status: 200,
      msg: "success",
      result: data["images"].map((img) => ({
        url: img.url.replace("/&.*$/", "").replace("UHD", "1920x1080"),
        uhdUrl: img.url,
        like: 0,
        date: dayjs(img.startdate).format("YYYY-MM-DD"),
        title: img.title,
      })),
    });
  } catch (error) {
    res.json({
      status: 500,
      msg: "Unable to get this week data",
      result: null,
    });
  }
});

module.exports = router;
