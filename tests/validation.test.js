const validateBrand = require("../src/validation/brandValidation");
const validateConsole = require("../src/validation/consoleValidation");
const validateGame = require("../src/validation/gameValidation");
const validateFranchise = require("../src/validation/franchiseValidation");
const {
  validateRegister,
  validateLogin,
} = require("../src/validation/authValidation");
const {
  validateReview,
  validateReviewUpdate,
} = require("../src/validation/reviewValidation");
const { validateUpdateUser } = require("../src/validation/userValidation");

const objectId = "665f1e5a9a2f1a0012b34567";

describe("Validation", () => {
  describe("validateRegister", () => {
    test("accepts valid register data", () => {
      const user = {
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
      };

      const { error } = validateRegister(user);

      expect(error).toBeUndefined();
    });

    test("rejects users that try to set their own role", () => {
      const user = {
        name: "Vic",
        email: "vic@example.com",
        password: "password123",
        role: "admin",
      };

      const { error } = validateRegister(user);

      expect(error).toBeDefined();
    });
  });

  describe("validateLogin", () => {
    test("rejects invalid email addresses", () => {
      const login = {
        email: "not-an-email",
        password: "password123",
      };

      const { error } = validateLogin(login);

      expect(error).toBeDefined();
    });
  });

  describe("validateBrand", () => {
    test("accepts valid brand data", () => {
      const brand = {
        name: "Nintendo",
        country: "Japan",
        foundedYear: 1889,
        description: "Japanese company known for iconic consoles.",
      };

      const { error } = validateBrand(brand);

      expect(error).toBeUndefined();
    });

    test("rejects a brand without a country", () => {
      const brand = {
        name: "Nintendo",
      };

      const { error } = validateBrand(brand);

      expect(error).toBeDefined();
    });
  });

  describe("validateConsole", () => {
    test("accepts valid console data with embedded specs", () => {
      const consoleItem = {
        name: "GameCube",
        brand: objectId,
        generation: 6,
        releaseYear: 2001,
        specs: {
          cpu: "IBM PowerPC Gekko",
          memory: "24 MB RAM",
        },
      };

      const { error } = validateConsole(consoleItem);

      expect(error).toBeUndefined();
    });

    test("rejects an invalid brand ObjectId", () => {
      const consoleItem = {
        name: "GameCube",
        brand: "wrong-id",
        releaseYear: 2001,
      };

      const { error } = validateConsole(consoleItem);

      expect(error).toBeDefined();
    });
  });

  describe("validateFranchise", () => {
    test("accepts valid franchise data", () => {
      const franchise = {
        name: "The Legend of Zelda",
        createdBy: "Nintendo",
        firstReleaseYear: 1986,
      };

      const { error } = validateFranchise(franchise);

      expect(error).toBeUndefined();
    });
  });

  describe("validateGame", () => {
    test("accepts valid game data with references and release info", () => {
      const game = {
        title: "The Legend of Zelda",
        franchise: objectId,
        consoles: [objectId],
        publisher: objectId,
        releaseYear: 1986,
        genre: "Action-adventure",
        releaseInfo: {
          region: "Japan",
          originalReleaseDate: "1986-02-21",
          ageRating: "E",
        },
      };

      const { error } = validateGame(game);

      expect(error).toBeUndefined();
    });

    test("rejects a game without consoles", () => {
      const game = {
        title: "The Legend of Zelda",
        consoles: [],
        publisher: objectId,
        releaseYear: 1986,
      };

      const { error } = validateGame(game);

      expect(error).toBeDefined();
    });
  });

  describe("validateReview", () => {
    test("accepts a valid review", () => {
      const review = {
        rating: 9,
        comment: "Still plays great today.",
      };

      const { error } = validateReview(review);

      expect(error).toBeUndefined();
    });

    test("rejects a rating above ten", () => {
      const review = {
        rating: 11,
        comment: "Rating is too high.",
      };

      const { error } = validateReview(review);

      expect(error).toBeDefined();
    });
  });

  describe("validateReviewUpdate", () => {
    test("requires at least rating or comment", () => {
      const { error } = validateReviewUpdate({});

      expect(error).toBeDefined();
    });
  });

  describe("validateUpdateUser", () => {
    test("accepts valid user update data", () => {
      const user = {
        name: "Vic Hagens",
        email: "vic@example.com",
        role: "user",
      };

      const { error } = validateUpdateUser(user);

      expect(error).toBeUndefined();
    });

    test("rejects unknown roles", () => {
      const user = {
        name: "Vic Hagens",
        email: "vic@example.com",
        role: "superadmin",
      };

      const { error } = validateUpdateUser(user);

      expect(error).toBeDefined();
    });
  });
});
