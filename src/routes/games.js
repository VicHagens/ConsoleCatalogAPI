const express = require("express");
const mongoose = require("mongoose");
const Game = require("../models/game");

const router = express.Router();

// GET /api/games - Get all games
router.get("/", async (req, res, next) => {
  try {
    const games = await Game.find()
      .populate("franchise", "name")
      .populate("consoles", "name releaseYear")
      .populate("publisher", "name")
      .sort("title");

    res.send(games);
  } catch (error) {
    next(error);
  }
});

// GET /api/games/:id - Get game by id
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid game id.");
    }

    const game = await Game.findById(req.params.id)
      .populate("franchise", "name")
      .populate("consoles", "name releaseYear")
      .populate("publisher", "name");

    if (!game) {
      return res.status(404).send("Game not found.");
    }

    res.send(game);
  } catch (error) {
    next(error);
  }
});

module.exports = router;