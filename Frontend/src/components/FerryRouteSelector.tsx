import React, { Dispatch, SetStateAction } from 'react';

import { fetchNames } from '../utilities/http';

export class RouteSelectorProps {
  public ferryRoute!: string;
  public onFerryRouteChanged!: Dispatch<SetStateAction<string>>;
}

class RouteSelectorState {
  public ferryRoutes: string[] = ['Kornhallsleden'];
}

export default class FerryRouteSelector extends React.Component<RouteSelectorProps, RouteSelectorState> {
  constructor(props: Readonly<RouteSelectorProps>) {
    super(props);
    this.state = new RouteSelectorState();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchFerryRouteNames();
  }

  fetchFerryRouteNames() {
    fetchNames()
      .then(ferryRoutes => this.setState({ ferryRoutes }));
  }

  handleChange(e: React.FormEvent<HTMLSelectElement>) {
    this.props.onFerryRouteChanged(e.currentTarget.value);
  }

  render() {
    const options = this.state.ferryRoutes.map(route =>
      <option value={route} key={route}>{route}</option>
    )

    return (
      <form className="route-selector">
        <label htmlFor="select">Select ferry route:</label>
        <br/>
        <select name="select" onChange={this.handleChange} value={this.props.ferryRoute}>
          {options}
        </select>
      </form>
    );
  }
}