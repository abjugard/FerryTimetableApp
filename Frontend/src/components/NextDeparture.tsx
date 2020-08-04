import React from 'react';
import { fetchUpcoming } from '../utilities/http';
import TimeSpan from '../types/TimeSpan';

class NextDepartureState {
  public timespan: TimeSpan = new TimeSpan(0);
  public timetableData: Date[] = [];
}

class NextDepartureProps {
  public ferryRoute!: string;
}

export default class NextDeparture extends React.Component<NextDepartureProps, NextDepartureState> {
  timerID!: NodeJS.Timeout;

  constructor(props: any) {
    super(props);
    this.state = new NextDepartureState();
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    this.updateTimetableData();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    const now = new Date();
    const nextDeparture = this.nextDeparture(now);

    if (nextDeparture == null) {
      return;
    }

    this.setState({
      timespan: TimeSpan.Subtract(nextDeparture, now)
    });
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

  render() {
    const next = this.nextDeparture();

    return (
      <div>
        <h1>Next departure in:</h1>
        <h3 title={next?.toLocaleTimeString()}>{this.state.timespan.toString()}</h3>
      </div>
    );
  }
}
