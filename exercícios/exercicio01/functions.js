const { query } = require('./pool');

async function createEvent(name, eventDate, totalTickets) {
  if (typeof totalTickets === 'number' && totalTickets > 0) {
    await query(
      `INSERT INTO events (name, event_date, total_tickets) VALUES ($1, $2, $3);`,
      [name, eventDate, totalTickets]
    );
    console.log('Event created successfully!');
  } else {
    throw new Error('Total tickets must be greater than 0');
  }
}

async function getAllEvents() {
  const { rows } = await query(`
            SELECT
                id, 
                name,
                event_date AS "eventDate",
                total_tickets AS "totalTickes",
                tickets_sold AS "ticketsSold"
            FROM events;
        `);
  return rows;
}

async function getEventsByName(name) {
  const { rows } = await query(
    `
        SELECT
            id, 
            name,
            event_date AS "eventDate",
            total_tickets AS "totalTickes",
            tickets_sold AS "ticketsSold"
        FROM events
        WHERE name = $1;
    `,
    [name]
  );
  return rows;
}

async function getEventsByDate(eventDate) {
  const { rows } = await query(
    `
            SELECT
                id, 
                name,
                event_date AS "eventDate",
                total_tickets AS "totalTickes",
                tickets_sold AS "ticketsSold"
            FROM events
            WHERE event_date = $1;
        `,
    [eventDate]
  );
  return rows;
}

async function sellTicket(eventId) {
  const { rows } = await query(
    `SELECT
        id,
        event_date AS "eventDate",
        total_tickets AS "totalTickets",
        tickets_sold AS "ticketsSold"
      FROM events
      WHERE id = $1;`,
    [eventId]
  );

  const event = rows[0];
  const now = new Date();
  const eventDate = new Date(event.eventDate);

  if (eventDate > now && event.ticketsSold < event.totalTickets) {
    await query(
      `UPDATE events
        SET tickets_sold = tickets_sold + 1
        WHERE id = $1;`,
      [eventId]
    );
  } else {
    throw new Error(
      'Cannot sell ticket: Event has passed or no tickets available.'
    );
  }
}

module.exports = {
  getAllEvents,
  createEvent,
  getEventsByName,
  getEventsByDate,
  sellTicket,
};
