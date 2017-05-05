const knex = require('knex');
const db = knex({
  client: 'postgresql',
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
    .catch(() => reject('Unable to migrate database'))
    .then(() => db.seed.run())
    .catch(() => reject('Unable to seed database'))
    .then(() => resolve(db));
});
