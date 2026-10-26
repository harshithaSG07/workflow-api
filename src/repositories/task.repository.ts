import { pool } from "../config/database";

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
const result = await pool.query(
`INSERT INTO tasks (title, description, status, priority, due_date, project_id)
     SELECT $1, $2, COALESCE($3, 'pending'), COALESCE($4, 'medium'), $5, p.id
     FROM projects p
     WHERE p.id = $6 AND p.user_id = $7
     RETURNING id, title, description, status, priority, due_date, project_id, created_at, updated_at`,
[
input.title,
input.description ?? null,
input.status ?? null,
input.priority ?? null,
input.due_date ?? null,
input.projectId,
input.userId,
]
);

return result.rows[0] ?? null;
}

export async function getTasksByProject(
projectId: string,
userId: string,
status?: string,
priority?: string
) {
const result = await pool.query(
`SELECT t.id, t.title, t.description, t.status, t.priority,
            t.due_date, t.project_id, t.created_at, t.updated_at
     FROM tasks t
     JOIN projects p ON p.id = t.project_id
     WHERE p.id = $1 AND p.user_id = $2
       AND ($3::text IS NULL OR t.status = $3)
       AND ($4::text IS NULL OR t.priority = $4)
     ORDER BY t.created_at DESC`,
[projectId, userId, status ?? null, priority ?? null]
);

return result.rows;
}

export async function getTaskById(taskId: string, userId: string) {
const result = await pool.query(
`SELECT t.id, t.title, t.description, t.status, t.priority,
            t.due_date, t.project_id, t.created_at, t.updated_at
     FROM tasks t
     JOIN projects p ON p.id = t.project_id
     WHERE t.id = $1 AND p.user_id = $2`,
[taskId, userId]
);

return result.rows[0] ?? null;
}

export async function updateTask(
taskId: string,
userId: string,
input: UpdateTaskInput
) {
const result = await pool.query(
`UPDATE tasks t
     SET title = COALESCE($1, t.title),
         description = CASE WHEN $2::boolean THEN $3 ELSE t.description END,
         status = COALESCE($4, t.status),
         priority = COALESCE($5, t.priority),
         due_date = CASE WHEN $6::boolean THEN $7::date ELSE t.due_date END,
         updated_at = NOW()
     FROM projects p
     WHERE t.id = $8
       AND p.id = t.project_id
       AND p.user_id = $9
     RETURNING t.id, t.title, t.description, t.status, t.priority,
               t.due_date, t.project_id, t.created_at, t.updated_at`,
[
input.title ?? null,
Object.hasOwn(input, "description"),
input.description ?? null,
input.status ?? null,
input.priority ?? null,
Object.hasOwn(input, "due_date"),
input.due_date ?? null,
taskId,
userId,
]
);

return result.rows[0] ?? null;
}

export async function deleteTask(taskId: string, userId: string) {
const result = await pool.query(
`DELETE FROM tasks t
     USING projects p
     WHERE t.id = $1
       AND p.id = t.project_id
       AND p.user_id = $2
     RETURNING t.id`,
[taskId, userId]
);

return result.rowCount !== null && result.rowCount > 0;
}
