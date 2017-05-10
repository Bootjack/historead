import React from 'react';
import {render} from 'react-dom';

import EventList from 'components/event-list';
import EventQueryForm from 'components/event-query-form';
import SiteHeader from 'layout/site-header';

require('normalize.css');
require('styles/generic');
require('styles/app');
require('styles/headings');

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
