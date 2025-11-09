// src/preload/index.ts

import { contextBridge } from 'electron';
import { mailServices } from './mailServices';

// Expose IPC API to renderer process
contextBridge.exposeInMainWorld('api', mailServices);
