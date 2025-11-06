// Types et fonctions pour la gestion des tâches/tickets de messagerie

export type TaskState = "NEW" | "ASSIGNED" | "DONE";

export interface Task {
  id: number;
  mailId: number;
  priorityId: number;
  categoryId: number;
  createdAt: string;
  state: TaskState;
}

/**
 * Crée un objet Task partiel pour insertion en base
 */
export function createTaskObject(
  mailId: number, 
  priorityId: number, 
  categoryId: number
): Omit<Task, 'id' | 'createdAt'> & Partial<Pick<Task, 'id' | 'createdAt'>> {
  return {
    mailId,
    priorityId,
    categoryId,
    state: 'NEW' as TaskState
  } as any;
}

/**
 * Formate une tâche pour affichage
 */
export function formatTask(t: Task): string {
  return `#${t.id} (${t.state}) - mail ${t.mailId}`;
}
