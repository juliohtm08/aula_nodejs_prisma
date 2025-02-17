const pg = require('pg');

// connection string: protocolo://usuario:senha@host:porta/nome_do_banco
const db = new pg.Client({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
});

async function selectPokemon() {
  await db.connect();

  const query = `SELECT * FROM "public"."Pokemon";`;
  const result = await db.query(query);
  console.table(result.rows);

  await db.end();
}

selectPokemon();
