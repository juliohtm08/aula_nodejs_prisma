const pg = require('pg');

const db = new pg.Client({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
});

async function createTableEvents() {
  await db.connect();

  const query = `
        CREATE TABLE IF NOT EXISTS "public"."events"(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            date DATE,
            total_tickets INT,
            tickets_sold INT
        );
    `;

  const result = await db.query(query);
  console.log(result);

  await db.end();
}

createTableEvents();
