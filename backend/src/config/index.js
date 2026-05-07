import dotenv from "dotenv";

dotenv.config();

const devJwtFallback =
  process.env.NODE_ENV !== "production" ? "dev-only-jwt-secret-min-32-chars-change-me-pls" : null;

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/resume-architect",
  jwtSecret: process.env.JWT_SECRET || devJwtFallback,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN,
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiApiUrl: process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
};

const jwtLen = env.jwtSecret ? String(env.jwtSecret).length : 0;
if (jwtLen < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters (.env)");
}

if (!process.env.JWT_SECRET && env.nodeEnv !== "production") {
  console.warn("[config] JWT_SECRET not set — using insecure development default; set JWT_SECRET for production.");
}
