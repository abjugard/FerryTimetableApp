import React, {useEffect, useState} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.scss';
import { faStopwatch, faCalendarAlt, faCog } from '@fortawesome/free-solid-svg-icons';

import {NextDeparture} from './components/NextDeparture';
import {FerryRouteSelector} from './components/FerryRouteSelector';
import {Timetable} from './components/Timetable';
import {NavBarItem} from './components/NavBarItem';

function App () {
  const [ferryRoute, setFerryRoute] = useState(
    localStorage.getItem('ferryRoute') || 'Kornhallsleden'
  );

  useEffect(() => {
    localStorage.setItem('ferryRoute', ferryRoute);
  }, [ferryRoute]);

  return (
    <div className="App">
      <div className="App-navbar">
        <ul>
          <NavBarItem
            route="/"
            label="Next departure"
            icon={faStopwatch}
          />
          <NavBarItem
            route="/timetable"
            label="Timetable"
            icon={faCalendarAlt}
          />
          <NavBarItem
            route="/settings"
            icon={faCog}
            end
          />
        </ul>
      </div>
      <header className="App-header">
        <Switch>
          <Route exact path="/">
            <NextDeparture ferryRoute={ferryRoute}/>
          </Route>
          <Route path="/timetable">
            <Timetable ferryRoute={ferryRoute}/>
          </Route>
          <Route path="/settings">
            <FerryRouteSelector
              ferryRoute={ferryRoute}
              onFerryRouteChanged={setFerryRoute}
            />
          </Route>
          <Route path="*">
            <Redirect to="/"/>
          </Route>
        </Switch>
      </header>
    </div>
  );
}

export default App;
