/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import Text from "../components/Text";
import colors from "../config/colors";

const SPAWN_ANIM_DURATION = 200;
const SPAWN_ANIM_DELAY = 200;

type Props = {
  width: number,
  height: number,
  numberOfTents: ?number,
  isValid: ?boolean,
  isFilled: ?boolean,
  isVisible: ?boolean
};

type State = {
  spawnAnimValue: Animated.Value
};

class Digit extends React.Component<Props, State> {
  static defaultProps = {
    numberOfTents: null,
    isValid: true,
    isFilled: false,
    isVisible: false
  };

  state = {
    spawnAnimValue: new Animated.Value(0),
    backgroundAnimValue: new Animated.Value(0),
    tentImageAnimValue: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.sequence([
      Animated.delay(SPAWN_ANIM_DELAY),
      Animated.timing(this.state.spawnAnimValue, {
        toValue: 1,
        duration: SPAWN_ANIM_DURATION,
        useNativeDriver: true
      })
    ]).start();
  }

  shouldComponentUpdate(prevProps: Props) {
    const didValidChange = prevProps.isValid !== this.props.isValid;
    const didFilledChange = prevProps.isFilled !== this.props.isFilled;
    if (didValidChange || didFilledChange) {
      return true;
    }
    return false;
  }

  render() {
    const {
      width,
      height,
      numberOfTents,
      isValid,
      isFilled,
      isVisible
    } = this.props;
    const { spawnAnimValue } = this.state;
    let color;
    if (!isValid) {
      color = colors.BRINK_PINK;
    } else if (isFilled) {
      color = colors.MERCURY;
    } else {
      color = colors.TIN;
    }
    return (
      <Animated.View
        style={[styles.container, { width, height, opacity: spawnAnimValue }]}
      >
        {isVisible && (
          <Text style={[styles.text, { color }]}>
            {numberOfTents !== null && numberOfTents !== undefined
              ? numberOfTents
              : ""}
          </Text>
        )}
      </Animated.View>
    );
  }
}

export default Digit;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
});
