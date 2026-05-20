const express = require("express");
const request = require("supertest");

jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../src/models/user", () => {
  function User(data) {
    Object.assign(this, data);
    this._id = "new-user-id";
    this.role = this.role || "user";
    this.save = jest.fn().mockResolvedValue(this);
  }

  User.findOne = jest.fn();

  return User;
});

const bcrypt = require("bcrypt");
const User = require("../src/models/user");
const authRouter = require("../src/routes/auth");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRouter);
  return app;
}

describe("Auth routes", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  describe("POST /api/auth/register", () => {
    test("registers a new user", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed-password");

      const response = await request(app).post("/api/auth/register").send({
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        _id: "new-user-id",
        name: "Vic",
        email: "vic@example.com",
        role: "user",
      });
      expect(response.body.password).toBeUndefined();
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
    });

    test("returns 400 when email already exists", async () => {
      User.findOne.mockResolvedValue({
        email: "vic@example.com",
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
      expect(User.findOne).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/login", () => {
    test("returns a token for valid credentials", async () => {
      User.findOne.mockResolvedValue({
        _id: "user-id",
        email: "vic@example.com",
        password: "hashed-password",
        role: "admin",
      });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app).post("/api/auth/login").send({
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    test("returns 400 when the user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/api/auth/login").send({
        email: "missing@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid email or password.");
    });

    test("returns 400 when the password is wrong", async () => {
      User.findOne.mockResolvedValue({
        _id: "user-id",
        email: "vic@example.com",
        password: "hashed-password",
        role: "user",
      });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app).post("/api/auth/login").send({
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid email or password.");
    });

    test("returns 500 when JWT_SECRET is missing", async () => {
      delete process.env.JWT_SECRET;
      User.findOne.mockResolvedValue({
        _id: "user-id",
        email: "vic@example.com",
        password: "hashed-password",
        role: "user",
      });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app).post("/api/auth/login").send({
        email: "vic@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe("JWT secret is not configured.");
    });
  });
});
