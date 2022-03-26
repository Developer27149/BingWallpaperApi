// init aws
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const DynamoDBClient = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.AWS_TABLE_NAME;
const getItems = async () => {
  const params = {
    TableName,
  };
  return DynamoDBClient.scan(params).promise();
};

const addOneItem = async (Item) => {
  const params = {
    TableName,
    Item,
  };
  return DynamoDBClient.put(params).promise();
};

const getItemByDateNumber = async (date) => {
  const params = {
    TableName,
    Key: {
      date,
      like: 0,
    },
  };
  return DynamoDBClient.get(params).promise();
};

const getItemsByPagination = async (pagination) => {
  const params = {
    TableName,
    pagination,
  };
};

module.exports = {
  getItems,
  addOneItem,
  getItemByDateNumber,
};
