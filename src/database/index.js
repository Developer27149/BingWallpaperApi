const _ = require("lodash");
const { convertFilterToDateList } = require("../utils/index.js");
const AWS = require("aws-sdk");
const config = {
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
};
AWS.config.update(config);
const client = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.AWS_TABLE_NAME;

const getItemByDate = async (date) => {
  try {
    const params = {
      TableName,
      Key: { date },
    };
    return client.get(params).promise();
  } catch (error) {
    console.log(`Unable to get item at ${date},error: ${error}`);
  }
};

const addItem = async (Item) => {
  try {
    const params = {
      TableName,
      Item,
    };
    return client.put(params).promise();
  } catch (error) {
    console.log("Unable to add item,", error);
  }
};

const getItemsByFilter = async (filter) => {
  try {
    const list = convertFilterToDateList(filter);
    const params = {
      RequestItems: {
        [TableName]: {
          Keys: list,
        },
      },
    };
    return client.batchGet(params).promise();
  } catch (error) {
    console.log("Unable to get items by date,", error);
  }
};

const getAllItems = async () => {
  try {
    const params = {
      TableName,
    };
    console.log(params);
    return client.scan(params).promise();
  } catch (error) {
    console.log("Unable to scan items,", error);
  }
};

const updateItem = ({ date, like, url, uhdUrl }) => {
  const params = {
    TableName,
    Key: { date },
    UpdateExpression: "set like = :l, url = :u, uhdUrl = :uhd",
    ExpressionAttributeValues: {
      ":l": like,
      ":u": url,
      ":uhd": uhdUrl,
    },
  };
  console.log("Now, update a new item", { date, like, url, uhdUrl });
  return client.update(params).promise();
};

const deleteItem = (date) => {
  try {
    const params = {
      TableName,
      Key: { date },
    };
    return client.delete(params).promise();
  } catch (error) {
    console.log("Unable to delete item,", error);
  }
};

module.exports = {
  getItemByDate,
  addItem,
  getItemsByFilter,
  getAllItems,
  updateItem,
  deleteItem,
};
