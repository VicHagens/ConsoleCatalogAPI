const User = require("../src/models/user");
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

let mongoServer;
let userCounter = 0;

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
  userCounter += 1;

  return User.create({
    name: `${role} user`,
    email: `${role}-${userCounter}@example.com`,
    password: "password123",
    role,
  });
}

function getToken(user) {
  return jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET);
}

describe("User model", () => {
  test("validates a complete user", () => {
    const user = new User({
      name: "Vic",
      email: "vic@example.com",
      password: "password123",
      role: "user",
    });

    const error = user.validateSync();

    expect(error).toBeUndefined();
  });

  test("defaults role to user", () => {
    const user = new User({
      name: "Vic",
      email: "vic@example.com",
      password: "password123",
    });

    expect(user.role).toBe("user");
  });

  test("requires an email", () => {
    const user = new User({
      name: "Vic",
      password: "password123",
    });

    const error = user.validateSync();

    expect(error.errors.email).toBeDefined();
  });

  test("rejects unknown roles", () => {
    const user = new User({
      name: "Vic",
      email: "vic@example.com",
      password: "password123",
      role: "superadmin",
    });

    const error = user.validateSync();

    expect(error.errors.role).toBeDefined();
  });
});

describe("User routes", () => {
  test("gets the current user and lets the owner update their profile", async () => {
    const user = await createUser("user");
    const token = getToken(user);

    const meResponse = await request(app)
      .get("/api/users/me")
      .set("x-auth-token", token);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.email).toBe(user.email);
    expect(meResponse.body.password).toBeUndefined();

    const updateResponse = await request(app)
      .put(`/api/users/${user._id}`)
      .set("x-auth-token", token)
      .send({
        name: "Updated User",
        email: "updated@example.com",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe("Updated User");
  });

  test("lets admins list, update, and delete users", async () => {
    const admin = await createUser("admin");
    const user = await createUser("user");
    const adminToken = getToken(admin);

    const listResponse = await request(app)
      .get("/api/users")
      .set("x-auth-token", adminToken);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(2);

    const updateResponse = await request(app)
      .put(`/api/users/${user._id}`)
      .set("x-auth-token", adminToken)
      .send({
        name: "Promoted User",
        email: "promoted@example.com",
        role: "admin",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.role).toBe("admin");

    const deleteResponse = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("x-auth-token", adminToken);

    expect(deleteResponse.status).toBe(200);
    expect(await User.findById(user._id)).toBeNull();
  });
});
