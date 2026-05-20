const Joi = require("joi");

function validateReview(review) {
  const schema = Joi.object({
    game: Joi.string().hex().length(24).required(),
    rating: Joi.number().integer().min(1).max(10).required(),
    comment: Joi.string().min(2).max(1000).required(),
  });

  return schema.validate(review);
}

module.exports = validateReview;
