const jwt = require("jsonwebtoken");

jest.mock("../src/models/review", () => ({
  findById: jest.fn(),
}));

const Review = require("../src/models/review");
const adminMiddleware = require("../src/middleware/admin");
const authMiddleware = require("../src/middleware/auth");
const reviewOwnerOrAdminMiddleware = require("../src/middleware/reviewOwnerOrAdmin");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
}

describe("Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("authMiddleware", () => {
    test("returns 401 when no token is provided", () => {
      const req = {
        header: jest.fn(),
      };
      const res = createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Access denied. No token provided.");
      expect(next).not.toHaveBeenCalled();
    });

    test("sets req.user and calls next when token is valid", () => {
      const token = jwt.sign({ _id: "user-id", role: "admin" }, "test-secret");
      const req = {
        header: jest.fn().mockReturnValue(token),
      };
      const res = createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(req.user).toMatchObject({ _id: "user-id", role: "admin" });
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("returns 400 when token is invalid", () => {
      const req = {
        header: jest.fn().mockReturnValue("invalid-token"),
      };
      const res = createResponse();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid token.");
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("adminMiddleware", () => {
    test("allows admins", () => {
      const req = {
        user: {
          role: "admin",
        },
      };
      const res = createResponse();
      const next = jest.fn();

      adminMiddleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("returns 403 for regular users", () => {
      const req = {
        user: {
          role: "user",
        },
      };
      const res = createResponse();
      const next = jest.fn();

      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith("Access denied. Admins only.");
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("reviewOwnerOrAdminMiddleware", () => {
    test("returns 400 for invalid review ids", async () => {
      const req = {
        params: {
          id: "wrong-id",
        },
        user: {
          _id: "user-id",
          role: "user",
        },
      };
      const res = createResponse();
      const next = jest.fn();

      await reviewOwnerOrAdminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid review id.");
      expect(next).not.toHaveBeenCalled();
    });

    test("returns 404 when the review does not exist", async () => {
      Review.findById.mockResolvedValue(null);
      const req = {
        params: {
          id: "665f1e5a9a2f1a0012b34567",
        },
        user: {
          _id: "user-id",
          role: "user",
        },
      };
      const res = createResponse();
      const next = jest.fn();

      await reviewOwnerOrAdminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Review not found.");
      expect(next).not.toHaveBeenCalled();
    });

    test("allows the review owner", async () => {
      const review = {
        user: {
          toString: () => "user-id",
        },
      };
      Review.findById.mockResolvedValue(review);
      const req = {
        params: {
          id: "665f1e5a9a2f1a0012b34567",
        },
        user: {
          _id: "user-id",
          role: "user",
        },
      };
      const res = createResponse();
      const next = jest.fn();

      await reviewOwnerOrAdminMiddleware(req, res, next);

      expect(req.review).toBe(review);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("returns 403 when user is not owner or admin", async () => {
      Review.findById.mockResolvedValue({
        user: {
          toString: () => "other-user-id",
        },
      });
      const req = {
        params: {
          id: "665f1e5a9a2f1a0012b34567",
        },
        user: {
          _id: "user-id",
          role: "user",
        },
      };
      const res = createResponse();
      const next = jest.fn();

      await reviewOwnerOrAdminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith("Access denied.");
      expect(next).not.toHaveBeenCalled();
    });
  });
});
