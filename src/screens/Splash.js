/* @flow */
import * as React from "react";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";

type Props = {
  goToScreen: typeof routerActions.goToScreen
};

const mapDispatchToProps = {
  goToScreen: routerActions.goToScreen
};

class Splash extends React.Component<Props> {
  componentDidMount() {
    this.props.goToScreen("MAIN");
  }

  render() {
    return <div className="Splash" />;
  }
}

export default connect(null, mapDispatchToProps)(Splash);
