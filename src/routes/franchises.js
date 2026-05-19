const express = require("express");
const mongoose = require("mongoose");
const Franchise = require("../models/franchise");
const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/franchises - Get all franchises
router.get("/", async (req, res, next) => {
  try {
    const franchises = await Franchise.find().sort("name");
    res.send(franchises);
  } catch (error) {
    next(error);
  }
});

// GET /api/franchises/:id - Get franchise by id
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid franchise id.");
    }

    const franchise = await Franchise.findById(req.params.id);

    if (!franchise) {
      return res.status(404).send("Franchise not found.");
    }

    res.send(franchise);
  } catch (error) {
    next(error);
  }
});

// POST /api/franchises - Create a new franchise
router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { name, createdBy, firstReleaseYear, description } = req.body;

    if (!name) {
      return res.status(400).send("Name is required.");
    }

    const franchise = new Franchise({
      name,
      createdBy,
      firstReleaseYear,
      description,
    });

    await franchise.save();
    res.status(201).send(franchise);
  } catch (error) {
    next(error);
  }
});

// PUT /api/franchises/:id - Update a franchise
router.put("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid franchise id.");
    }

    const { name, createdBy, firstReleaseYear, description } = req.body;

    if (!name) {
      return res.status(400).send("Name is required.");
    }

    const franchise = await Franchise.findByIdAndUpdate(
      req.params.id,
      {
        name,
        createdBy,
        firstReleaseYear,
        description,
      },
      { new: true, runValidators: true },
    );

    if (!franchise) {
      return res.status(404).send("Franchise not found.");
    }

    res.send(franchise);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/franchises/:id - Delete a franchise
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid franchise id.");
    }

    const franchise = await Franchise.findByIdAndDelete(req.params.id);

    if (!franchise) {
      return res.status(404).send("Franchise not found.");
    }

    res.send(franchise);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
