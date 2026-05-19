const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/review");

const router = express.Router();

// get reviews for a specific game has yet to be added later

// GET /api/reviews - Get all reviews
router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("game", "title releaseYear")
      .sort("-createdAt");

    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
