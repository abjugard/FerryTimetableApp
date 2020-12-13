import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styles from './NextDeparture.module.scss';
import { fetchUpcoming } from '../utilities/http';
import {TimeToDeparture} from './TimeToDeparture';
import TimeSpan from '../types/TimeSpan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
  ferryRoute: string;
}

export const NextDeparture: React.FC<Props> = ({ferryRoute}) => {
  const [date, setDate] = useState(new Date())
  const [timetableData, setTimetableData] = useState<Date[]>([]);
  const [additionalDepartures, setAdditionalDepartures] = useState(0);

  const tick = () => {
    setDate(new Date());
  }

  useEffect(() => {
    fetchUpcoming(ferryRoute)
      .then(setTimetableData)
      .then(tick);
  }, [ferryRoute])

  useEffect(() => {
    const timerID = setInterval(tick, 100 );
    return () => clearInterval(timerID);
  });

  const nextDeparture = useCallback((now: Date = new Date()) => {
    const futureDepartures = timetableData
      .filter(departure => departure > now);

    return futureDepartures?.[0];
  }, [timetableData])

  const addDeparture = useCallback(() => {
    setAdditionalDepartures(additionalDepartures + 1)
  }, [additionalDepartures])

  useMemo(() => {
    const next = nextDeparture();
    if (next == null) {
      return;
    }

    const ts = TimeSpan.Subtract(next, date)
    if (additionalDepartures < 1 && ts.minutes < 10) {
      addDeparture();
    }
  }, [nextDeparture, addDeparture, additionalDepartures, date])

  const additionalDeparturesComp = Array.from(Array(additionalDepartures).keys())
    .map(i => <TimeToDeparture key={`additional-${i+1}`} timetableData={timetableData} offset={i+1} approximateTime={true}/>);

  return (
    <>
      <h1 className={styles.title}>Next departure in:</h1>
      <div className={styles.timers}>
        <TimeToDeparture timetableData={timetableData} offset={0}/>
        {additionalDeparturesComp}
      </div>
      <button className={styles.addDeparture} onClick={_ => addDeparture()} disabled={additionalDepartures === 4}>
        <FontAwesomeIcon icon={faPlus}/>
      </button>
    </>
  );
}
