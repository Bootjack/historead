const bodyParser = require('body-parser');
const express = require('express');

const client = require('./redis-client');

const DATA_ERROR = {error: 'Unable to connect to data source.\n'};

const api = express();

api.use(bodyParser.json());

api.get('/events/from/:start/to/:end', (req, res) => {
  const {start, end} = req.params;
  client.lrange('events', start, end)
    .then(events => res.json(events))
    .catch(err => res.status(500).json(DATA_ERROR));
});

api.post('/events', (req, res) => {
  client.rpush('events', req.body)
    .then(() => res.json(req.body))
    .catch(err => res.status(500).json(DATA_ERROR));
});

api.listen(8888);
