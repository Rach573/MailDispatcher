// src/main/services/Database.ts
import mysql from 'mysql2/promise';
import { logger } from '../utils/logger';

// Configuration de la connexion MariaDB
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'snowdispatcher',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

logger.info('Pool de connexions à la base de données créé');
