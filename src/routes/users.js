const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user");

const router = express.Router();

// POST /api/users - Register a new user
router.post("/", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Name, email and password are required.");
    }

    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long.");
    }

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

module.exports = router;
