const mongoose = require("mongoose");
const Game = require("../src/models/game");

describe("Game model", () => {
  test("validates a game with references and embedded release info", () => {
    const game = new Game({
      title: "The Legend of Zelda",
      franchise: new mongoose.Types.ObjectId(),
      consoles: [new mongoose.Types.ObjectId()],
      publisher: new mongoose.Types.ObjectId(),
      releaseYear: 1986,
      genre: "Action-adventure",
      description: "Explore Hyrule and rescue Princess Zelda.",
      releaseInfo: {
        region: "Japan",
        originalReleaseDate: "1986-02-21",
        ageRating: "E",
      },
    });

    const error = game.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a title", () => {
    const game = new Game({
      consoles: [new mongoose.Types.ObjectId()],
      publisher: new mongoose.Types.ObjectId(),
      releaseYear: 1986,
    });

    const error = game.validateSync();

    expect(error.errors.title).toBeDefined();
  });

  test("requires a publisher reference", () => {
    const game = new Game({
      title: "The Legend of Zelda",
      consoles: [new mongoose.Types.ObjectId()],
      releaseYear: 1986,
    });

    const error = game.validateSync();

    expect(error.errors.publisher).toBeDefined();
  });

  test("requires a release year", () => {
    const game = new Game({
      title: "The Legend of Zelda",
      consoles: [new mongoose.Types.ObjectId()],
      publisher: new mongoose.Types.ObjectId(),
    });

    const error = game.validateSync();

    expect(error.errors.releaseYear).toBeDefined();
  });
});
