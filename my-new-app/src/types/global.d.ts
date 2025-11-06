import type { Task } from '../shared/types/MessagingModels';

declare global {
  interface Window {
    api: {
      getTasks: () => Promise<Task[]>;
      createTask: (mailId: number, priorityId: number, categoryId: number) => Promise<void>;
    };
  }
}

export {};
