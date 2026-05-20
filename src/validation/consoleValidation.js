const Joi = require("joi");

function validateConsole(consoleItem) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    brand: Joi.string().hex().length(24).required(),
    generation: Joi.number().integer().min(1).max(10),
    releaseYear: Joi.number().integer().min(1970).max(new Date().getFullYear()),
    description: Joi.string().max(1000).allow(""),
  });

  return schema.validate(consoleItem);
}

module.exports = validateConsole;
