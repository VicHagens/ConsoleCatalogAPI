const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: String,
    trim: true,
  },
  firstReleaseYear: {
    type: Number,
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Franchise", franchiseSchema);
