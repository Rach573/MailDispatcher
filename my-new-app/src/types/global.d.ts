import type { MailServices } from '../preload/mailServices';

declare global {
  interface Window {
    api: MailServices;
  }
}

export {};
