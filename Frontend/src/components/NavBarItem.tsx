import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';

interface Props {
  route: string;
  label?: string;
  icon?: IconDefinition;
  liClass?: string;
}

export const NavBarItem: React.FC<Props> = ({route, label, icon, liClass}) => {
  return (
    <li className={liClass}>
      <Link to={route}>
        <span>{label}</span>
        {icon != null && <FontAwesomeIcon icon={icon}/>}
      </Link>
    </li>
  );
}
