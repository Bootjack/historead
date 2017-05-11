import React from 'react';
import {render} from 'react-dom';

import EventList from 'components/event-list';
import EventCreateForm from 'components/event-create-form';
import EventQueryForm from 'components/event-query-form';
import SiteHeader from 'layout/site-header';

require('normalize.css');
require('styles/app');

const rootNode = document.getElementById('hst-root');

class Historead extends React.Component {
  state = {
    isEventCreateActive: false,
    isEventQueryActive: false
  }

  handleEventCreateClick = () => {
    this.setState({
      isEventCreateActive: !this.state.isEventCreateActive,
      isEventQueryActive: false
    });
  }

  handleEventQueryClick = () => {
    this.setState({
      isEventCreateActive: false,
      isEventQueryActive: !this.state.isEventQueryActive
    });
  }

  render() {
    const {isEventCreateActive, isEventQueryActive} = this.state;
    return (
      <div className="hst-app">
        <SiteHeader
          isEventCreateActive={isEventCreateActive}
          onEventCreateClick={this.handleEventCreateClick}
          isEventQueryActive={isEventQueryActive}
          onEventQueryClick={this.handleEventQueryClick}
        />
        {isEventCreateActive && <EventCreateForm/>}
        {isEventQueryActive && <EventQueryForm/>}
        <EventList/>
      </div>
    );
  }
}

render(<Historead />, rootNode);
