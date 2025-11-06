import { contextBridge, ipcRenderer } from 'electron';
import type { Task } from '../../shared/type';
const mysql = require('mysql2/promise');

contextBridge.exposeInMainWorld('api', {
  getTasks: async (): Promise<Task[]> => {
    return await ipcRenderer.invoke('tasks:get');
  },
  createTask: async (mailId: number, priorityId: number, categoryId: number): Promise<void> => {
    await ipcRenderer.invoke('tasks:create', mailId, priorityId, categoryId);
  }
});

(async () => {
  try {
    const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'root', database: 'mail_dispatcher', port: 3306 });
    const [rows] = await pool.query("SHOW TABLES");
    console.log('Tables:', rows);
    await pool.end();
  } catch (err) {
    console.error('Erreur connexion DB:', err);
    process.exit(1);
  }
})();
