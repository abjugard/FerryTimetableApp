import React from 'react';
import { fetchValidity, fetchDaySchedule } from '../utilities/http';
import { TimetableValidity } from '../types/TimetableValidity';

class TimetableState {
  public date: Date = new Date();
  public timetableData: Date[] = [];
  public validity: TimetableValidity = new TimetableValidity();
}

class TimetableProps {
  public ferryRoute!: string;
}

const paddedNumberComponent = (number: number, strong: boolean) =>
  <span key={number} className={strong ? 'strong' : undefined}>{ number.toString().padStart(2, '0') }</span>

const hourComponent = (hour: number, minutes: number[], next?: Date) => {
  const minuteComponents = minutes
    .sort()
    .map(minute =>
      paddedNumberComponent(minute, hour === next?.getHours() && minute === next.getMinutes())
    )

  return <tr key={hour}>
    <td className="hour">{paddedNumberComponent(hour, hour === next?.getHours())}</td>
    <td className="minute"><div>{minuteComponents}</div></td>
  </tr>
};

export default class Timetable extends React.Component<TimetableProps, TimetableState> {
  constructor(props: any) {
    super(props);
    this.state = new TimetableState();
  }

  componentDidMount() {
    this.updateTimetableData();
    this.updateValidityData();
  }

  updateTimetableData() {
    fetchDaySchedule(this.props.ferryRoute, this.state.date)
      .then(timetableData => this.setState({ timetableData }));
  }

  updateValidityData() {
    fetchValidity(this.props.ferryRoute, this.state.date)
      .then(validity => this.setState({ validity }));
  }

  selectDate(date: Date | null) {
    if (date == null) {
      throw Error('Invalid date selected!');
    }

    if (date < this.state.validity.from) {
      date = this.state.validity.from;
    }
    if (date > this.state.validity.to) {
      date = this.state.validity.to;
    }
    this.setState({ date }, this.updateTimetableData);
  }

  nextDeparture(now: Date = new Date()) {
    const futureDepartures = this.state.timetableData
      .filter(departure => departure > now);

    return futureDepartures?.[0];
  }

  formatDate(d: Date) {
    var month = (d.getMonth() + 1).toString();
    var day = d.getDate().toString();
    var year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
}

  render() {
    const tableData = this.generateTable();

    const stringDate = this.formatDate(this.state.date);

    const minDate = this.formatDate(this.state.validity.from);
    const maxDate = this.formatDate(this.state.validity.to);

    return (
      <div>
        <div>
          <input type="date"
            value={stringDate}
            onChange={date => this.selectDate(new Date(date.currentTarget.value))}
            min={minDate} max={maxDate}
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
              {tableData}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  generateTable() {
    const table: Map<number, number[]> = new Map();

    this.state.timetableData.reduce(
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

    const nextDeparture = this.state.date.getUTCDate() === new Date().getUTCDate()
      ? this.nextDeparture()
      : undefined;

    const tableData = Array.from(table.entries())
      .map(([hour, minutes]) => hourComponent(hour, minutes, nextDeparture));
    return tableData;
  }
}
