const express = require('express');
const app = express();
const port = 3000;
const connectDatabase = require("./config/db");
// Import route handlers
const brands = require("./routes/brands");
const consoles = require("./routes/consoles");
const franchises = require("./routes/franchises");
const games = require("./routes/games");
const reviews = require("./routes/reviews");


connectDatabase();

app.use(express.json());

// greeting home route
app.get('/', (req, res) => {
    res.send('Welcome to the ConsoleCatalog API by Vic Hagens!');
});

// API routes
app.use("/api/brands", brands);
app.use("/api/consoles", consoles);
app.use("/api/franchises", franchises);
app.use("/api/games", games);
app.use("/api/reviews", reviews);

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

module.exports = app;
