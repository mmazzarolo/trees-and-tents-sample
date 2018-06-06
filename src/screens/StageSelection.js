/* @flow */
import * as React from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import * as gameActions from "../actions/gameActions";
import arrowRightImage from "../assets/images/arrow-right.png";
import arrowLeftImage from "../assets/images/arrow-left.png";
import metrics from "../config/metrics";
import Text from "../components/Text";
import Button from "../components/Button";

import type { PuzzleDifficulty } from "../types/PuzzleDifficulty";
import type { PuzzleSize } from "../types/PuzzleSize";

type Props = {
  startNewGame: typeof gameActions.startNewGame,
  goToMenuScreen: typeof routerActions.goToMenuScreen,
  goToGameScreen: typeof routerActions.goToGameScreen
};

const CONTAINER_ANIM_DURATION = 400;

const mapDispatchToProps = {
  goToMenuScreen: routerActions.goToMenuScreen,
  goToGameScreen: routerActions.goToGameScreen,
  startNewGame: gameActions.startNewGame
};

class StageSelection extends React.Component<Props> {
  containerAnimValue: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.containerAnimValue, {
      toValue: 1,
      duration: CONTAINER_ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  handleBackButtonPress = () => {
    Animated.timing(this.containerAnimValue, {
      toValue: 0,
      duration: CONTAINER_ANIM_DURATION,
      useNativeDriver: true
    }).start(this.props.goToMenuScreen);
  };

  handleButtonPress = (difficulty: PuzzleDifficulty, size: PuzzleSize) => {
    this.props.startNewGame(difficulty, size);
    Animated.timing(this.containerAnimValue, {
      toValue: 0,
      duration: CONTAINER_ANIM_DURATION,
      useNativeDriver: true
    }).start(this.props.goToGameScreen);
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
    const containerTransform = [
      {
        translateY: this.containerAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [metrics.SCREEN_HEIGHT, 0],
          extrapolate: "clamp"
        })
      }
    ];
    return (
      <Animated.View
        style={[styles.container, { transform: containerTransform }]}
      >
        <View style={styles.header}>
          <Button
            onPress={this.handleBackButtonPress}
            label={"Back"}
            backgroundColors={["#808080", "#808080"]}
            style={styles.headerButton}
            textStyle={styles.headerButtonText}
            leftElement={
              <Image source={arrowLeftImage} style={styles.headerButtonImage} />
            }
          />
          <Text style={styles.headerTitle} numberOfLines={2}>
            Select a puzzle
          </Text>
        </View>
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
    alignItems: "center",
    paddingHorizontal: 30
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  headerTitle: {
    fontSize: 26,
    color: "#666666"
  },
  headerButton: {
    width: "30%"
  },
  headerButtonText: {
    fontSize: 18
  },
  headerButtonImage: {
    width: 18,
    height: 18
  },
  section: {
    width: "100%"
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

export default connect(null, mapDispatchToProps)(StageSelection);
