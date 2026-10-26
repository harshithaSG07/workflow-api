import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
createProjectSchema,
updateProjectSchema,
} from "../validators/project.validator";
import * as projectService from "../services/project.service";

function getUserId(req: Request): string | undefined {
return (req as AuthRequest).userId;
}

function getValidProjectId(
req: Request,
res: Response
): string | undefined {
const projectId = req.params.id;

if (
typeof projectId !== "string" ||
!/^[1-9]\d*$/.test(projectId)
) {
res.status(400).json({ message: "Invalid project ID" });
return undefined;
}

return projectId;
}

export async function createProject(
req: Request,
res: Response
): Promise<void> {
const validation = createProjectSchema.safeParse(req.body);

if (!validation.success) {
res.status(400).json({
message: "Invalid project details",
errors: validation.error.issues.map((issue) => ({
field: issue.path.join("."),
message: issue.message,
})),
});
return;
}

const userId = getUserId(req);

if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

try {
const project = await projectService.createProject({
...validation.data,
userId,
});


res.status(201).json({
  message: "Project created successfully",
  project,
});


} catch (error) {
console.error("Create project error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function getProjects(
req: Request,
res: Response
): Promise<void> {
const userId = getUserId(req);

if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

try {
const projects = await projectService.getProjects(userId);


res.status(200).json({ projects });


} catch (error) {
console.error("Get projects error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function getProjectById(
req: Request,
res: Response
): Promise<void> {
const userId = getUserId(req);

if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const projectId = getValidProjectId(req, res);

if (!projectId) {
return;
}

try {
const project = await projectService.getProjectById(
projectId,
userId
);


if (!project) {
  res.status(404).json({ message: "Project not found" });
  return;
}

res.status(200).json({ project });


} catch (error) {
console.error("Get project error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function updateProject(
req: Request,
res: Response
): Promise<void> {
const userId = getUserId(req);

if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const projectId = getValidProjectId(req, res);

if (!projectId) {
return;
}

const validation = updateProjectSchema.safeParse(req.body);

if (!validation.success) {
res.status(400).json({
message: "Invalid project details",
errors: validation.error.issues.map((issue) => ({
field: issue.path.join("."),
message: issue.message,
})),
});
return;
}

try {
const project = await projectService.updateProject(
projectId,
userId,
validation.data
);


if (!project) {
  res.status(404).json({ message: "Project not found" });
  return;
}

res.status(200).json({
  message: "Project updated successfully",
  project,
});


} catch (error) {
console.error("Update project error:", error);
res.status(500).json({ message: "Internal server error" });
}
}

export async function deleteProject(
req: Request,
res: Response
): Promise<void> {
const userId = getUserId(req);

if (!userId) {
res.status(401).json({ message: "Authentication required" });
return;
}

const projectId = getValidProjectId(req, res);

if (!projectId) {
return;
}

try {
const deleted = await projectService.deleteProject(
projectId,
userId
);


if (!deleted) {
  res.status(404).json({ message: "Project not found" });
  return;
}

res.status(200).json({
  message: "Project deleted successfully",
});


} catch (error) {
console.error("Delete project error:", error);
res.status(500).json({ message: "Internal server error" });
}
}
