import React from 'react';
import TimeSpan from '../types/TimeSpan';

class TimeToDepartureProps {
  public timetableData!: Date[];
  public offset: number = 0;
  public approximateTime?: boolean = false;
}

class TimeToDepartureState {
  public targetDeparture?: Date;
  public timespan: TimeSpan = new TimeSpan(0);
}

export default class TimeToDeparture extends React.Component<TimeToDepartureProps, TimeToDepartureState> {
  timerID!: NodeJS.Timeout;

  constructor(props: TimeToDepartureProps) {
    super(props);
    this.state = new TimeToDepartureState();
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      100
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getDepartureTime(offset: number = 0, time: Date = new Date()) {
    const futureDepartures = this.props.timetableData
      .filter(departure => departure > time);

    return futureDepartures?.[offset];
  }

  tick() {
    const targetDeparture = this.getDepartureTime(this.props.offset);

    if (targetDeparture == null) {
      return;
    }

    this.setState({
      targetDeparture,
      timespan: TimeSpan.Subtract(targetDeparture, new Date())
    });
  }

  render() {
    return (
      <h3 title={this.state.targetDeparture?.toLocaleTimeString()}>{this.state.timespan.toString(this.props.approximateTime)}</h3>
    );
  }
}
