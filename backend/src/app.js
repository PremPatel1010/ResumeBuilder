import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { env } from "./config/index.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());

/** Vite / Lovable / various dev servers use different ports (5173, 8080, etc.) */
const LOCAL_DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsAllowList =
  typeof env.corsOrigin === "string" && env.corsOrigin.trim()
    ? env.corsOrigin
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

const corsOrigin =
  corsAllowList && corsAllowList.length > 0
    ? (origin, callback) => {
        if (!origin) return callback(null, true);
        if (env.nodeEnv !== "production" && LOCAL_DEV_ORIGIN.test(origin)) {
          return callback(null, true);
        }
        if (corsAllowList.includes(origin)) return callback(null, true);
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    : true;

app.use(
  cors({
    origin: corsOrigin,
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
    maxAge: 86400,
  })
);

app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
