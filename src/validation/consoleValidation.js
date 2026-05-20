const Joi = require("joi");

const specsSchema = Joi.object({
  cpu: Joi.string().max(100).allow(""),
  memory: Joi.string().max(100).allow(""),
  media: Joi.string().max(100).allow(""),
  maxResolution: Joi.string().max(50).allow(""),
});

function validateConsole(consoleItem) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    brand: Joi.string().hex().length(24).required(),
    generation: Joi.number().integer().min(1).max(10),
    releaseYear: Joi.number().integer().min(1970).max(new Date().getFullYear()).required(),
    description: Joi.string().max(1000).allow(""),
    specs: specsSchema,
  });

  return schema.validate(consoleItem);
}

module.exports = validateConsole;
