const joi = require("joi");

const itemSchema = joi.object({
  date: joi
    .string()
    .pattern(/\d{4}-\d{2}-\d{2}/)
    .required(),
  like: joi
    .number()
    .integer()
    .max(Number.MAX_SAFE_INTEGER)
    .min(Number.MIN_SAFE_INTEGER)
    .required(),
  url: joi.string().required().min(10).max(150),
  uhdUrl: joi.string().required().min(10).max(150),
});

module.exports = {
  itemSchema,
};
