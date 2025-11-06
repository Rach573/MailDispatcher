export type TaskState = "NEW" | "ASSIGNED" | "DONE";

export interface Task {
  id: number;
  mailId: number;
  priorityId: number;
  categoryId: number;
  createdAt: string;
  state: TaskState;
}
