const express = require("express");
const mongoose = require("mongoose");
const ConsoleModel = require("../models/console");
const Brand = require("../models/brand");

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

// POST /api/consoles - Create a new console
router.post("/", async (req, res, next) => {
  try {
    const { name, brand, generation, releaseYear, description } = req.body;

    if (!name || !brand || !releaseYear) {
      return res.status(400).send("Name, brand and release year are required.");
    }

    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).send("Invalid brand id.");
    }

    const existingBrand = await Brand.findById(brand);

    if (!existingBrand) {
      return res.status(404).send("Brand not found.");
    }

    const consoleItem = new ConsoleModel({
      name,
      brand,
      generation,
      releaseYear,
      description,
    });

    await consoleItem.save();
    res.status(201).send(consoleItem);
  } catch (error) {
    next(error);
  }
});

// PUT /api/consoles/:id - Update a console
router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid console id.");
    }

    const { name, brand, generation, releaseYear, description } = req.body;

    if (!name || !brand || !releaseYear) {
      return res.status(400).send("Name, brand and release year are required.");
    }

    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).send("Invalid brand id.");
    }

    const existingBrand = await Brand.findById(brand);

    if (!existingBrand) {
      return res.status(404).send("Brand not found.");
    }

    const consoleItem = await ConsoleModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        brand,
        generation,
        releaseYear,
        description,
      },
      { new: true, runValidators: true },
    ).populate("brand", "name country");

    if (!consoleItem) {
      return res.status(404).send("Console not found.");
    }

    res.send(consoleItem);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/consoles/:id - Delete a console
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid console id.");
    }

    const consoleItem = await ConsoleModel.findByIdAndDelete(req.params.id);

    if (!consoleItem) {
      return res.status(404).send("Console not found.");
    }

    res.send(consoleItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
