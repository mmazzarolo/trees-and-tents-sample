/* @flow */
import * as React from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import Game from "./Game";
import StageSelection from "./StageSelection";
import Menu from "./Menu";
import Solved from "./Solved";
import metrics from "../config/metrics";

import type { Route } from "../types/Route";
import type { ReduxState } from "../types/ReduxState";

type Props = {
  currentRoute: Route
};

const mapStateToProps = (state: ReduxState) => ({
  currentRoute: state.router.currentRoute
});

class Router extends React.Component<Props> {
  renderRoute = () => {
    switch (this.props.currentRoute) {
      case "MENU":
        return <Menu />;
      case "GAME":
        return <Game />;
      case "STAGE_SELECTION":
        return <StageSelection />;
      case "SOLVED":
        return <Solved />;
      default:
        return null;
    }
  };

  render() {
    return <View style={styles.container}>{this.renderRoute()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.STATUS_BAR_HEIGHT
  }
});

export default connect(mapStateToProps)(Router);
