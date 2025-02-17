const { Pool } = require('pg');

const pool = new Pool({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
  max: 2,
});

async function openConnection() {
  const client = await pool.connect();

  const result = await client.query(`SELECT 1 + 1 as soma;`);
  console.log(result.rows);

  setTimeout(() => {
    client.release();
    console.log('Fechando conexão...');
  }, 3000);
}

openConnection();

setTimeout(() => {
  openConnection();
}, 1000);

setTimeout(() => {
  openConnection();
}, 2000);
