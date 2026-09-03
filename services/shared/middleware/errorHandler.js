const { ZodError } = require("zod");

// Custom application error
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Central error handler middleware (must be registered last)
const errorHandler = (err, req, res, next) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      status: "error",
      code: "VALIDATION_ERROR",
      errors: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
  }

  // Known operational errors (thrown intentionally)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.code || "REQUEST_ERROR",
      message: err.message,
    });
  }

  // Postgres unique violation
  if (err.code === "23505") {
    return res.status(409).json({
      status: "error",
      code: "DUPLICATE_ENTRY",
      message: "A record with this value already exists.",
    });
  }

  // Unknown / unexpected errors — never leak internals in production
  console.error("[error]", err);
  res.status(500).json({
    status: "error",
    code: "INTERNAL_ERROR",
    message: process.env.NODE_ENV === "production" ? "Something went wrong." : err.message,
  });
};

module.exports = { errorHandler, AppError };
