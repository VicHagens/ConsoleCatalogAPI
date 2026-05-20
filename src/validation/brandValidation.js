const Joi = require("joi");

function validateBrand(brand) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()),
    description: Joi.string().max(1000).allow(""),
  });

  return schema.validate(brand);
}

module.exports = validateBrand;
