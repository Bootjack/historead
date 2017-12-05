import React from 'react';
import PropTypes from 'prop-types';
import {connectEvents, deleteEvent} from 'connectors/events';
import moment from 'moment';

require('styles/event-list');

function EventListItem(props) {
  const {event} = props;
  const start = moment(event.start)
  const end = moment(event.end)
  const duration = end.unix() - start.unix();
  const style = {
    flexGrow: duration
  };
  return (
    <li className="hst-event-list-item"
      style={style}>
      <div className="hst-event-list-item-name">{event.name}</div>
      <div className="hst-event-list-item-dates">{start.format('YYYY-MM-DD')} to {end.format('YYYY-MM-DD')}</div>
      <div className="icon-trash hst-event-list-item-delete" onClick={() => deleteEvent(event)}/>
    </li>
  );
}

EventListItem.propTypes = {
  event: PropTypes.shape({
    end: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired
  }),
  onDelete: PropTypes.func,
};

EventListItem.defaultProps = {
  onDelete() {}
};

function EventListGap(props) {
  const {events} = props;
  if (!events[0] || !events[1]) {
    return null;
  }

  const start = moment(events[0].end);
  const end = moment(events[1].start);
  const duration = end.unix() - start.unix();

  if (!duration) {
    return null;
  }

  const style = {
    flexGrow: duration
  };
  return (
    <div className="hst-event-list-gap" style={style} />
  );
}

EventListGap.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    end: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired
  }))
};

export function EventList(props) {
  const {start, end, events} = props;
  const firstEvent = events[0] || {};
  const lastEvent = events[events.length - 1] || {};
  const startEvent = {start, end: firstEvent.start};
  const endEvent = {start: lastEvent.end, end};
  return (
    <ol className="hst-event-list">
      {events.reduce((list, event, i) => {
        const nextEvent = events[i + 1] || endEvent;
        return list.concat([
          <EventListItem key={event.id} event={event}/>,
          <EventListGap key={`${event.id}-gap`} events={[nextEvent, event]}/>
        ]);
      }, [<EventListGap key={`{startEvent.id}-gap`} events={[startEvent, events[0]]}/>])}
    </ol>
  );
}

EventList.propTypes = {
  end: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })),
  start: PropTypes.number
};

EventList.defaultProps = {
  events: []
};

export default connectEvents('main', EventList);
