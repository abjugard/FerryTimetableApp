import React, {useEffect, useState} from 'react';
import {fetchDaySchedule, fetchValidity} from '../utilities/http';
import {TimetableValidity} from '../types/TimetableValidity';

const PaddedNumber: React.FC<{ number: number, strong: boolean }> = ({number, strong}) =>
  <span className={strong ? 'strong' : undefined}>{ number.toString().padStart(2, '0') }</span>

const HourComponent: React.FC<{ hour: number, minutes: number[], next?: Date }> = ({hour, minutes, next }) => {
  const isCurrent = (minute: number) => hour === next?.getHours() && minute === next.getMinutes();
  const minuteComponents = minutes
    .sort()
    .map(minute => <PaddedNumber key={minute} number={minute} strong={isCurrent(minute)} />)

  return <tr key={hour}>
    <td className="hour"><PaddedNumber number={hour} strong={hour === next?.getHours()} /></td>
    <td className="minute"><div>{minuteComponents}</div></td>
  </tr>
};

interface Props {
  ferryRoute: string;
}

export const Timetable: React.FC<Props> = ({ ferryRoute }) => {
  const [date, setDate] = useState(new Date())
  const [timetableData, setTimetableData] = useState<Date[]>([]);
  const [validity, setValidity] = useState<TimetableValidity>(new TimetableValidity());

  useEffect(() => {
    fetchValidity(ferryRoute, date)
      .then(setValidity);

    fetchDaySchedule(ferryRoute, date)
      .then(setTimetableData);
  }, [ferryRoute, date])

  const selectDate = (date: Date | null) => {
    if (date == null) {
      throw Error('Invalid date selected!');
    }

    if (date < validity.from) {
      date = validity.from;
    }
    if (date > validity.to) {
      date = validity.to;
    }

    setDate(date);
  }

  const nextDeparture = (now: Date = new Date()) => {
    const futureDepartures = timetableData
      .filter(departure => departure > now);

    return futureDepartures?.[0];
  }

  const formatDate = (d: Date) => {
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  const generateTable = () => {
    const table: Map<number, number[]> = new Map();

    timetableData.reduce(
      (acc, date) => {
        const hour = date.getHours();
        const minute = date.getMinutes();
        if (!acc.has(hour)) {
          acc.set(hour, [minute]);
        }
        else {
          const departures = acc.get(hour);
          if (!departures?.includes(minute)) {
            departures?.push(minute);
          }
        }

        return acc;
      },
      table
    );

    const next = date.getUTCDate() === new Date().getUTCDate()
      ? nextDeparture()
      : undefined;

    return Array.from(table.entries())
      .map(([hour, minutes]) => <HourComponent key={hour} hour={hour} minutes={minutes} next={next} />);
  }

  return (
    <div>
      <div>
        <input type="date"
          value={formatDate(date)}
          onChange={e => selectDate(new Date(e.currentTarget.value))}
          min={formatDate(validity.from)}
          max={formatDate(validity.to)}
        />
      </div>
      <div>
        <table className="timetable">
          <thead>
            <tr>
              <th className="hour">Hour</th>
              <th className="minute">Departures</th>
            </tr>
          </thead>
          <tbody>
            {generateTable()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
