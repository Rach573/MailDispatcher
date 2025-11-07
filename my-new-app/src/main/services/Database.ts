// my-new-app/src/main/services/Database.ts
import { PrismaClient } from '../prisma/generated/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { createPool } from 'mysql2/promise';

// 1. Créer le pool de bas niveau (comme avant)
const connectionPool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'snowdispatcher',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 2. Créer l'adaptateur Prisma
const adapter = new PrismaMariaDb(connectionPool);

// 3. Exporter une instance unique (singleton) du client Prisma
// @ts-ignore - L'adaptateur peut avoir un type légèrement différent
export const prisma = new PrismaClient({ adapter });

console.log('PrismaClient avec adaptateur MariaDB créé.');
