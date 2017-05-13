exports.up = function(knex, Promise) {
  return knex.schema.table('events', function (table) {
    table.text('description');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('events', function (table) {
    table.dropColumn('description');
  });
}
