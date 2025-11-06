const mysql = require('mysql2/promise');

const candidates = [
  { user: 'root', password: 'root' },
  { user: 'root', password: '' },
  { user: 'root', password: null },
  { user: 'root', password: 'toor' },
];

async function tryCreds(c) {
  const cfg = {
    host: 'localhost',
    user: c.user,
    password: c.password,
    database: 'mail_dispatcher',
    port: 3306,
    connectionLimit: 1,
    waitForConnections: true,
  };

  try {
    const pool = mysql.createPool(cfg);
    await pool.query('SELECT 1');
    await pool.end();
    return { ok: true };
  } catch (err) {
    return { ok: false, err: err && err.message ? err.message : String(err) };
  }
}

(async () => {
  console.log('Probe MySQL credentials against database "mail_dispatcher"');
  for (const c of candidates) {
    const displayPwd = c.password === null ? '<null>' : (c.password === '' ? "'' (empty)" : c.password);
    process.stdout.write(`Testing ${c.user}@localhost password=${displayPwd} ... `);
    const res = await tryCreds(c);
    if (res.ok) {
      console.log('OK');
      process.exit(0);
    } else {
      console.log('FAILED ->', res.err);
    }
  }
  console.log('\nNo candidate credentials worked.');
  console.log('Please verify MySQL is running and provide correct user/password in src/main/myRepo/repositories.ts');
  process.exit(2);
})();
