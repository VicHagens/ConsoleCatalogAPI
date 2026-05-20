const Joi = require("joi");

function validateGame(game) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(150).required(),
    franchise: Joi.string().hex().length(24).allow(null, ""),
    consoles: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    publisher: Joi.string().hex().length(24).required(),
    releaseYear: Joi.number().integer().min(1970).max(new Date().getFullYear()).required(),
    genre: Joi.string().min(2).max(100).allow(""),
    description: Joi.string().max(1000).allow(""),
  });

  return schema.validate(game);
}

module.exports = validateGame;
