const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// POST /api/auth - Login a user
router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).send("Invalid email or password.");
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).send("JWT secret is not configured.");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      },
    );

    res.send({
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
