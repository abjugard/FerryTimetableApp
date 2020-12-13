import React from 'react';
import styles from './NavBarItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';

interface Props {
  route: string;
  label?: string;
  icon?: IconDefinition;
  end?: boolean
}

export const NavBarItem: React.FC<Props> = ({route, label, icon, end = false}) => {
  const classes = [styles.navbarItem];

  if (end) {
    classes.push(styles.end)
  }

  return (
    <li className={classes.join(' ')}>
      <Link to={route}>
        <span>{label}</span>
        {icon != null && <FontAwesomeIcon icon={icon}/>}
      </Link>
    </li>
  );
}
