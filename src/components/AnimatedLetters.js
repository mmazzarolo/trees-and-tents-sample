/* @flow */
import * as React from "react";
import { Animated, View, StyleSheet } from "react-native";
import times from "lodash/times";
import Text from "../components/Text";
import colors from "../config/colors";

const LETTER_ANIM_DURATION_DEFAULT = 100;

type Props = {
  initialDelay: number,
  duration: number,
  text: string
};

class AnimatedLetters extends React.PureComponent<Props> {
  static defaultProps = {
    initialDelay: 0,
    delay: 0,
    duration: LETTER_ANIM_DURATION_DEFAULT
  };

  get letters() {
    return this.props.text.split("");
  }

  get lettersLength() {
    return this.letters.length;
  }

  backgroundAnimValues: Animated.Value[] = times(
    this.lettersLength,
    () => new Animated.Value(0)
  );

  componentDidMount() {
    const { initialDelay, duration } = this.props;
    Animated.parallel([
      ...times(this.lettersLength, index => {
        return Animated.timing(this.backgroundAnimValues[index], {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
          delay: initialDelay + (index * duration - duration / 3)
        });
      })
    ]).start();
  }

  render() {
    const letterTransforms = times(this.lettersLength, index => {
      return [
        {
          scale: this.backgroundAnimValues[index].interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1.2, 1],
            extrapolate: "clamp"
          })
        }
      ];
    });
    return (
      <View style={styles.container}>
        {this.letters.map((letter, index) => (
          <Text
            key={`letter-${index}`}
            style={[styles.letter, { transform: letterTransforms[index] }]}
          >
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
    color: colors.SHAMROCK,
    fontSize: 52,
    textShadowColor: colors.TRANSPARENT_DARK_2,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  }
});

export default AnimatedLetters;
