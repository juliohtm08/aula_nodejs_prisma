const { Pool } = require('pg');

const pool = new Pool({
  connectionString:
    'postgresql://postgres:q1w2e3r4@localhost:5432/node_postgres',
});

// centraliza todas as chamadas ao banco de dados
async function query(queryString, params, callback) {
  //console.log(`log: query executada - ${queryString}`);
  return pool.query(queryString, params, callback);
}

module.exports = { query };
