const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/review");
const Game = require("../models/game");

const router = express.Router();

// get reviews for a specific game has yet to be added later

// GET /api/games/reviews - Get all reviews
router.get("/", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid game id.");
    }
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(400).send("Game not found.");
    }

    const reviews = await Review.find({ game: req.params.id })
      .populate("user", "name email")
      .populate("game", "title releaseYear")
      .sort("-createdAt");

    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
