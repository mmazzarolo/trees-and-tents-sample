/* @flow */
import * as React from "react";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import Button from "../components/Button";
import delay from "../utils/delay";

import type { Route } from "../types/Route";

type Props = {
  goToScreen: typeof routerActions.goToScreen
};

type State = {
  transitioningTo: ?Route
};

const mapDispatchToProps = {
  goToScreen: routerActions.goToScreen
};

class Success extends React.Component<Props, State> {
  state = {
    transitioningTo: null
  };

  handleMenuClick = async () => {
    this.setState({ transitioningTo: "MAIN" });
    await delay(500);
    this.props.goToScreen("MAIN");
  };

  handleNextClick = async () => {
    // TODO: Wire up to next puzzle
    this.setState({ transitioningTo: "MAIN" });
    await delay(500);
    this.props.goToScreen("MAIN");
  };

  render() {
    let containerClassName = "Success";
    if (this.state.transitioningTo) {
      containerClassName = `${containerClassName} Success-transitioning`;
    }
    return (
      <div className={containerClassName}>
        <div className="Success-title">
          <h1>
            <span>6</span>
            <span>x</span>
            <span>6</span>
            <span>-</span>
            <span>0</span>
            <span>1</span>
          </h1>
          <h1>
            <span>C</span>
            <span>O</span>
            <span>M</span>
            <span>P</span>
            <span>L</span>
            <span>E</span>
            <span>T</span>
            <span>E</span>
          </h1>
        </div>
        <div className="Success-buttons">
          <Button
            label="Menu"
            type="white"
            size="small"
            onClick={this.handleMenuClick}
          />
          <Button
            label="Next"
            type="white"
            size="small"
            onClick={this.handleNextClick}
          />
        </div>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Success);
