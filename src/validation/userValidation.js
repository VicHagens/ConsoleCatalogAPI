const Joi = require("joi");

function validateUpdateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().min(5).max(255).required(),
    role: Joi.string().valid("user", "admin"),
  });

  return schema.validate(user);
}

module.exports = {
  validateUpdateUser,
};
