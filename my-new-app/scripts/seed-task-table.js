const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mail_dispatcher',
    port: 3306,
    connectionLimit: 2,
  });

  try {
    console.log('Vérification / création de la table `task`...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mail_id INT NOT NULL,
        priority_id INT NOT NULL,
        category_id INT NOT NULL,
        created_at DATETIME NOT NULL,
        state VARCHAR(32) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Insertion de lignes de test (3)...');
    await pool.query("INSERT INTO task (mail_id, priority_id, category_id, created_at, state) VALUES (?, ?, ?, NOW(), ?)", [101, 1, 1, 'NEW']);
    await pool.query("INSERT INTO task (mail_id, priority_id, category_id, created_at, state) VALUES (?, ?, ?, NOW(), ?)", [102, 2, 1, 'ASSIGNED']);
    await pool.query("INSERT INTO task (mail_id, priority_id, category_id, created_at, state) VALUES (?, ?, ?, NOW(), ?)", [103, 1, 2, 'DONE']);

    console.log('Seed terminé.');
  } catch (err) {
    console.error('Erreur pendant le seed :', err && err.stack ? err.stack : err);
    process.exitCode = 2;
  } finally {
    try { await pool.end(); } catch (e) { }
  }
}

main();
