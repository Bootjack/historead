import React from 'react';
import PropTypes from 'prop-types';

export default function EventList(props) {
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
