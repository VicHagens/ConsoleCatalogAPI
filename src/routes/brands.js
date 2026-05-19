const express = require("express");
const mongoose = require("mongoose");
const Brand = require("../models/brand");

const router = express.Router();

// GET /api/brands - Get all brands
router.get("/", async (req, res, next) => {
  try {
    const brands = await Brand.find().sort("name");
    res.send(brands);
  } catch (error) {
    next(error);
  }
});

// GET /api/brands/:id - Get brand by id
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid brand id.");
    }

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).send("Brand not found.");
    }

    res.send(brand);
  } catch (error) {
    next(error);
  }
});

module.exports = router;