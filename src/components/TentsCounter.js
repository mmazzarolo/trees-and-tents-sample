/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import Text from "../components/Text";
import colors from "../config/colors";
import tentImage from "../assets/images/tent.png";

const ENTER_EXIT_ANIM_DURATION = 400;
const IMAGE_ANIM_DURATION = 200;

type Props = {
  counter: number,
  isVisible: boolean
};

class TentsCounter extends React.Component<Props> {
  enterExitAnimValue: Animated.Value = new Animated.Value(0);
  imageAnimValue: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.enterExitAnimValue, {
      toValue: 1,
      duration: ENTER_EXIT_ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  componentDidUpdate(prevProps: Props) {
    const didVisibilityChange = prevProps.isVisible !== this.props.isVisible;
    if (didVisibilityChange) {
      Animated.timing(this.enterExitAnimValue, {
        toValue: this.props.isVisible ? 1 : 0,
        duration: ENTER_EXIT_ANIM_DURATION,
        useNativeDriver: true
      }).start();
    }

    const didCounterUpdate = prevProps.counter !== this.props.counter;
    if (didCounterUpdate) {
      Animated.sequence([
        Animated.timing(this.imageAnimValue, {
          toValue: 1,
          duration: IMAGE_ANIM_DURATION / 2,
          useNativeDriver: true
        }),
        Animated.timing(this.imageAnimValue, {
          toValue: 0,
          duration: IMAGE_ANIM_DURATION / 2,
          useNativeDriver: true
        })
      ]).start();
    }
  }

  render() {
    const { counter } = this.props;
    const containerTransform = [
      {
        scale: this.enterExitAnimValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.01, 0, 1],
          extrapolate: "clamp"
        })
      }
    ];
    const imageTransform = [
      {
        scale: this.enterExitAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.3],
          extrapolate: "clamp"
        })
      }
    ];

    return (
      <Animated.View
        style={[styles.container, { transform: containerTransform }]}
      >
        <Animated.Image
          style={[styles.image, { transform: imageTransform }]}
          source={tentImage}
        />
        <Text style={styles.text}>{counter}</Text>
      </Animated.View>
    );
  }
}

export default TentsCounter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#6BC090",
    borderColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 0
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 20
  },
  text: {
    fontSize: 28,
    color: "white"
  }
});
