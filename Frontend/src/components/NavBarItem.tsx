import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';

class NavBarItemProps {
  public route!: string;
  public label?: string;
  public icon?: IconDefinition;
  public liClass?: string;
}

export default class NavBarItem extends React.Component<NavBarItemProps> {
  timerID!: NodeJS.Timeout;

  render() {
    const iconComponent = this.props.icon != null
      ? <FontAwesomeIcon icon={this.props.icon}/>
      : undefined;

    return (
      <li className={this.props.liClass}>
        <Link to={this.props.route}>
          <span>{this.props.label}</span>
          {iconComponent}
        </Link>
      </li>
    );
  }
}
