import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import styles from './FerryRouteSelector.module.scss';
import { fetchNames } from '../utilities/http';

interface Props {
  ferryRoute: string;
  onFerryRouteChanged: Dispatch<SetStateAction<string>>;
}

export const FerryRouteSelector: React.FC<Props> = ({ ferryRoute, onFerryRouteChanged }) => {
  const [ferryRoutes, setFerryRoutes] = useState(['Kornhallsleden'])

  const fetchFerryRouteNames = () => {
    fetchNames()
      .then(setFerryRoutes);
  }

  useEffect(fetchFerryRouteNames, []);

  const options = ferryRoutes.map(route =>
    <option value={route} key={route}>{route}</option>
  )

  return (
    <form>
      <h2>Select ferry route:</h2>
      <select className={styles.routeSelector}
              name="select"
              onChange={e => onFerryRouteChanged(e.currentTarget.value)} value={ferryRoute}>
        {options}
      </select>
    </form>
  );
}