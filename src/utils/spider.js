const Crawler = require("crawler");
const run = () => {
  return new Promise((resolve, reject) => {
    const c = new Crawler({
      callback: (err, res, done) => {
        try {
          // 请求完毕的回调
          console.log("🕷".repeat(10));
          if (err) {
            console.log("error:", err);
          } else {
            // Cheerio 解析器
            var $ = res.$;
            resolve(
              $("head link#preloadBg")
                .attr("href")
                .replace(/&rf=.*$/, "")
            );
          }
          done();
          reject("=.=");
        } catch (error) {}
      },
      // config
      maxConnections: 5,
      rateLimit: 100,
      incomingEncoding: null,
    });
    c.queue("https://cn.bing.com/?setmkt=en-us&setlang=en-us");
  });
};

module.exports = { run };
