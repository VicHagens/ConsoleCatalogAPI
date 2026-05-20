const Joi = require("joi");

function validateReview(review) {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(10).required(),
    comment: Joi.string().min(2).max(1000).required(),
  });

  return schema.validate(review);
}

function validateReviewUpdate(review) {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(10),
    comment: Joi.string().min(2).max(1000),
  }).or("rating", "comment");

  return schema.validate(review);
}

module.exports = {
  validateReview,
  validateReviewUpdate,
};
