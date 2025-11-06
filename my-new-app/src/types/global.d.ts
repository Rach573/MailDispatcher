import type { Tache, Mail } from '../shared/types/DatabaseModels';

declare global {
  interface Window {
    api: {
      getAllTickets: () => Promise<Tache[]>;
      createTicket: (mail: Mail, agentUserId: number) => Promise<void>;
    };
  }
}

export {};
