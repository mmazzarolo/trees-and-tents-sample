/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import { LinearGradient } from "expo";
import Touchable from "react-native-platform-touchable";
import Logo from "../components/Logo";
import Text from "../components/Text";
import Button from "../components/Button";
import metrics from "../config/metrics";

import type { Route } from "../types/Route";

type Props = {
  goToScreen: typeof routerActions.goToScreen
};

type State = {
  transitioningTo: ?Route
};

const SCREEN_FADE_IN_ANIM_DURATION = 600;
const SCREEN_FADE_OUT_ANIM_DURATION = 200;

const mapDispatchToProps = {
  goToScreen: routerActions.goToScreen
};

class Main extends React.Component<Props, State> {
  state = {
    transitioningTo: null
  };

  screenFadeAnimValue: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 1,
      duration: SCREEN_FADE_IN_ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  handleStartClick = async () => {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 0,
      duration: SCREEN_FADE_OUT_ANIM_DURATION,
      useNativeDriver: true
    }).start(() => this.props.goToScreen("GAME"));
  };

  render() {
    return (
      <Animated.View
        style={[styles.container, { opacity: this.screenFadeAnimValue }]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>easy</Text>
          <Touchable style={styles.stage}>
            <LinearGradient
              colors={["#30c9ad", "#30b9c9"]}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.stageGradient}
            >
              <Text style={styles.stageText}>6x6</Text>
            </LinearGradient>
          </Touchable>
          <Touchable style={styles.stage}>
            <LinearGradient
              colors={["#30c9ad", "#5493EA"]}
              style={styles.stageGradient}
              start={[0, 0]}
              end={[1, 0]}
            >
              <Text style={styles.stageText}>8x8</Text>
            </LinearGradient>
          </Touchable>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>hard</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.STATUS_BAR_HEIGHT,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  section: {
    width: "100%",
    padding: 20
  },
  sectionLabel: {
    color: "gray",
    fontSize: 20
  },
  stage: {
    // borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8
    // borderWidth: 2,
    // borderColor: "rgba(0,0,0,0.1)"
  },
  stageGradient: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  stageText: {
    color: "white",
    fontSize: 36,
    padding: 12
  }
});

export default connect(null, mapDispatchToProps)(Main);
