exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function (table) {
    table.increments('id');
    table.varchar('name', 255).notNullable();
    table.date('start').notNullable();
    table.date('end');
    table.integer('offset').default(0).notNullable();
    table.unique(['name', 'start', 'offset']);
    table.index('start');
    table.index('end');
  }).then(knex.raw(`ALTER TABLE events ADD CHECK (name <> '')`));
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events');
}
