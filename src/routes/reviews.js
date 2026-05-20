const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/review");
const Game = require("../models/game");
const authMiddleware = require("../middleware/auth");
const validateReview = require("../validation/reviewValidation");

const router = express.Router({ mergeParams: true });

// GET /api/reviews - Get all reviews
router.get("/", async (req, res, next) => {
  try {
    if (req.params.gameId) {
      if (!mongoose.Types.ObjectId.isValid(req.params.gameId)) {
        return res.status(400).send("Invalid game id.");
      }

      const game = await Game.findById(req.params.gameId);

      if (!game) {
        return res.status(404).send("Game not found.");
      }

      const reviews = await Review.find({ game: req.params.gameId })
        .populate("user", "name email")
        .populate("game", "title releaseYear")
        .sort("-createdAt");

      return res.send(reviews);
    }

    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("game", "title releaseYear")
      .sort("-createdAt");

    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/:id - Get review by id
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid review id.");
    }

    const review = await Review.findById(req.params.id)
      .populate("user", "name email")
      .populate("game", "title releaseYear");

    if (!review) {
      return res.status(404).send("Review not found.");
    }

    res.send(review);
  } catch (error) {
    next(error);
  }
});

// POST /api/games/:gameId/reviews - Create a review for a game
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    if (!req.params.gameId) {
      return res.status(400).send("Game id is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.gameId)) {
      return res.status(400).send("Invalid game id.");
    }

    const { error } = validateReview(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { rating, comment } = req.body;

    const existingGame = await Game.findById(req.params.gameId);

    if (!existingGame) {
      return res.status(404).send("Game not found.");
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      game: req.params.gameId,
    });

    if (existingReview) {
      return res.status(400).send("You already reviewed this game.");
    }

    const review = new Review({
      user: req.user._id,
      game: req.params.gameId,
      rating,
      comment,
    });

    await review.save();

    const savedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("game", "title releaseYear");

    res.status(201).send(savedReview);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
