const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validateRegister, validateLogin } = require("../validation/authValidation");

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post("/register", async (req, res, next) => {
  try {
    const { error } = validateRegister(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("A user with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Login a user
router.post("/login", async (req, res, next) => {
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { email, password } = req.body;

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
