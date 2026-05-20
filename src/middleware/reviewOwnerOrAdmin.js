const mongoose = require("mongoose");
const Review = require("../models/review");

async function reviewOwnerOrAdminMiddleware(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid review id.");
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).send("Review not found.");
    }

    const isOwner = review.user.toString() === req.user._id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).send("Access denied.");
    }

    req.review = review;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = reviewOwnerOrAdminMiddleware;
