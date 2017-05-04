const fs = require('fs');
const path = require('path');

exports.seed = function(knex, Promise) {
  const dataPath = path.join(__dirname, 'events_british_royalty.json');
  const fileReadPromise = new Promise(function(resolve, reject) {
    fs.readFile(dataPath, 'utf8', function(err, text) {
      if (err) reject(err);
      resolve(text);
    });
  })

  let data;

  return fileReadPromise
    .then(text => data = JSON.parse(text))
    .then(() => knex('events').del())
    .then(() => knex('events').insert(data))
    .catch(err => process.stderr.write(`${err}\n`));
};
