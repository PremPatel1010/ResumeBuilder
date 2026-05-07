import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import { env } from "../config/index.js";

export function signToken(userId) {
  if (!env.jwtSecret) throw new ApiError(500, "JWT is not configured");
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function verifyToken(token) {
  if (!env.jwtSecret) throw new ApiError(500, "JWT is not configured");
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (!decoded?.sub) throw new ApiError(401, "Invalid token");
    return { userId: String(decoded.sub) };
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}
