import React from 'react';
import {postEvent} from 'connectors/events';

require('styles/event-create-form');

export default class EventCreateForm extends React.Component {
  state = {
    enabled: false,
    name: '',
    start: '',
    end: ''
  }

  updateEnabledState = () => {
    this.setState({
      enabled: this.state.name !== '' && this.state.start !== ''
    });
  }

  handleNameChange = evt => {
    const nextName = evt.target.value;
    this.setState({
      enabled: nextName !== '' && this.state.start !== '',
      name: nextName
    });
  }

  handleStartChange = evt => {
    const nextStart = evt.target.value
    this.setState({
      enabled: this.state.name !== '' && nextStart !== '',
      start: nextStart
    });
  }

  handleEndChange = evt => {
    this.setState({end: evt.target.value});
  }

  handleSubmit = evt => {
    evt.preventDefault();
    postEvent(this.state);
  }

  render() {
    return (
      <form
        className="hst-secondary-header hst-event-create-form"
        onSubmit={this.handleSubmit}
      >
        <div className="fieldset">
          <label>Name
            <input
              className="hst-event-create-form-name"
              onChange={this.handleNameChange}
              value={this.state.name}
            />
          </label>
          {this.state.name &&
            <label>Start
              <input
                className="hst-event-create-form-start"
                onChange={this.handleStartChange}
                value={this.state.start}
              />
            </label>
          }
          {this.state.name &&
            <label>End
              <input
                className="hst-event-create-form-end"
                onChange={this.handleEndChange}
                value={this.state.end}
              />
            </label>
          }
        </div>
        <button disabled={!this.state.enabled} type="submit">Create</button>
      </form>
    );
  }
}
