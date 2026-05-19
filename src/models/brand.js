const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  foundedYear: {
    type: Number,
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Brand", brandSchema);
