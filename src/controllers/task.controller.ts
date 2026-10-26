import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
createTaskSchema,
updateTaskSchema,
} from "../validators/task.validator";
import * as taskService from "../services/task.service";

function getUserId(req: Request): string | undefined {
return (req as AuthRequest).userId;
}

function getValidId(
value: unknown,
res: Response
): string | undefined {
if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
res.status(400).json({ message: "Invalid ID" });
return undefined;
}

return value;
}

export async function createTask(req: Request, res: Response): Promise<void> {
const userId = getUserId(req);
if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const projectId = getValidId(req.params.projectId, res);
if (!projectId) return;

const validation = createTaskSchema.safeParse(req.body);
if (!validation.success) {
res.status(400).json({
message: "Invalid task details",
errors: validation.error.issues,
});
return;
}

try {
const task = await taskService.createTask({
...validation.data,
projectId,
userId,
});


if (!task) {
  res.status(404).json({ message: "Project not found" });
  return;
}

res.status(201).json({ message: "Task created successfully", task });


} catch (error) {
console.error("Create task error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function getTasks(req: Request, res: Response): Promise<void> {
const userId = getUserId(req);
if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const projectId = getValidId(req.params.projectId, res);
if (!projectId) return;

const status = req.query.status;
const priority = req.query.priority;

if (
(status !== undefined &&
(typeof status !== "string" ||
!["pending", "in_progress", "completed"].includes(status))) ||
(priority !== undefined &&
(typeof priority !== "string" ||
!["low", "medium", "high"].includes(priority)))
) {
res.status(400).json({ message: "Invalid status or priority filter" });
return;
}

try {
const tasks = await taskService.getTasks(
projectId,
userId,
status as string | undefined,
priority as string | undefined
);


res.status(200).json({ tasks });


} catch (error) {
console.error("Get tasks error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
const userId = getUserId(req);
if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const taskId = getValidId(req.params.id, res);
if (!taskId) return;

try {
const task = await taskService.getTaskById(taskId, userId);


if (!task) {
  res.status(404).json({ message: "Task not found" });
  return;
}

res.status(200).json({ task });


} catch (error) {
console.error("Get task error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function updateTask(req: Request, res: Response): Promise<void> {
const userId = getUserId(req);
if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const taskId = getValidId(req.params.id, res);
if (!taskId) return;

const validation = updateTaskSchema.safeParse(req.body);
if (!validation.success || Object.keys(req.body ?? {}).length === 0) {
res.status(400).json({ message: "Invalid task details" });
return;
}

try {
const task = await taskService.updateTask(
taskId,
userId,
validation.data
);


if (!task) {
  res.status(404).json({ message: "Task not found" });
  return;
}

res.status(200).json({ message: "Task updated successfully", task });


} catch (error) {
console.error("Update task error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
const userId = getUserId(req);
if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const taskId = getValidId(req.params.id, res);
if (!taskId) return;

try {
const deleted = await taskService.deleteTask(taskId, userId);


if (!deleted) {
  res.status(404).json({ message: "Task not found" });
  return;
}

res.status(200).json({ message: "Task deleted successfully" });


} catch (error) {
console.error("Delete task error:", error);
res.status(500).json({ message: "Internal server error" });
}
}
