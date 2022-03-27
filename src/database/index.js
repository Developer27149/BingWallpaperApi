const _ = require("lodash");
const { convertFilterToDateList } = require("../utils/index.js");
// init aws
const dynasty = require("dynasty")({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const bingTable = dynasty.table(process.env.AWS_TABLE_NAME);

const getItemByDate = async (date) => {
  return bingTable.find({ hash: date });
};

const setItem = async (item) => {
  return bingTable.update(item.date, _.omit(item, ["date"]));
};

const getItemsByFilter = async (filter) => {
  const list = convertFilterToDateList(filter);
  return bingTable.batchFind(list);
};

module.exports = { getItemByDate, setItem, getItemsByFilter };
