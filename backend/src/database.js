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

function applyEventSchema(table) {
  table.increments('id').unsigned();
  table.varchar('name', 255);
  table.date('start');
  table.date('end');
  table.index('start');
  table.index('end');
}

db.schema.hasTable('events')
  .then(exists => !exists && db.schema.createTableIfNotExists('events', applyEventSchema))
  .then(result => result && process.stdout.write('Created "events" table.\n'))
  .catch(err => process.stderr.write(`Unable to create "events" table. ${err}\n`));

module.exports = db;
