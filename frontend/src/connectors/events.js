import React from 'react';

var subscriberId = 0;
const subscribers = {};

function subscribeToEvents(handler) {
  const handlerId = subscriberId++;
  subscribers[handlerId] = handler;
  return function() { delete subscribers[handlerId]; };
}

function updateEventSubscribers(events) {
  Object.values(subscribers).forEach(handler => handler(events));
}

export function fetchEvents({start, end}) {
  return fetch(`api/events/from/${start}/to/${end}`)
    .then(res => res.json())
    .then(updateEventSubscribers)
    .catch(err => console.log(err)); //eslint-disable-line
}

export function postEvent({name, start, end}) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return fetch('api/events', {
      body: JSON.stringify({name, start, end}),
      headers,
      method: 'POST'
    })
    .catch(err => console.log(err)); // eslint-disable-line
}

export function deleteEvent({id}) {
  return fetch(`api/events/${id}`, {
    method: 'DELETE'
  })
  .catch(err => console.log(err)); // eslint-disable-line
}

export function connectEvents(Child) {
  return class ConnectedChild extends React.Component {
    constructor() {
      super();
      this.state = {events: []};
      this.unsubscribeFromEvents = subscribeToEvents(this.handleEventsUpdate.bind(this));
    }

    componentWillUnmount() {
      this.unsubscribeFromEvents();
    }

    handleEventsUpdate(events) {
      this.setState({events});
    }

    render() {
      return (<Child events={this.state.events}/>);
    }
  }
}
