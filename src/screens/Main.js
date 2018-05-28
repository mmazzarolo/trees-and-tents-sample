/* @flow */
import * as React from "react";
import { Image, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import Button from "../components/Button";
import delay from "../utils/delay";
import logoImage from "../assets/images/logo-transparent.png";
import backgroundImage from "../assets/images/title-background.png";
import metrics from "../config/metrics";

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

class Main extends React.Component<Props, State> {
  state = {
    transitioningTo: null
  };

  handleStartClick = async () => {
    this.setState({ transitioningTo: "GAME" });
    await delay(200);
    this.props.goToScreen("GAME");
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
        <Image source={logoImage} style={styles.logoImage} />
        <Button label="Start" onPress={this.handleStartClick} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  backgroundImage: {
    height: metrics.screenHeight / 3,
    width: "80%"
  },
  logoImage: {
    position: "absolute",
    height: metrics.screenHeight / 3,
    width: "80%",
    resizeMode: "contain"
  }
});

export default connect(null, mapDispatchToProps)(Main);
