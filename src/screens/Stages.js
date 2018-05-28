/* @flow */
import * as React from "react";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import Button from "../components/Button";
import delay from "../utils/delay";
import puzzles from "../config/puzzles";

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

class Stages extends React.Component<Props, State> {
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
    this.setState({ transitioningTo: "GAME" });
    await delay(500);
    this.props.goToScreen("GAME");
  };

  render() {
    let containerClassName = "Stages";
    if (this.state.transitioningTo) {
      containerClassName = `${containerClassName} Stages-transitioning`;
    }
    return (
      <div className={containerClassName}>
        <div className="Stages-buttons">
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

export default connect(null, mapDispatchToProps)(Stages);
