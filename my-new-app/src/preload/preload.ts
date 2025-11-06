// src/preload/preload.ts

import { contextBridge } from 'electron';
import { mailServices } from './mailServices';

// Exposer l'API importée dans le monde principal du Renderer
contextBridge.exposeInMainWorld('api', mailServices);
