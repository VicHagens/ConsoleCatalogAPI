require("dotenv").config();

const mongoose = require("mongoose");
const Brand = require("./models/brand");
const Console = require("./models/console");
const Franchise = require("./models/franchise");
const Game = require("./models/game");

async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    console.log("MONGODB_URI is not set in environment variables.");
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Game.deleteMany();
  await Console.deleteMany();
  await Franchise.deleteMany();
  await Brand.deleteMany();

  const brands = await Brand.insertMany([
    {
      name: "Nintendo",
      country: "Japan",
      foundedYear: 1889,
      description: "Japanese company known for iconic consoles and franchises.",
    },
    {
      name: "Microsoft",
      country: "United States",
      foundedYear: 1975,
      description: "American technology company behind the Xbox brand.",
    },
    {
      name: "Sega",
      country: "Japan",
      foundedYear: 1960,
      description: "Japanese company known for arcade games and classic consoles.",
    },
    {
      name: "Atari",
      country: "United States",
      foundedYear: 1972,
      description: "Early video game company famous for arcade and home consoles.",
    },
  ]);

  const nintendo = brands.find((brand) => brand.name === "Nintendo");
  const microsoft = brands.find((brand) => brand.name === "Microsoft");
  const sega = brands.find((brand) => brand.name === "Sega");
  const atari = brands.find((brand) => brand.name === "Atari");

  const consoles = await Console.insertMany([
    {
      name: "Nintendo Entertainment System",
      brand: nintendo._id,
      generation: 3,
      releaseYear: 1983,
      description: "8-bit home console that helped revive the video game industry.",
    },
    {
      name: "GameCube",
      brand: nintendo._id,
      generation: 6,
      releaseYear: 2001,
      description: "Compact Nintendo console known for its cube shape and handle.",
    },
    {
      name: "Xbox 360",
      brand: microsoft._id,
      generation: 7,
      releaseYear: 2005,
      description: "Microsoft console known for Xbox Live and many popular multiplayer games.",
    },
    {
      name: "Sega Mega Drive",
      brand: sega._id,
      generation: 4,
      releaseYear: 1988,
      description: "16-bit Sega console also known as the Sega Genesis in North America.",
    },
    {
      name: "Atari 2600",
      brand: atari._id,
      generation: 2,
      releaseYear: 1977,
      description: "Classic cartridge-based home console from Atari.",
    },
  ]);

  const nes = consoles.find((consoleItem) => consoleItem.name === "Nintendo Entertainment System");
  const gameCube = consoles.find((consoleItem) => consoleItem.name === "GameCube");
  const xbox360 = consoles.find((consoleItem) => consoleItem.name === "Xbox 360");
  const megaDrive = consoles.find((consoleItem) => consoleItem.name === "Sega Mega Drive");
  const atari2600 = consoles.find((consoleItem) => consoleItem.name === "Atari 2600");

  const franchises = await Franchise.insertMany([
    {
      name: "Mario",
      createdBy: "Nintendo",
      firstReleaseYear: 1981,
      description: "Platforming franchise featuring Mario and many Nintendo characters.",
    },
    {
      name: "The Legend of Zelda",
      createdBy: "Nintendo",
      firstReleaseYear: 1986,
      description: "Adventure franchise focused on exploration, puzzles, and fantasy worlds.",
    },
    {
      name: "Halo",
      createdBy: "Bungie",
      firstReleaseYear: 2001,
      description: "Science fiction shooter franchise closely linked with Xbox.",
    },
    {
      name: "Sonic the Hedgehog",
      createdBy: "Sega",
      firstReleaseYear: 1991,
      description: "Fast platforming franchise created as Sega's mascot series.",
    },
  ]);

  const mario = franchises.find((franchise) => franchise.name === "Mario");
  const zelda = franchises.find((franchise) => franchise.name === "The Legend of Zelda");
  const halo = franchises.find((franchise) => franchise.name === "Halo");
  const sonic = franchises.find((franchise) => franchise.name === "Sonic the Hedgehog");

  await Game.insertMany([
    {
      title: "Super Mario Bros.",
      franchise: mario._id,
      consoles: [nes._id],
      publisher: nintendo._id,
      releaseYear: 1985,
      genre: "Platformer",
      description: "Classic side-scrolling platform game for the NES.",
    },
    {
      title: "The Legend of Zelda: The Wind Waker",
      franchise: zelda._id,
      consoles: [gameCube._id],
      publisher: nintendo._id,
      releaseYear: 2002,
      genre: "Action-adventure",
      description: "GameCube Zelda game known for its cel-shaded art style.",
    },
    {
      title: "Halo 3",
      franchise: halo._id,
      consoles: [xbox360._id],
      publisher: microsoft._id,
      releaseYear: 2007,
      genre: "First-person shooter",
      description: "Major Xbox 360 shooter and multiplayer classic.",
    },
    {
      title: "Sonic the Hedgehog",
      franchise: sonic._id,
      consoles: [megaDrive._id],
      publisher: sega._id,
      releaseYear: 1991,
      genre: "Platformer",
      description: "Fast-paced platform game that introduced Sonic.",
    },
    {
      title: "Pac-Man",
      consoles: [atari2600._id],
      publisher: atari._id,
      releaseYear: 1982,
      genre: "Maze",
      description: "Home console version of the famous arcade maze game.",
    },
  ]);

  console.log("Seed data inserted successfully");
}

seedDatabase()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  });
