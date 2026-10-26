import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
createTask,
getTasks,
getTaskById,
updateTask,
deleteTask,
} from "../controllers/task.controller";

const router = Router();

router.use(authenticateToken);

router.post("/projects/:projectId/tasks", createTask);
router.get("/projects/:projectId/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
