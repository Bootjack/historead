import React from 'react';

var subscriberId = 1;
const channels = new Map();

function getChannel(channel) {
  if (!channels.has(channel)) channels.set(channel, {handlers: new Map()});
  return channels.get(channel);
}

function subscribeToEvents(channel, handler) {
  const handlerId = subscriberId++;
  const channelHandlers = getChannel(channel).handlers;
  channelHandlers.set(handlerId, handler);
  return function() { channelHandlers.delete(handlerId); };
}

function updateEventChannel(channel, events) {
  const channelHandlers = getChannel(channel).handlers;
  channelHandlers.forEach(handler => handler(events));
}

function fetchAllChannels() {
  const promises = Array.from(channels)
    .filter(channel => channel[1].request)
    .map(([channel, {request}]) => fetchEvents(channel, request));
  return Promise.all(promises);
}

export function fetchEvents(channel, {start, end}) {
  getChannel(channel).request = {start, end};
  return fetch(`api/events/from/${start}/to/${end}`)
    .then(res => res.json())
    .then(events => updateEventChannel(channel, events))
    .catch(err => console.log(err)); //eslint-disable-line
}

export function postEvent({name, start, end}) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const options = {
    body: JSON.stringify({name, start, end}),
    headers,
    method: 'POST'
  };
  return fetch('api/events', options)
    .catch(err => console.log(err)) // eslint-disable-line
    .then(fetchAllChannels);
}

export function deleteEvent({id}) {
  return fetch(`api/events/${id}`, {method: 'DELETE'})
    .catch(err => console.log(err)) // eslint-disable-line
    .then(fetchAllChannels);
}

export function connectEvents(channel, Child) {
  return class ConnectedChild extends React.Component {
    constructor() {
      super();
      this.state = {events: []};
      this.unsubscribeFromEvents = subscribeToEvents(channel, this.handleEventsUpdate.bind(this));
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
