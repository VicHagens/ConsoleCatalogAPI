const mongoose = require("mongoose");

async function connectDatabase() {
  if (!process.env.MONGODB_URL) {
    console.log("MONGODB_URL is not set in environment variables.");
    return;
  }

  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");
}

module.exports = connectDatabase;