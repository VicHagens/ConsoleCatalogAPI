const Brand = require("../src/models/brand");

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
