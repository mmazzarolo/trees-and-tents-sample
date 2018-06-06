/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as gameActions from "../actions/gameActions";
import * as routerActions from "../actions/routerActions";
import AnimatedLetters from "../components/AnimatedLetters";
import Button from "../components/Button";
import colors from "../config/colors";
import metrics from "../config/metrics";

const ENTER_ANIM_DURATION = 200;
const TITLE_LETTER_ANIM_DURATION = 80;
const BUTTON_ANIM_DURATION = 200;

type Props = {
  startNewGameWithCurrentSettings: typeof gameActions.startNewGameWithCurrentSettings,
  goToMenuScreen: typeof routerActions.goToMenuScreen,
  goToGameScreen: typeof routerActions.goToGameScreen
};

const mapDispatchToProps = {
  startNewGameWithCurrentSettings: gameActions.startNewGameWithCurrentSettings,
  goToMenuScreen: routerActions.goToMenuScreen,
  goToGameScreen: routerActions.goToGameScreen
};

class Solved extends React.Component<Props> {
  backgroundAnimValue: Animated.Value = new Animated.Value(-1);
  leftButtonAnimValue: Animated.Value = new Animated.Value(0);
  rightButtonAnimValue: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.backgroundAnimValue, {
        toValue: 0,
        duration: ENTER_ANIM_DURATION,
        useNativeDriver: true
      }),
      Animated.delay(TITLE_LETTER_ANIM_DURATION * 10),
      Animated.timing(this.leftButtonAnimValue, {
        toValue: 1,
        duration: BUTTON_ANIM_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(this.rightButtonAnimValue, {
        toValue: 1,
        duration: BUTTON_ANIM_DURATION,
        useNativeDriver: true
      })
    ]).start();
  }

  handleMenuButtonPress = () => {
    Animated.timing(this.backgroundAnimValue, {
      toValue: 1,
      duration: ENTER_ANIM_DURATION,
      useNativeDriver: true
    }).start(this.props.goToMenuScreen);
  };

  handleNewPuzzlePress = () => {
    this.props.startNewGameWithCurrentSettings();
    Animated.timing(this.backgroundAnimValue, {
      toValue: 1,
      duration: ENTER_ANIM_DURATION,
      useNativeDriver: true
    }).start(this.props.goToGameScreen);
  };

  render() {
    const containerTransform = [
      {
        translateX: this.backgroundAnimValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [metrics.SCREEN_WIDTH, 0, -metrics.SCREEN_WIDTH],
          extrapolate: "clamp"
        })
      }
    ];
    const leftButtonTransform = [{ scale: this.leftButtonAnimValue }];
    const rightButtonTransform = [{ scale: this.rightButtonAnimValue }];
    return (
      <Animated.View
        style={[styles.container, { transform: containerTransform }]}
      >
        <View style={styles.title}>
          <AnimatedLetters
            duration={TITLE_LETTER_ANIM_DURATION}
            initialDelay={ENTER_ANIM_DURATION * 2}
            text="COMPLETE"
          />
        </View>
        <View style={styles.buttons}>
          <Animated.View
            style={[styles.buttonWrapper, { transform: leftButtonTransform }]}
          >
            <Button
              label="MENU"
              backgroundColors={["#fff", "#FFF"]}
              onPress={this.handleMenuButtonPress}
              textStyle={styles.menuButtonTextStyle}
            />
          </Animated.View>
          <Animated.View
            style={[styles.buttonWrapper, { transform: rightButtonTransform }]}
          >
            <Button
              label="NEW PUZZLE"
              backgroundColors={["#fff", "#FFF"]}
              onPress={this.handleNewPuzzlePress}
              textStyle={styles.menuButtonTextStyle}
            />
          </Animated.View>
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
    padding: 20
  },
  title: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonWrapper: {
    width: "40%"
  },
  menuButtonTextStyle: {
    fontSize: 18,
    color: "#A3A7B0"
  }
});

export default connect(null, mapDispatchToProps)(Solved);
