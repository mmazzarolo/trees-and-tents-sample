/* @flow */
import * as React from "react";
import { Animated, Image, View, StyleSheet } from "react-native";
import metrics from "../config/metrics";
import logoImage from "../assets/images/logo-transparent.png";
import backgroundImage from "../assets/images/title-background.png";

const BACKGROUND_ANIM_DURATION = 10000;

class Logo extends React.PureComponent<{}> {
  backgroundAnimValue: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.backgroundAnimValue, {
          toValue: 1,
          duration: BACKGROUND_ANIM_DURATION,
          useNativeDriver: true
        }),
        Animated.timing(this.backgroundAnimValue, {
          toValue: 0,
          duration: BACKGROUND_ANIM_DURATION,
          useNativeDriver: true
        })
      ])
    ).start();
  }

  render() {
    const backgroundTransform = [
      {
        translateX: this.backgroundAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -metrics.LOGO_SIZE],
          extrapolate: "clamp"
        })
      }
    ];
    return (
      <View style={styles.container}>
        <Animated.Image
          source={backgroundImage}
          style={[styles.backgroundImage, { transform: backgroundTransform }]}
        />
        <Image source={logoImage} style={styles.titleImage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: metrics.LOGO_SIZE,
    width: metrics.LOGO_SIZE,
    overflow: "hidden",
    zIndex: 2
  },
  backgroundImage: {
    height: "100%",
    width: "200%",
    resizeMode: "cover"
  },
  titleImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 2
  }
});

export default Logo;
