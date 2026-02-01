import { pool } from "../db";

export interface Task {
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt?: Date;
}

const mapRowToTask = (row: any): Task => ({
  id: Number(row.id),
  title: row.title,
  description: row.description ?? null,
  isCompleted: row.is_completed,
  createdAt: row.created_at,
});

export class TasksRepository {
  findAll = async () => {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    return result.rows.map(mapRowToTask);
  };

  findById = async (id: number) => {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return mapRowToTask(result.rows[0]);
  };

  save = async (task: Task) => {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, is_completed)
         VALUES ($1, $2, $3)
         RETURNING id, title, description, is_completed, created_at`,
      [task.title, task.description ?? null, task.isCompleted]
    );
    return mapRowToTask(result.rows[0]);
  };

  update = async (id: number, task: Task) => {
    const result = await pool.query(
      `UPDATE tasks
         SET
           title = COALESCE($2, title),
           description = COALESCE($3, description),
           is_completed = COALESCE($4, is_completed)
         WHERE id = $1
         RETURNING id, title, description, is_completed, created_at`,
      [
        id,
        task.title ?? null,
        task.description ?? null,
        task.isCompleted ?? null,
      ]
    );
    return mapRowToTask(result.rows[0]);
  };

  destroy = async (id: number) => {
    const result = await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    return result.rowCount ? true : false;
  };
}
