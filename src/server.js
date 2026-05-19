require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/db");

const PORT = process.env.PORT || 3000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ConsoleCatalog API is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
