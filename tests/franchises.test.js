const Franchise = require("../src/models/franchise");

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
