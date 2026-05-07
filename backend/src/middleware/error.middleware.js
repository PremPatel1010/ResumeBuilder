import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/index.js";

/** @typedef {import("express").Request} Request */
/** @typedef {import("express").Response} Response */
/** @typedef {import("express").NextFunction} NextFunction */

/** @type {(err: unknown, req: Request, res: Response, next: NextFunction) => void} */
export function errorHandler(err, _req, res, _next) {
  console.error("[error]", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (typeof err === "object" && err && "code" in err && err.code === 11000) {
    return res.status(409).json({ message: "A record with that unique field already exists" });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ message: first?.message || "Validation error" });
  }

  const message =
    env.nodeEnv === "production"
      ? "Something went wrong. Please try again."
      : err instanceof Error
        ? err.message
        : "Unknown error";

  return res.status(500).json({ message });
}

/** @type {(req: Request, res: Response) => void} */
export function notFound(req, res) {
  res.status(404).json({ message: `Not found — ${req.method} ${req.originalUrl}` });
}
