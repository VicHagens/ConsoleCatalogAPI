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
  specs: {
    cpu: {
      type: String,
      trim: true,
    },
    memory: {
      type: String,
      trim: true,
    },
    media: {
      type: String,
      trim: true,
    },
    maxResolution: {
      type: String,
      trim: true,
    },
  },
});

module.exports = mongoose.model("Console", consoleSchema);
