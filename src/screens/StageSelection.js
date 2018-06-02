/* @flow */
import * as React from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import * as gameActions from "../actions/gameActions";
import arrowRightImage from "../assets/images/arrow-right.png";
import Text from "../components/Text";
import Button from "../components/Button";

import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";

type Props = {
  setPuzzleInfo: typeof gameActions.setPuzzleInfo,
  goToScreen: typeof routerActions.goToScreen
};

const SCREEN_FADE_IN_ANIM_DURATION = 600;
const SCREEN_FADE_OUT_ANIM_DURATION = 200;

const mapDispatchToProps = {
  goToScreen: routerActions.goToScreen,
  setPuzzleInfo: gameActions.setPuzzleInfo
};

class Main extends React.Component<Props> {
  screenFadeAnimValue: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 1,
      duration: SCREEN_FADE_IN_ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  handleButtonPress = (difficulty: PuzzleDifficulty, size: PuzzleSize) => {
    this.props.setPuzzleInfo(difficulty, size);
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 0,
      duration: SCREEN_FADE_OUT_ANIM_DURATION,
      useNativeDriver: true
    }).start(() => this.props.goToScreen("GAME"));
  };

  renderButton = (
    difficulty: PuzzleDifficulty,
    size: PuzzleSize,
    backgroundColors: string[]
  ) => {
    return (
      <Button
        onPress={() => this.handleButtonPress(difficulty, size)}
        label={size}
        backgroundColors={backgroundColors}
        style={styles.button}
        textStyle={styles.buttonText}
        rightElement={
          <Image source={arrowRightImage} style={styles.buttonImage} />
        }
        height={60}
      />
    );
  };

  render() {
    return (
      <Animated.View
        style={[styles.container, { opacity: this.screenFadeAnimValue }]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>easy</Text>
          {this.renderButton("easy", "6x6", ["#30c9ad", "#30b9c9"])}
          {this.renderButton("easy", "8x8", ["#30b9c9", "#5493EA"])}
          {this.renderButton("easy", "10x10", ["#5493EA", "#4373E7"])}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>hard</Text>
          {this.renderButton("hard", "6x6", ["#FFDD75", "#FFBA6D"])}
          {this.renderButton("hard", "8x8", ["#FFBA6D", "#FE816D"])}
          {this.renderButton("hard", "10x10", ["#FE816D", "#EC6F86"])}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  section: {
    width: "100%",
    paddingHorizontal: 60
  },
  sectionLabel: {
    color: "gray",
    fontSize: 20
  },
  button: {},
  buttonText: {
    fontSize: 26
  },
  buttonImage: {
    height: 26,
    width: 26
  }
});

export default connect(null, mapDispatchToProps)(Main);
