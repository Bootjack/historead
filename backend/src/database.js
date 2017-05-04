const knex = require('knex');
const db = knex({
  client: 'mysql',
  connection: {
    host: 'db',
    user: 'historead',
    password: 'password',
    database: 'historead'
  }
});

module.exports = new Promise((resolve, reject) => {
  db.schema.createTableIfNotExists('knex_migrations', table => {
    console.log('Created migrations table.\n', table);
  });
  db.migrate.latest()
    .then(() => resolve(db))
    .catch(() => reject(db));
});
