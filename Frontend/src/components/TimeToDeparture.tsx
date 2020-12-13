import React, {useEffect, useState} from 'react';
import TimeSpan from '../types/TimeSpan';

interface Props {
  timetableData: Date[];
  offset?: number;
  approximateTime?: boolean;
}

export const TimeToDeparture: React.FC<Props> = ({timetableData, offset = 0, approximateTime = false }) => {
  const [date, setDate] = useState(new Date())

  const tick = () => {
    setDate(new Date());
  }

  useEffect(() => {
    const timerID = setInterval(tick, 100 );
    return () => clearInterval(timerID);
  });

  const futureDepartures = timetableData
    .filter(departure => departure > date);

  const targetDeparture = futureDepartures?.[offset];
  const timespan = TimeSpan.Subtract(targetDeparture, date);

  return (
    <h3 title={targetDeparture?.toLocaleTimeString()}>{timespan.toString(approximateTime)}</h3>
  );
}
