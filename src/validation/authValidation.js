const Joi = require("joi");

function validateRegister(user) {
  // Role is not included here because users are not allowed to make themselves admin.
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(user);
}

function validateLogin(login) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(login);
}

module.exports = {
  validateRegister,
  validateLogin,
};
