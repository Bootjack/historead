const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment');

const db = require('./database');

const api = express();

api.use(bodyParser.json());

function expandDate(input, forward) {
  const direction = forward ? 'endOf' : 'startOf';
  const [year, month, day] = input.split('-');
  const date = moment(input, 'YYYY-MM-DD');
  if (!month) date[direction]('year');
  if (!day) date[direction]('month');
  return date.format('YYYY-MM-DD');
}

api.get('/events/from/:start/to/:end', (req, res) => {
  const start = expandDate(req.params.start);
  const end = expandDate(req.params.end, true);
  db.select().from('events')
    .where(function() {this.where('start', '<', start).andWhere('end', '>', end)})
    .orWhereBetween('start', [start, end])
    .orWhereBetween('end', [start, end])
    .then(events => res.json(events))
    .catch(err => res.status(500).json({success: false, message: 'Unable to query events', error: err}));
});

api.post('/events', (req, res) => {
  db('events').insert(req.body)
    .then(ids => res.json({success: true, insertedIds: ids}))
    .catch(err => res.status(500).json({success: false, message: 'Unable to insert event', error: err}));
});

api.listen(80);
