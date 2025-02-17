const pg = require('pg');

const db = new pg.Client({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
});

async function addEventForDatabase() {
  await db.connect();

  const enventData = {
    name: 'GreenValley',
    date: '09-07-2003',
    total_tickets: 10,
    tickets_sold: 0,
  };

  const addEvent = await db.query(
    `INSERT INTO "events"(name, date, total_tickets, tickets_sold) VALUES ($1, $2, $3, $4);`,
    [
      enventData.name,
      enventData.date,
      enventData.total_tickets,
      enventData.tickets_sold,
    ]
  );
  console.log(addEvent);

  await db.end();
}

addEventForDatabase();
