const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mail_dispatcher',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    console.log('Connexion à la base : mail_dispatcher ...');
    const [rows] = await pool.query('SELECT id, mail_id, priority_id, category_id, created_at, state FROM task LIMIT 20');
    console.log('Nombre de lignes retournées :', Array.isArray(rows) ? rows.length : 0);
    if (Array.isArray(rows) && rows.length > 0) {
      console.log('Exemple de lignes :');
      console.log(JSON.stringify(rows.slice(0, 5), null, 2));
    } else {
      console.log('Aucune ligne trouvée (table vide ou requête retournée 0 lignes).');
    }
  } catch (err) {
    console.error('Erreur lors de la requête :');
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 2;
  } finally {
    try { await pool.end(); } catch (e) { /* ignore */ }
  }
}

main();
