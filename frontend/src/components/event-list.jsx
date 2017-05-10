import React from 'react';
import PropTypes from 'prop-types';
import {connectEvents} from 'connectors/events';
import moment from 'moment';

require('styles/event-list');

export function EventList(props) {
  const first = props.events[0];
  const last = props.events[props.events.length - 1];
  const range = first && last ? moment(last.end).unix() - moment(first.start).unix() : 1;

  return (
    <ol className="hst-event-list">
      {props.events.map((event) => {
        const start = moment(event.start)
        const end = moment(event.end)
        const duration = end.unix() - start.unix();
        const style = {
          flexGrow: duration / range,
        };
        return (
          <li className="hst-event"
            key={event.id}
            style={style}>
            <div className="hst-event-name">{event.name}</div>
            <div className="hst-event-dates">{start.format('YYYY-MM-DD')} to {end.format('YYYY-MM-DD')}</div>
          </li>
        );
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
