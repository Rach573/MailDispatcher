import type { Task, TaskState } from './type';

export function createTaskObject(mailId: number, priorityId: number, categoryId: number): Omit<Task, 'id' | 'createdAt'> & Partial<Pick<Task, 'id' | 'createdAt'>> {
  return {
    mailId,
    priorityId,
    categoryId,
    state: 'NEW' as TaskState
  } as any;
}

export function formatTask(t: Task): string {
  return `#${t.id} (${t.state}) - mail ${t.mailId}`;
}
