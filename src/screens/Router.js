/* @flow */
import * as React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import Game from "./Game";
// import Splash from "./Splash";
import Main from "./Main";
// import Success from "./Success";
// import Stages from "./Stages";

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
      case "SPLASH":
        return <Main />;
      case "MAIN":
        return <Main />;
      case "GAME":
        return <Game />;
      case "STAGES":
        return <Main />;
      case "SUCCESS":
        return <Main />;
      default:
        return null;
    }
  };

  render() {
    return <View>{this.renderRoute()}</View>;
  }
}

export default connect(mapStateToProps)(Router);
