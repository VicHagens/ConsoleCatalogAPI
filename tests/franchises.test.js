const Franchise = require("../src/models/franchise");
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
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

describe("Franchise model", () => {
  test("validates a complete franchise", () => {
    const franchise = new Franchise({
      name: "The Legend of Zelda",
      createdBy: "Nintendo",
      firstReleaseYear: 1986,
      description: "Adventure franchise focused on exploration and puzzles.",
    });

    const error = franchise.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a name", () => {
    const franchise = new Franchise({
      createdBy: "Nintendo",
    });

    const error = franchise.validateSync();

    expect(error.errors.name).toBeDefined();
  });

  test("trims string fields", () => {
    const franchise = new Franchise({
      name: "  Halo  ",
      createdBy: "  Bungie  ",
    });

    expect(franchise.name).toBe("Halo");
    expect(franchise.createdBy).toBe("Bungie");
  });
});

describe("Franchise routes", () => {
  test("creates, reads, updates, and deletes a franchise as admin", async () => {
    const admin = await createUser("admin");
    const token = getToken(admin);

    const createResponse = await request(app)
      .post("/api/franchises")
      .set("x-auth-token", token)
      .send({
        name: "Halo",
        createdBy: "Bungie",
        firstReleaseYear: 2001,
      });

    expect(createResponse.status).toBe(201);

    const franchiseId = createResponse.body._id;
    const getResponse = await request(app).get(`/api/franchises/${franchiseId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe("Halo");

    const updateResponse = await request(app)
      .put(`/api/franchises/${franchiseId}`)
      .set("x-auth-token", token)
      .send({
        name: "Halo",
        createdBy: "Bungie",
        firstReleaseYear: 2001,
        description: "Science fiction shooter franchise.",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.description).toBe("Science fiction shooter franchise.");

    const deleteResponse = await request(app)
      .delete(`/api/franchises/${franchiseId}`)
      .set("x-auth-token", token);

    expect(deleteResponse.status).toBe(200);
    expect(await Franchise.countDocuments()).toBe(0);
  });
});
