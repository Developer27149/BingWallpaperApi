const initCache = () => {
  globalThis["itemsMap"] = new Map();
};
const getItemCache = (key) => globalThis["itemsMap"][key];
const setItemCache = (key, value) => {
  if (globalThis["itemsMap"].size >= 100) {
    const iterator = globalThis["itemsMap"].keys();
    const oldestKey = iterator.next().value;
    globalThis["itemsMap"].delete(oldestKey);
  }
  globalThis["itemsMap"].set(key, value);
};

module.exports = {
  initCache,
  getItemCache,
  setItemCache,
};
