const express = require("express");
const mongoose = require("mongoose");
const Brand = require("../models/brand");
const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");
const validateBrand = require("../validation/brandValidation");

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
router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { error } = validateBrand(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { name, country, foundedYear, description } = req.body;

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

// PUT /api/brands/:id - Update a brand
router.put("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid brand id.");
    }

    const { error } = validateBrand(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { name, country, foundedYear, description } = req.body;

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name,
        country,
        foundedYear,
        description,
      },
      { new: true, runValidators: true },
    );

    if (!brand) {
      return res.status(404).send("Brand not found.");
    }

    res.send(brand);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/brands/:id - Delete a brand
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid brand id.");
    }

    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).send("Brand not found.");
    }

    res.send(brand);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
