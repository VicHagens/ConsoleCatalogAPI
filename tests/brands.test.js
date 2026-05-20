const Brand = require("../src/models/brand");
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

describe("Brand model", () => {
  test("validates a complete brand", () => {
    const brand = new Brand({
      name: "Nintendo",
      country: "Japan",
      foundedYear: 1889,
      description: "Japanese company known for iconic consoles.",
    });

    const error = brand.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a name", () => {
    const brand = new Brand({
      country: "Japan",
    });

    const error = brand.validateSync();

    expect(error.errors.name).toBeDefined();
  });

  test("requires a country", () => {
    const brand = new Brand({
      name: "Nintendo",
    });

    const error = brand.validateSync();

    expect(error.errors.country).toBeDefined();
  });
});

describe("Brand routes", () => {
  test("creates, reads, updates, and deletes a brand as admin", async () => {
    const admin = await createUser("admin");
    const token = getToken(admin);

    const createResponse = await request(app)
      .post("/api/brands")
      .set("x-auth-token", token)
      .send({
        name: "Nintendo",
        country: "Japan",
        foundedYear: 1889,
      });

    expect(createResponse.status).toBe(201);

    const brandId = createResponse.body._id;
    const listResponse = await request(app).get("/api/brands");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const updateResponse = await request(app)
      .put(`/api/brands/${brandId}`)
      .set("x-auth-token", token)
      .send({
        name: "Nintendo",
        country: "Japan",
        foundedYear: 1889,
        description: "Updated description.",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.description).toBe("Updated description.");

    const deleteResponse = await request(app)
      .delete(`/api/brands/${brandId}`)
      .set("x-auth-token", token);

    expect(deleteResponse.status).toBe(200);
    expect(await Brand.countDocuments()).toBe(0);
  });

  test("blocks catalog writes for regular users", async () => {
    const user = await createUser("user");

    const response = await request(app)
      .post("/api/brands")
      .set("x-auth-token", getToken(user))
      .send({
        name: "Nintendo",
        country: "Japan",
      });

    expect(response.status).toBe(403);
  });
});
