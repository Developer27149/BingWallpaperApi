const dayjs = require("dayjs");

module.exports = {
  convertFilterToDateList: (filter) => {
    const resList = [];
    const { pageSize, pageNum } = filter;
    const today = dayjs();
    const startDate = today.subtract(pageNum * pageSize, "day");
    // const endDate = startDate.add(pageSize, "day");
    for (let i = 0; i < pageSize; i++) {
      resList.push(startDate.add(i, "day").format("YYYY-MM-DD"));
    }
    return resList;
  },
};
