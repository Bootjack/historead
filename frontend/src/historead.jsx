import React from 'react';
import {render} from 'react-dom';

import EventList from 'components/event-list';
import SiteHeader from 'layout/site-header';
import {fetchEvents} from 'connectors/events';

const rootNode = document.getElementById('hst-root');

function Historead() {
  return (
    <div className="hst-app">
      <SiteHeader/>
      <EventQueryForm/>
      <EventList/>
    </div>
  );
}

render(<Historead />, rootNode);
