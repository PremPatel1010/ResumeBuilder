import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/index.js";

try {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`Resume Architect API listening on http://localhost:${env.port}`);
    console.log(`REST base URL: http://localhost:${env.port}/api`);
  });
} catch (err) {
  console.error("Database connection failed:", err);
  process.exit(1);
}
