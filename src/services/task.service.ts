import * as taskRepository from "../repositories/task.repository";

interface CreateTaskInput {
title: string;
description?: string;
status?: "pending" | "in_progress" | "completed";
priority?: "low" | "medium" | "high";
due_date?: string | null;
projectId: string;
userId: string;
}

interface UpdateTaskInput {
title?: string;
description?: string | null;
status?: "pending" | "in_progress" | "completed";
priority?: "low" | "medium" | "high";
due_date?: string | null;
}

export async function createTask(input: CreateTaskInput) {
return taskRepository.createTask(input);
}

export async function getTasks(
projectId: string,
userId: string,
status?: string,
priority?: string
) {
return taskRepository.getTasksByProject(
projectId,
userId,
status,
priority
);
}

export async function getTaskById(taskId: string, userId: string) {
return taskRepository.getTaskById(taskId, userId);
}

export async function updateTask(
taskId: string,
userId: string,
input: UpdateTaskInput
) {
return taskRepository.updateTask(taskId, userId, input);
}

export async function deleteTask(taskId: string, userId: string) {
return taskRepository.deleteTask(taskId, userId);
}
