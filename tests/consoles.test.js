const mongoose = require("mongoose");
const Console = require("../src/models/console");

describe("Console model", () => {
  test("validates a console with embedded specs", () => {
    const consoleItem = new Console({
      name: "GameCube",
      brand: new mongoose.Types.ObjectId(),
      generation: 6,
      releaseYear: 2001,
      description: "Compact Nintendo console.",
      specs: {
        cpu: "IBM PowerPC Gekko",
        memory: "24 MB RAM",
        media: "MiniDVD",
        maxResolution: "480p",
      },
    });

    const error = consoleItem.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a brand reference", () => {
    const consoleItem = new Console({
      name: "GameCube",
      releaseYear: 2001,
    });

    const error = consoleItem.validateSync();

    expect(error.errors.brand).toBeDefined();
  });

  test("requires a release year", () => {
    const consoleItem = new Console({
      name: "GameCube",
      brand: new mongoose.Types.ObjectId(),
    });

    const error = consoleItem.validateSync();

    expect(error.errors.releaseYear).toBeDefined();
  });
});
