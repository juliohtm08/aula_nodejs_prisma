const { query } = require('.');

async function syncDatabase() {
  await query(`
            CREATE TABLE IF NOT EXISTS customers(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );    
        `);
  console.log('create "customers" table!');
  process.exit(1);
}

syncDatabase();
