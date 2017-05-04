const express = require('express');
const moment = require('moment');

function expandDate(input, forward) {
  const direction = forward ? 'endOf' : 'startOf';
  const [year, month, day] = input.split('-');
  const date = moment(input, 'YYYY-MM-DD');
  if (!month) date[direction]('year');
  if (!day) date[direction]('month');
  return date.format('YYYY-MM-DD');
}

function getEventsFromStartToEnd(db, req, res, next) {
  const start = expandDate(req.params.start);
  const end = expandDate(req.params.end, true);
  db.select().from('events')
    .where(function() {this.where('start', '<', start).andWhere('end', '>', end)})
    .orWhereBetween('start', [start, end])
    .orWhereBetween('end', [start, end])
    .then(events => res.json(events))
    .catch(err => res.status(500).json({success: false, message: 'Unable to query events', error: err}));
}

function postEvents(db, req, res, next) {
  db('events').insert(req.body)
    .then(ids => res.json({success: true, insertedIds: ids}))
    .catch(err => res.status(500).json({success: false, message: 'Unable to insert event', error: err}));
}

function attachDatabase(db, func) {
  return (req, res, next) => func.call(this, db, req, res, next);
}

module.exports = function (db) {
  const events = express.Router();
  events.get('/from/:start/to/:end', attachDatabase(db, getEventsFromStartToEnd));
  events.post('/', attachDatabase(db, postEvents));
  return events;
}
