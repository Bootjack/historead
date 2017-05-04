exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function (table) {
    table.increments('id');
    table.varchar('name', 255).notNullable();
    table.date('start').notNullable();
    table.date('end');
    table.integer('offset').notNullable();
    table.unique(['name', 'start', 'offset']);
    table.index('start');
    table.index('end');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events');
}
