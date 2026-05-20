const mongoose = require("mongoose");
const Game = require("../src/models/game");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const Brand = require("../src/models/brand");
const Console = require("../src/models/console");
const Franchise = require("../src/models/franchise");
const User = require("../src/models/user");

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

async function createUser(role = "user") {
  return User.create({
    name: `${role} user`,
    email: `${role}-${Date.now()}@example.com`,
    password: "password123",
    role,
  });
}

function getToken(user) {
  return jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET);
}

async function createCatalogData() {
  const brand = await Brand.create({
    name: "Nintendo",
    country: "Japan",
  });
  const consoleItem = await Console.create({
    name: "GameCube",
    brand: brand._id,
    releaseYear: 2001,
  });
  const franchise = await Franchise.create({
    name: "Mario",
    createdBy: "Nintendo",
    firstReleaseYear: 1981,
  });

  return {
    brand,
    consoleItem,
    franchise,
  };
}

describe("Game model", () => {
  test("validates a game with references and embedded release info", () => {
    const game = new Game({
      title: "The Legend of Zelda",
      franchise: new mongoose.Types.ObjectId(),
      consoles: [new mongoose.Types.ObjectId()],
      publisher: new mongoose.Types.ObjectId(),
      releaseYear: 1986,
      genre: "Action-adventure",
      description: "Explore Hyrule and rescue Princess Zelda.",
      releaseInfo: {
        region: "Japan",
        originalReleaseDate: "1986-02-21",
        ageRating: "E",
      },
    });

    const error = game.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a title", () => {
    const game = new Game({
      consoles: [new mongoose.Types.ObjectId()],
      publisher: new mongoose.Types.ObjectId(),
      releaseYear: 1986,
    });

    const error = game.validateSync();

    expect(error.errors.title).toBeDefined();
  });

  test("requires a publisher reference", () => {
    const game = new Game({
      title: "The Legend of Zelda",
      consoles: [new mongoose.Types.ObjectId()],
      releaseYear: 1986,
    });

    const error = game.validateSync();

    expect(error.errors.publisher).toBeDefined();
  });

  test("requires a release year", () => {
    const game = new Game({
      title: "The Legend of Zelda",
      consoles: [new mongoose.Types.ObjectId()],
      publisher: new mongoose.Types.ObjectId(),
    });

    const error = game.validateSync();

    expect(error.errors.releaseYear).toBeDefined();
  });
});

describe("Game routes", () => {
  test("creates, reads, updates, and deletes a game as admin", async () => {
    const admin = await createUser("admin");
    const { brand, consoleItem, franchise } = await createCatalogData();
    const token = getToken(admin);

    const createResponse = await request(app)
      .post("/api/games")
      .set("x-auth-token", token)
      .send({
        title: "Super Mario Sunshine",
        franchise: franchise._id.toString(),
        consoles: [consoleItem._id.toString()],
        publisher: brand._id.toString(),
        releaseYear: 2002,
        genre: "Platformer",
      });

    expect(createResponse.status).toBe(201);

    const gameId = createResponse.body._id;
    const getResponse = await request(app).get(`/api/games/${gameId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.publisher.name).toBe("Nintendo");

    const updateResponse = await request(app)
      .put(`/api/games/${gameId}`)
      .set("x-auth-token", token)
      .send({
        title: "Super Mario Sunshine",
        franchise: franchise._id.toString(),
        consoles: [consoleItem._id.toString()],
        publisher: brand._id.toString(),
        releaseYear: 2002,
        genre: "Platformer",
        description: "Mario visits Isle Delfino.",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.description).toBe("Mario visits Isle Delfino.");

    const deleteResponse = await request(app)
      .delete(`/api/games/${gameId}`)
      .set("x-auth-token", token);

    expect(deleteResponse.status).toBe(200);
    expect(await Game.findById(gameId)).toBeNull();
  });
});
