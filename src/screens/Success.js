/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import AnimatedLetters from "../components/AnimatedLetters";
import Button from "../components/Button";
import delay from "../utils/delay";
import colors from "../config/colors";
import metrics from "../config/metrics";

import type { Route } from "../types/Route";

const ENTER_ANIM_DURATION = 200;
const TITLE_LETTER_ANIM_DURATION = 120;

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
  backgroundAnimValue: Animated.Value = new Animated.Value(0);

  state = {
    transitioningTo: null
  };

  componentDidMount() {
    Animated.timing(this.backgroundAnimValue, {
      toValue: 1,
      duration: ENTER_ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  render() {
    const containerTransform = [
      {
        translateX: this.backgroundAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [metrics.SCREEN_WIDTH, 0],
          extrapolate: "clamp"
        })
      }
    ];
    return (
      <Animated.View
        style={[styles.container, { transform: containerTransform }]}
      >
        <View style={styles.title}>
          <AnimatedLetters
            duration={TITLE_LETTER_ANIM_DURATION}
            initialDelay={ENTER_ANIM_DURATION * 2}
            text="SUCCESS"
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: colors.FRINGY_FLOWER_2,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {}
});

export default connect(null, mapDispatchToProps)(Success);
