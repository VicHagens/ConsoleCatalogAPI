const request = require("supertest");
const app = require("../src/app");

describe("App routes", () => {
  test("GET / returns the welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Welcome to the ConsoleCatalog API of VicH!");
  });

  test("GET /api/users/me returns 401 without token", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.status).toBe(401);
    expect(response.text).toBe("Access denied. No token provided.");
  });

  test("GET /api-docs redirects to the Swagger UI page", async () => {
    const response = await request(app).get("/api-docs");

    expect(response.status).toBe(301);
    expect(response.headers.location).toBe("/api-docs/");
  });
});
