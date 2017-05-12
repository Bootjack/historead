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
      <div className="hst-event-list-item-delete" onClick={() => deleteEvent(event)}>x</div>
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

export function EventList(props) {
  return (
    <ol className="hst-event-list">
      {props.events.map((event) => {
        return <EventListItem key={event.id} event={event}/>
      })}
    </ol>
  );
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }))
};

EventList.defaultProps = {
  events: []
};

export default connectEvents(EventList);
