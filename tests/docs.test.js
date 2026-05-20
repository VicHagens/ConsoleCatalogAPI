const request = require("supertest");
const app = require("../src/app");

describe("API documentation", () => {
  test("serves Swagger UI at /api-docs", async () => {
    const response = await request(app).get("/api-docs/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });
});
