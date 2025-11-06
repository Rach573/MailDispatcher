import mysql from 'mysql2/promise';

// Connexion à MariaDB locale (config à adapter si besoin)
export const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',           // ou ton user MariaDB
  password: '',           // mot de passe s’il y en a un
  database: 'Snowdispatcher',
});

connection
  .then(() => console.log('✅ Connexion à Snowdispatcher réussie'))
  .catch((error) => console.error('❌ Échec de la connexion à Snowdispatcher', error));
