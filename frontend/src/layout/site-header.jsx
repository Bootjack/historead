import React from 'react';
import PropTypes from 'prop-types'

export default function SiteHeader(props) {
  const createClasses = ['hst-site-menu-item', 'icon-plus'];
  const searchClasses = ['hst-site-menu-item', 'icon-search'];

  if (props.isEventCreateActive) {
    createClasses.push('hst-site-menu-item--active');
  }

  if (props.isEventQueryActive) {
    searchClasses.push('hst-site-menu-item--active');
  }

  return (
    <div className="hst-site-header">
      <h1>Historied</h1>
      <div className="hst-site-menu">
        <i className={searchClasses.join(' ')} onClick={props.onEventQueryClick}/>
        <i className={createClasses.join(' ')} onClick={props.onEventCreateClick}/>
      </div>
    </div>
  );
}

SiteHeader.propTypes = {
  isEventCreateActive: PropTypes.bool,
  onEventCreateClick: PropTypes.func,
  isEventQueryActive: PropTypes.bool,
  onEventQueryClick: PropTypes.func
};

SiteHeader.defaultProps = {
  onEventCreateClick() {},
  onEventQueryClick() {}
};
