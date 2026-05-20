const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/user");

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret";
  process.env.JWT_EXPIRES_IN = "1h";

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth routes", () => {
  describe("POST /api/auth/register", () => {
    test("registers a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: "Vic",
        email: "vic@example.com",
        role: "user",
      });
      expect(response.body.password).toBeUndefined();
      expect(await User.countDocuments()).toBe(1);
    });

    test("returns 400 when email already exists", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/register").send({
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("A user with this email already exists.");
    });

    test("returns 400 for invalid input", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "V",
        email: "not-an-email",
        password: "short",
      });

      expect(response.status).toBe(400);
      expect(await User.countDocuments()).toBe(0);
    });
  });

  describe("POST /api/auth/login", () => {
    test("returns a token for valid credentials", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    test("returns 400 when the user does not exist", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "missing@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid email or password.");
    });

    test("returns 400 when the password is wrong", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "vic@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid email or password.");
    });

    test("returns 500 when JWT_SECRET is missing", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      });
      delete process.env.JWT_SECRET;

      const response = await request(app).post("/api/auth/login").send({
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe("JWT secret is not configured.");
      process.env.JWT_SECRET = "test_jwt_secret";
    });
  });
});
