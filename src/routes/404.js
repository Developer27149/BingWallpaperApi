module.exports = {
  _404: (_, res) => {
    res.status(404);
    res.json({ error: "Not found" });
    return;
  },
};
