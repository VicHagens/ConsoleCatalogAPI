const User = require("../src/models/user");

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
