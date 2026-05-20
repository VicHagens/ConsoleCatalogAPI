const mongoose = require("mongoose");
const Review = require("../src/models/review");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const Brand = require("../src/models/brand");
const Console = require("../src/models/console");
const Franchise = require("../src/models/franchise");
const Game = require("../src/models/game");
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

async function createGame() {
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
    name: "The Legend of Zelda",
    createdBy: "Nintendo",
    firstReleaseYear: 1986,
  });

  return Game.create({
    title: "The Legend of Zelda: The Wind Waker",
    franchise: franchise._id,
    consoles: [consoleItem._id],
    publisher: brand._id,
    releaseYear: 2002,
    genre: "Action-adventure",
  });
}

describe("Review model", () => {
  test("validates a complete review", () => {
    const review = new Review({
      user: new mongoose.Types.ObjectId(),
      game: new mongoose.Types.ObjectId(),
      rating: 9,
      comment: "Still plays great today.",
    });

    const error = review.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a user reference", () => {
    const review = new Review({
      game: new mongoose.Types.ObjectId(),
      rating: 9,
      comment: "Still plays great today.",
    });

    const error = review.validateSync();

    expect(error.errors.user).toBeDefined();
  });

  test("rejects ratings below one", () => {
    const review = new Review({
      user: new mongoose.Types.ObjectId(),
      game: new mongoose.Types.ObjectId(),
      rating: 0,
      comment: "Too low.",
    });

    const error = review.validateSync();

    expect(error.errors.rating).toBeDefined();
  });

  test("rejects comments shorter than two characters", () => {
    const review = new Review({
      user: new mongoose.Types.ObjectId(),
      game: new mongoose.Types.ObjectId(),
      rating: 8,
      comment: "A",
    });

    const error = review.validateSync();

    expect(error.errors.comment).toBeDefined();
  });
});

describe("Review routes", () => {
  test("creates, reads, updates, and deletes a review", async () => {
    const user = await createUser("user");
    const game = await createGame();
    const token = getToken(user);

    const createResponse = await request(app)
      .post(`/api/games/${game._id}/reviews`)
      .set("x-auth-token", token)
      .send({
        rating: 9,
        comment: "Still plays great today.",
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.user.name).toBe("user user");

    const reviewId = createResponse.body._id;
    const listResponse = await request(app).get(`/api/games/${game._id}/reviews`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const updateResponse = await request(app)
      .patch(`/api/reviews/${reviewId}`)
      .set("x-auth-token", token)
      .send({
        rating: 8,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.rating).toBe(8);

    const deleteResponse = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set("x-auth-token", token);

    expect(deleteResponse.status).toBe(200);
    expect(await Review.countDocuments()).toBe(0);
  });

  test("prevents a user from reviewing the same game twice", async () => {
    const user = await createUser("user");
    const game = await createGame();
    const token = getToken(user);

    await request(app)
      .post(`/api/games/${game._id}/reviews`)
      .set("x-auth-token", token)
      .send({
        rating: 9,
        comment: "First review.",
      });

    const response = await request(app)
      .post(`/api/games/${game._id}/reviews`)
      .set("x-auth-token", token)
      .send({
        rating: 8,
        comment: "Second review.",
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe("You already reviewed this game.");
  });
});
