import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { registerMailIpcHandlers } from './ipc/mail.ipc';
import { logger } from './utils/logger';
import { disconnectPrisma } from './repositories/prisma/client';

// Variables éventuellement injectées par l'environnement de build (Vite/Electron Forge)
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string | undefined;

// Désactiver les fonctionnalités d'autofill pour éviter les erreurs DevTools
app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication,AutofillEnableAccountSuggestions");
app.commandLine.appendSwitch("disable-blink-features", "Autofill");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = (): void => {
  logger.info('Création de la fenêtre principale');
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// Initialize app when ready
app.whenReady().then(() => {
  logger.info('Application prête');
  registerMailIpcHandlers();
  createWindow();
});

app.on('window-all-closed', async () => {
  await disconnectPrisma();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Graceful shutdown
app.on('before-quit', async (event) => {
  event.preventDefault();
  await disconnectPrisma();
  app.exit();
});
