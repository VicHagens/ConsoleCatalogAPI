const express = require("express");
// Import route handlers
const brands = require("./routes/brands");
const consoles = require("./routes/consoles");
const franchises = require("./routes/franchises");
const games = require("./routes/games");
const reviews = require("./routes/reviews");

const app = express();

app.use(express.json());

// greeting home route
app.get("/", (req, res) => {
  res.send("Welcome to the ConsoleCatalog API by Vic Hagens!");
});

// API routes
app.use("/api/brands", brands);
app.use("/api/consoles", consoles);
app.use("/api/franchises", franchises);
app.use("/api/games", games);
app.use("/api/reviews", reviews);

module.exports = app;
