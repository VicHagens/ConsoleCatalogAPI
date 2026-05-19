const express = require("express");
const mongoose = require("mongoose");
const ConsoleModel = require("../models/console");

const router = express.Router();

// GET /api/consoles - Get all consoles
router.get("/", async (req, res, next) => {
  try {
    const consoles = await ConsoleModel.find()
      .populate("brand", "name country")
      .sort("releaseYear");

    res.send(consoles);
  } catch (error) {
    next(error);
  }
});

// GET /api/consoles/:id - Get console by id
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid console id.");
    }

    const consoleItem = await ConsoleModel.findById(req.params.id).populate(
      "brand",
      "name country",
    );

    if (!consoleItem) {
      return res.status(404).send("Console not found.");
    }

    res.send(consoleItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;