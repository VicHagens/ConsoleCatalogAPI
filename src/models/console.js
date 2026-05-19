const mongoose = require("mongoose");

const consoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  generation: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Console", consoleSchema);
