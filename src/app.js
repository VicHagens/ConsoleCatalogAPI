const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
// Import route handlers
const brands = require("./routes/brands");
const consoles = require("./routes/consoles");
const franchises = require("./routes/franchises");
const games = require("./routes/games");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const auth = require("./routes/auth");
// Import middleware
const errorHandler = require("./middleware/error");

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));

app.use(express.json());

// greeting home route
app.get("/", (req, res) => {
  res.send("Welcome to the ConsoleCatalog API of VicH!");
});

// API routes
app.use("/api/brands", brands);
app.use("/api/consoles", consoles);
app.use("/api/franchises", franchises);
app.use("/api/games", games);
app.use("/api/reviews", reviews);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

module.exports = app;
