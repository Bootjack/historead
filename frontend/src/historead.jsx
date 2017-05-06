import React from 'react';
import {render} from 'react-dom';

import EventList from 'components/event-list';
import SiteHeader from 'layout/site-header';

const events = [];

const rootNode = document.getElementById('hst-root');
function Historead() {
  return (
    <div className="hst-app">
      <SiteHeader/>
      <EventList events={events}/>
    </div>
  );
}

fetch('api/events/from/1800/to/1900')
  .then(res => res.json())
  .then(res => res.forEach(event => events.push(event)))
  .then(() => render(<Historead/>, rootNode))
  .catch(err => console.log(err)); //eslint-disable-line
