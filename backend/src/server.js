const bodyParser = require('body-parser');
const express = require('express');

const database = require('./database');
const routers = require('./routers');

const api = express();

api.use(bodyParser.json());

database.then(db => {
  api.use('/events', routers.events(db));
  api.listen(80);
  process.stdout.write('Express server running on port 80.\n');
}).catch(err => {
  process.stderr.write('Unable to connect to database.\n');
  process.stderr.write(`${err}\n`);
});
