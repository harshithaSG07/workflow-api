import express from "express";
import { pool } from "./config/database";
import authRoutes from "./routes/auth.routes";
import {
  authenticateToken,
  AuthRequest,
} from "./middleware/auth.middleware";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to WorkFlow API!",
    status: "running",
  });
});

app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.json({
      status: "connected",
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);

app.get(
  "/api/auth/me",
  authenticateToken,
  (req: AuthRequest, res) => {
    res.status(200).json({
      message: "Authentication successful",
      userId: req.userId,
    });
  }
);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);
export default app;