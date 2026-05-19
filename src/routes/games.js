const express = require("express");
const mongoose = require("mongoose");
const Game = require("../models/game");
const Brand = require("../models/brand");
const ConsoleModel = require("../models/console");
const Franchise = require("../models/franchise");

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

// POST /api/games - Create a new game
router.post("/", async (req, res, next) => {
  try {
    const {
      title,
      franchise,
      consoles,
      publisher,
      releaseYear,
      genre,
      description,
    } = req.body;

    if (!title || !consoles || !publisher || !releaseYear) {
      return res.status(400).send("Title, consoles, publisher and release year are required.");
    }

    if (!Array.isArray(consoles) || consoles.length === 0) {
      return res.status(400).send("Consoles must be a non-empty array.");
    }

    if (!mongoose.Types.ObjectId.isValid(publisher)) {
      return res.status(400).send("Invalid publisher id.");
    }

    for (const consoleId of consoles) {
      if (!mongoose.Types.ObjectId.isValid(consoleId)) {
        return res.status(400).send("Invalid console id.");
      }
    }

    if (franchise && !mongoose.Types.ObjectId.isValid(franchise)) {
      return res.status(400).send("Invalid franchise id.");
    }

    const existingPublisher = await Brand.findById(publisher);

    if (!existingPublisher) {
      return res.status(404).send("Publisher not found.");
    }

    const existingConsoles = await ConsoleModel.find({ _id: { $in: consoles } });

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
    });

    await game.save();
    res.status(201).send(game);
  } catch (error) {
    next(error);
  }
});

// PUT /api/games/:id - Update a game
router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid game id.");
    }

    const {
      title,
      franchise,
      consoles,
      publisher,
      releaseYear,
      genre,
      description,
    } = req.body;

    if (!title || !consoles || !publisher || !releaseYear) {
      return res.status(400).send("Title, consoles, publisher and release year are required.");
    }

    if (!Array.isArray(consoles) || consoles.length === 0) {
      return res.status(400).send("Consoles must be a non-empty array.");
    }

    if (!mongoose.Types.ObjectId.isValid(publisher)) {
      return res.status(400).send("Invalid publisher id.");
    }

    for (const consoleId of consoles) {
      if (!mongoose.Types.ObjectId.isValid(consoleId)) {
        return res.status(400).send("Invalid console id.");
      }
    }

    if (franchise && !mongoose.Types.ObjectId.isValid(franchise)) {
      return res.status(400).send("Invalid franchise id.");
    }

    const existingPublisher = await Brand.findById(publisher);

    if (!existingPublisher) {
      return res.status(404).send("Publisher not found.");
    }

    const existingConsoles = await ConsoleModel.find({ _id: { $in: consoles } });

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

module.exports = router;
