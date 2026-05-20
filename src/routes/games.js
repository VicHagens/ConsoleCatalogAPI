const express = require("express");
const mongoose = require("mongoose");
const Game = require("../models/game");
const Brand = require("../models/brand");
const Console = require("../models/console");
const Franchise = require("../models/franchise");
const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");
const validateGame = require("../validation/gameValidation");
const reviews = require("./reviews");

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

// Nested reviews need mergeParams in the reviews router to access gameId.
router.use("/:gameId/reviews", reviews);

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

// POST /api/games - Create a new game
router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { error } = validateGame(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const {
      title,
      franchise,
      consoles,
      publisher,
      releaseYear,
      genre,
      description,
      releaseInfo,
    } = req.body;

    const existingPublisher = await Brand.findById(publisher);

    if (!existingPublisher) {
      return res.status(404).send("Publisher not found.");
    }

    const existingConsoles = await Console.find({
      _id: { $in: consoles },
    });

    if (existingConsoles.length !== consoles.length) {
      return res.status(404).send("One or more consoles were not found.");
    }

    if (franchise) {
      const existingFranchise = await Franchise.findById(franchise);

      if (!existingFranchise) {
        return res.status(404).send("Franchise not found.");
      }
    }

    const game = new Game({
      title,
      franchise,
      consoles,
      publisher,
      releaseYear,
      genre,
      description,
      releaseInfo,
    });

    await game.save();
    res.status(201).send(game);
  } catch (error) {
    next(error);
  }
});

// PUT /api/games/:id - Update a game
router.put("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid game id.");
    }

    const { error } = validateGame(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const {
      title,
      franchise,
      consoles,
      publisher,
      releaseYear,
      genre,
      description,
      releaseInfo,
    } = req.body;

    const existingPublisher = await Brand.findById(publisher);

    if (!existingPublisher) {
      return res.status(404).send("Publisher not found.");
    }

    const existingConsoles = await Console.find({
      _id: { $in: consoles },
    });

    if (existingConsoles.length !== consoles.length) {
      return res.status(404).send("One or more consoles were not found.");
    }

    if (franchise) {
      const existingFranchise = await Franchise.findById(franchise);

      if (!existingFranchise) {
        return res.status(404).send("Franchise not found.");
      }
    }

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        title,
        franchise,
        consoles,
        publisher,
        releaseYear,
        genre,
        description,
        releaseInfo,
      },
      { new: true, runValidators: true },
    )
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

// DELETE /api/games/:id - Delete a game
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid game id.");
    }

    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) {
      return res.status(404).send("Game not found.");
    }

    res.send(game);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
