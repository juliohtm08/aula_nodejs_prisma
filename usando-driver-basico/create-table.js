const pg = require('pg');

// connection string: protocolo://usuario:senha@host:porta/nome_do_banco
const db = new pg.Client({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
});

console.log(db);

async function createTable() {
  await db.connect();

  const query = `
    CREATE TABLE IF NOT EXISTS "public"."Pokemon"(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255)
    );
  `;
  const result = await db.query(query);
  console.log(result);

  await db.end();
}

createTable();
