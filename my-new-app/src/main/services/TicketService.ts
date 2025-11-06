import { pool } from "./Database";
import { Task } from "../../shared/types/MessagingModels";

export async function getTasks(): Promise<Task[]> {
  const [rows] = await pool.query("SELECT * FROM task");
  return rows as Task[];
}

export async function createTask(mailId: number, priorityId: number, categoryId: number) {
  const [result] = await pool.query(
    "INSERT INTO task (mail_id, priority_id, category_id, created_at, state) VALUES (?, ?, ?, NOW(), 'NEW')",
    [mailId, priorityId, categoryId]
  );
  return result;
}
