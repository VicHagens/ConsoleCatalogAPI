const Joi = require("joi");

function validateFranchise(franchise) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    createdBy: Joi.string().min(2).max(100).allow(""),
    firstReleaseYear: Joi.number().integer().min(1950).max(new Date().getFullYear()),
    description: Joi.string().max(1000).allow(""),
  });

  return schema.validate(franchise);
}

module.exports = validateFranchise;
