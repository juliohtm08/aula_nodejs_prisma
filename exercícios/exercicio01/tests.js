const {
  createEvent,
  getAllEvents,
  getEventsByName,
  getEventsByDate,
  sellTicket,
} = require('./functions');

async function tests() {
  await createEvent('teste2', new Date('2025-08-03'), 5);
  //await createEvent('Green Valley', new Date('2023-03-03'), 100);

  //const result = await getAllEvents();
  //console.log(result);

  //const result2 = await getEventsByName('show 1');
  //console.log(result2);

  //const result3 = await getEventsByDate(new Date('2025-01-02'));
  //console.log(result3);

  await sellTicket(12);
  await sellTicket(12);
  await sellTicket(12);
  await sellTicket(12);
  await sellTicket(12);

  const result = await getAllEvents();
  console.log(result);

  process.exit(0);
}

tests();
