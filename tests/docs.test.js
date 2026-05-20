const YAML = require("yamljs");

describe("API documentation", () => {
  test("openapi.yaml is valid OpenAPI 3 documentation", () => {
    const docs = YAML.load("docs/openapi.yaml");

    expect(docs.openapi).toBe("3.0.3");
    expect(docs.info.title).toBe("ConsoleCatalog API");
    expect(docs.paths).toBeDefined();
  });

  test("documents the main API route groups", () => {
    const docs = YAML.load("docs/openapi.yaml");

    expect(docs.paths["/api/auth/register"]).toBeDefined();
    expect(docs.paths["/api/brands"]).toBeDefined();
    expect(docs.paths["/api/consoles"]).toBeDefined();
    expect(docs.paths["/api/franchises"]).toBeDefined();
    expect(docs.paths["/api/games"]).toBeDefined();
    expect(docs.paths["/api/reviews"]).toBeDefined();
    expect(docs.paths["/api/users"]).toBeDefined();
    expect(docs.paths["/api/games/{gameId}/reviews"]).toBeDefined();
  });

  test("documents x-auth-token authentication", () => {
    const docs = YAML.load("docs/openapi.yaml");
    const authScheme = docs.components.securitySchemes.ApiTokenAuth;

    expect(authScheme.type).toBe("apiKey");
    expect(authScheme.in).toBe("header");
    expect(authScheme.name).toBe("x-auth-token");
  });
});
