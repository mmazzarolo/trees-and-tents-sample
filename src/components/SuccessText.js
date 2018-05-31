/* @flow */
import * as React from "react";
import { Animated, View, StyleSheet } from "react-native";
import times from "lodash/times";
import Text from "../components/Text";

const LETTER_ANIM_DURATION_DEFAULT = 100;

type Props = {
  delay?: number,
  duration?: number,
  title: string
};

class SuccessText extends React.PureComponent<Props> {
  static defaultProps = {
    delay: 0,
    duration: LETTER_ANIM_DURATION_DEFAULT
  };

  backgroundAnimValue: Animated.Value[] = new Array.from({
    length: this.props.title.length
  }).map(anim => new Animated.Value(0));

  componentDidMount() {
    const { delay, duration, title } = this.props;
    Animated.sequence([
      Animated.delay(delay),
      ...title.map((letter, index) =>
        Animated.timing(this.backgroundAnimValue[index], {
          toValue: 1,
          duration: duration,
          useNativeDriver: true
        })
      )
    ]).start();
  }

  render() {
    const letterTransforms = TEXT.map((letter, index) => [
      {
        scale: this.backgroundAnimValue[index].interpolate({
          inputRange: [0, 0.75, 1],
          outputRange: [0, 1.2, 1],
          extrapolate: "clamp"
        })
      }
    ]);
    return (
      <View style={styles.container}>
        {TEXT.map((letter, index) => (
          <Text style={[styles.letter, { transform: letterTransforms[index] }]}>
            {letter}
          </Text>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  letter: {
    color: "white",
    fontSize: 52
  }
});

export default SuccessText;
