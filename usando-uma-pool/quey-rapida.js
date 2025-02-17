const { Pool } = require('pg');

const pool = new Pool({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
  max: 2,
});

async function queryRapida() {
  const result = await pool.query(`SELECT 1 + 1 AS soma;`); // Executa a query
  console.log(result.rows[0]);

  setTimeout(() => {
    console.log('Fechando conexão...');
  }, 3000);
}

queryRapida(); // 1ª chamada
queryRapida(); // 2ª chamada
queryRapida(); // 3ª chamada
