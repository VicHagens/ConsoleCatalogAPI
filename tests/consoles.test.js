const mongoose = require("mongoose");
const Console = require("../src/models/console");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const Brand = require("../src/models/brand");
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

describe("Console model", () => {
  test("validates a console with embedded specs", () => {
    const consoleItem = new Console({
      name: "GameCube",
      brand: new mongoose.Types.ObjectId(),
      generation: 6,
      releaseYear: 2001,
      description: "Compact Nintendo console.",
      specs: {
        cpu: "IBM PowerPC Gekko",
        memory: "24 MB RAM",
        media: "MiniDVD",
        maxResolution: "480p",
      },
    });

    const error = consoleItem.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a brand reference", () => {
    const consoleItem = new Console({
      name: "GameCube",
      releaseYear: 2001,
    });

    const error = consoleItem.validateSync();

    expect(error.errors.brand).toBeDefined();
  });

  test("requires a release year", () => {
    const consoleItem = new Console({
      name: "GameCube",
      brand: new mongoose.Types.ObjectId(),
    });

    const error = consoleItem.validateSync();

    expect(error.errors.releaseYear).toBeDefined();
  });
});

describe("Console routes", () => {
  test("creates, reads, updates, and deletes a console as admin", async () => {
    const admin = await createUser("admin");
    const brand = await Brand.create({
      name: "Nintendo",
      country: "Japan",
    });

    const createResponse = await request(app)
      .post("/api/consoles")
      .set("x-auth-token", getToken(admin))
      .send({
        name: "GameCube",
        brand: brand._id.toString(),
        generation: 6,
        releaseYear: 2001,
        specs: {
          cpu: "IBM PowerPC Gekko",
        },
      });

    expect(createResponse.status).toBe(201);

    const consoleId = createResponse.body._id;
    const getResponse = await request(app).get(`/api/consoles/${consoleId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.brand.name).toBe("Nintendo");

    const updateResponse = await request(app)
      .put(`/api/consoles/${consoleId}`)
      .set("x-auth-token", getToken(admin))
      .send({
        name: "Nintendo GameCube",
        brand: brand._id.toString(),
        generation: 6,
        releaseYear: 2001,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe("Nintendo GameCube");

    const deleteResponse = await request(app)
      .delete(`/api/consoles/${consoleId}`)
      .set("x-auth-token", getToken(admin));

    expect(deleteResponse.status).toBe(200);
    expect(await Console.countDocuments()).toBe(0);
  });
});
