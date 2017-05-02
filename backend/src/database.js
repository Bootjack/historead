/*
const Sequelize = require('sequelize');
sequelize = new Sequelize('mariadb://root:password@db/historead');
module.exports = sequelize;
*/

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
  table.integer('id').unsigned().primary();
  table.varchar('name', 255);
  table.date('start');
  table.date('end');
  table.index('start');
  table.index('end');
}

db.schema.createTableIfNotExists('events', applyEventSchema)
  .then(result => process.stdout.write('Created "events" table.'))
  .catch(err => process.stderr.write(`Unable to create "events" table. ${err}`));

module.exports = db;
