const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");
const { validateUpdateUser } = require("../validation/userValidation");

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("name");

    res.send(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me - Get the logged-in user
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Get a user by id (admin only)
router.get("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user id.");
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id - Update a user
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user id.");
    }

    const isOwnProfile = req.user._id === req.params.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwnProfile && !isAdmin) {
      return res.status(403).send("Access denied.");
    }

    const { error } = validateUpdateUser(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { name, email, role } = req.body;

    if (role && !isAdmin) {
      return res.status(403).send("Users cannot update their own role.");
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.params.id },
    });

    if (existingUser) {
      return res.status(400).send("A user with this email already exists.");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        ...(isAdmin && role ? { role } : {}),
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Delete a user (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user id.");
    }

    const user = await User.findByIdAndDelete(req.params.id).select("-password");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
