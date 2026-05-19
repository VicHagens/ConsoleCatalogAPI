const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Franchise",
  },
  consoles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Console",
      required: true,
    },
  ],
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Game", gameSchema);
