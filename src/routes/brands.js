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

// POST /api/brands - Create a new brand
router.post("/", async (req, res, next) => {
  try {
    const { name, country, foundedYear, description } = req.body; // om de brand const simpel te houden

    if (!name || !country) {
      return res.status(400).send("Name and country are required.");
    }

    const brand = new Brand({
      name,
      country,
      foundedYear,
      description,
    });

    await brand.save();
    res.status(201).send(brand);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
