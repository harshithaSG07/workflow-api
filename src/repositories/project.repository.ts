import { pool } from "../config/database";

interface CreateProjectInput {
  name: string;
  description?: string;
  userId: string;
}

export async function createProject(input: CreateProjectInput) {
  const result = await pool.query(
    `INSERT INTO projects (name, description, user_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, description, user_id, created_at, updated_at`,
    [
      input.name,
      input.description ?? null,
      input.userId,
    ]
  );

  return result.rows[0];
}
export async function getProjectsByUserId(userId: string) {
  const result = await pool.query(
    `SELECT id, name, description, user_id, created_at, updated_at
     FROM projects
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function getProjectById(
  projectId: string,
  userId: string
) {
  const result = await pool.query(
    `SELECT id, name, description, user_id, created_at, updated_at
     FROM projects
     WHERE id = $1 AND user_id = $2`,
    [projectId, userId]
  );

  return result.rows[0] ?? null;
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: { name: string; description?: string | null }
) {
  const result = await pool.query(
    `UPDATE projects
     SET name = $1,
         description = $2,
         updated_at = NOW()
     WHERE id = $3 AND user_id = $4
     RETURNING id, name, description, user_id, created_at, updated_at`,
    [input.name, input.description ?? null, projectId, userId]
  );

  return result.rows[0] ?? null;
}

export async function deleteProject(
  projectId: string,
  userId: string
) {
  const result = await pool.query(
    `DELETE FROM projects
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [projectId, userId]
  );

  return result.rowCount !== null && result.rowCount > 0;
}