const express = require("express");
const mongoose = require("mongoose");
const Franchise = require("../models/franchise");

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

module.exports = router;