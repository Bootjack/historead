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

function validateEvent(event) {
  return {
    name: event.name,
    description: event.description,
    start: expandDate(event.start, false),
    end: expandDate(event.end || event.start, true)
  };
}

function createEvents(db, req, res, next) {
  const event = validateEvent(req.body);
  db('events').insert(event)
    .then(ids => res.json({success: true, insertedIds: ids}))
    .catch(err => res.status(500).json({success: false, message: 'Unable to insert event', error: err}));
}

function retrieveEvents(query, res, next) {
  query.then(events => res.json(events))
    .catch(err => res.status(500).json({success: false, message: 'Unable to query events', error: err}));
}

function retrieveEventsFromStartToEnd(db, req, res, next) {
  const start = expandDate(req.params.start, false);
  const end = expandDate(req.params.end, true);
  const query = db.select().from('events')
    .where(function() {this.where('start', '<', start).andWhere('end', '>', end)})
    .orWhereBetween('start', [start, end])
    .orWhereBetween('end', [start, end])
    .orderBy('start', 'asc');
  retrieveEvents(query, res, next);
}

function deleteEvent(db, req, res, next) {
  db.del().from('events').where({id: req.params.id})
    .then(affected => affected > 0
      ? res.status(200).json({success: true})
      : res.status(404).json({success: false, message: 'Matching event not found'}))
    .catch(err => res.status(500).json({success: false, message: 'Unable to delete event', error: err}));
}

function attachDatabase(db, func) {
  return (req, res, next) => func.call(this, db, req, res, next);
}

module.exports = function (db) {
  const events = express.Router();
  events.post('/', attachDatabase(db, createEvents));
  events.get('/from/:start/to/:end', attachDatabase(db, retrieveEventsFromStartToEnd));
  events.delete('/:id/', attachDatabase(db, deleteEvent));
  return events;
}
