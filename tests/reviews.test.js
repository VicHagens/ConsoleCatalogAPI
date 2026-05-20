const mongoose = require("mongoose");
const Review = require("../src/models/review");

describe("Review model", () => {
  test("validates a complete review", () => {
    const review = new Review({
      user: new mongoose.Types.ObjectId(),
      game: new mongoose.Types.ObjectId(),
      rating: 9,
      comment: "Still plays great today.",
    });

    const error = review.validateSync();

    expect(error).toBeUndefined();
  });

  test("requires a user reference", () => {
    const review = new Review({
      game: new mongoose.Types.ObjectId(),
      rating: 9,
      comment: "Still plays great today.",
    });

    const error = review.validateSync();

    expect(error.errors.user).toBeDefined();
  });

  test("rejects ratings below one", () => {
    const review = new Review({
      user: new mongoose.Types.ObjectId(),
      game: new mongoose.Types.ObjectId(),
      rating: 0,
      comment: "Too low.",
    });

    const error = review.validateSync();

    expect(error.errors.rating).toBeDefined();
  });

  test("rejects comments shorter than two characters", () => {
    const review = new Review({
      user: new mongoose.Types.ObjectId(),
      game: new mongoose.Types.ObjectId(),
      rating: 8,
      comment: "A",
    });

    const error = review.validateSync();

    expect(error.errors.comment).toBeDefined();
  });
});
