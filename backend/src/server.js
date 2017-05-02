const bodyParser = require('body-parser');
const express = require('express');

const db = require('./database');

const api = express();

api.use(bodyParser.json());

api.get('/events/from/:start/to/:end', (req, res) => {
  const {start, end} = req.params;
  process.stdout.write(`request received at /events/from/${start}/to/${end}`);
  res.status(501).send('Not implemented …evar!');
});

api.post('/events', (req, res) => {
  process.stdout.write('request received at /events');
  res.status(501).send('Not implemented …evar!');
});

api.listen(80);
