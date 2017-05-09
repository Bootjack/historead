import React from 'react';
import PropTypes from 'prop-types';
import {connectEvents} from 'connectors/events';

export function EventList(props) {
  return (
    <div className="hst-event-list">
      {props.events.map((event, i) => {
        return (
          <div className="hst-event" key={event.id}>{i + 1}. {event.name}</div>
        );
      })}
    </div>
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
