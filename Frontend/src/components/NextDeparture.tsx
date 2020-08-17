import React from 'react';
import { fetchUpcoming } from '../utilities/http';
import TimeToDeparture from './TimeToDeparture';
import TimeSpan from '../types/TimeSpan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class NextDepartureProps {
  public ferryRoute!: string;
}

class NextDepartureState {
  public timetableData: Date[] = [];
  public additionalDepartures: number = 0;
}

export default class NextDeparture extends React.Component<NextDepartureProps, NextDepartureState> {
  timerID!: NodeJS.Timeout;

  constructor(props: any) {
    super(props);
    this.state = new NextDepartureState();
  }

  componentDidMount() {
    this.updateTimetableData();
    this.timerID = setInterval(
      () => this.tick(),
      100
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    if (this.state.additionalDepartures < 1) {
      const next = this.nextDeparture();
      const ts = TimeSpan.Subtract(next, new Date())
      if (ts.minutes < 10) {
        this.addDeparture();
      }
    }
  }

  updateTimetableData() {
    fetchUpcoming(this.props.ferryRoute)
      .then(timetableData => this.setState({ timetableData }))
      .then(() => this.tick());
  }

  nextDeparture(now: Date = new Date()) {
    const futureDepartures = this.state.timetableData
      .filter(departure => departure > now);

    return futureDepartures?.[0];
  }

  addDeparture() {
    const additionalDepartures = this.state.additionalDepartures + 1;
    this.setState({ additionalDepartures });
  }

  render() {
    const additionalDepartures = Array.from(Array(this.state.additionalDepartures).keys())
      .map(i => <TimeToDeparture key={`additional-${i+1}`} timetableData={this.state.timetableData} offset={i+1} approximateTime={true}/>);

    return (
      <div className="next-departure">
        <h1>Next departure in:</h1>
        <TimeToDeparture timetableData={this.state.timetableData} offset={0}/>
        {additionalDepartures}
        <button onClick={_ => this.addDeparture()} disabled={this.state.additionalDepartures === 4}>
          <FontAwesomeIcon icon={faPlus}/>
        </button>
      </div>
    );
  }
}
