import React from 'react';
import PropTypes from 'prop-types';
import {fetchEvents} from 'connectors/events';

export default class EventQueryForm extends React.Component {
  static propTypes = {
    channel: PropTypes.string,
    debounceRate: PropTypes.number,
    end: PropTypes.string,
    start: PropTypes.string
  }

  static defaultProps = {
    channel: 'main',
    debounceRate: 600
  }

  state = {
    start: '1900',
    end: '2000'
  }

  componentDidMount() {
    this.fetchEvents();
  }

  debouncedFetch = () => {
    clearTimeout(this.fetchTimeout);
    this.fetchTimeout = setTimeout(this.fetchEvents, this.props.debounceRate);
  }

  fetchEvents = () => {
    const {channel} = this.props;
    const {start, end} = this.state;
    fetchEvents(channel, {start, end})
  }

  handleEndChange = evt => {
    this.setState({end: evt.target.value});
    this.debouncedFetch();
  }

  handleStartChange = evt => {
    this.setState({start: evt.target.value});
    this.debouncedFetch();
  }

  render() {
    return (
      <form className="hst-secondary-header hst-event-query-form" onSubmit={this.handleSubmit}>
        <label>From
          <input onChange={this.handleStartChange} value={this.state.start}/>
        </label>
        <label>To
          <input onChange={this.handleEndChange} value={this.state.end}/>
        </label>
      </form>
    );

  }
}
