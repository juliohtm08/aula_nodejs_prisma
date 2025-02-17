// poolling de conexões seria um conjunto de varias conexões

const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
});

async function openConnection() {
  await client.connect();

  const result = await client.query(`SELECT 1 + 1 AS resultado;`);
  console.log(result.rows);

  setTimeout(() => {
    client.end();
    console.log('Fechando conexão...');
  }, 5000);
}

openConnection();

openConnection();
