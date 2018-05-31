/* @flow */
import * as React from "react";
import { Animated, Image, View, StyleSheet } from "react-native";
import logoImage from "../assets/images/logo-transparent.png";
import backgroundImage from "../assets/images/title-background.png";

const BACKGROUND_ANIM_DURATION = 4000;

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
          outputRange: [-30, 0],
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
    height: "100%",
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 2
  },
  backgroundImage: {
    height: "120%",
    width: "120%",
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
