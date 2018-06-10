/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import * as gameActions from "../actions/gameActions";
import Logo from "../components/Logo";
import Button from "../components/Button";
import Text from "../components/Text";
import ElevatedView from "../components/ElevatedView";

import type { ReduxState } from "../types/ReduxState";

const SCREEN_FADE_IN_ANIM_DURATION = 600;
const SCREEN_FADE_OUT_ANIM_DURATION = 200;

type Props = {
  hasResumableGame: boolean,
  resumeCurrentGame: typeof gameActions.resumeCurrentGame,
  goToGameScreen: typeof routerActions.goToGameScreen,
  goToStageSelectionScreen: typeof routerActions.goToStageSelectionScreen
};

const mapDispatchToProps = {
  resumeCurrentGame: gameActions.resumeCurrentGame,
  goToGameScreen: routerActions.goToGameScreen,
  goToStageSelectionScreen: routerActions.goToStageSelectionScreen
};

const mapStateToProps = (state: ReduxState) => ({
  hasResumableGame: state.game.status === "PAUSED"
});

class Menu extends React.Component<Props> {
  screenFadeAnimValue: Animated.Value = new Animated.Value(0.01);

  componentDidMount() {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 1,
      duration: SCREEN_FADE_IN_ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  handleNewGamePress = () => {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 0,
      duration: SCREEN_FADE_OUT_ANIM_DURATION,
      useNativeDriver: true
    }).start(this.props.goToStageSelectionScreen);
  };

  handleResumePress = () => {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 0,
      duration: SCREEN_FADE_OUT_ANIM_DURATION,
      useNativeDriver: true
    }).start(() => {
      this.props.resumeCurrentGame();
      this.props.goToGameScreen();
    });
  };

  render() {
    const { hasResumableGame } = this.props;
    return (
      <Animated.View
        style={[styles.container, { opacity: this.screenFadeAnimValue }]}
      >
        <View style={styles.logo}>
          <Logo />
        </View>
        {!hasResumableGame && (
          <View style={styles.buttons}>
            <Button label="Play" onPress={this.handleNewGamePress} />
          </View>
        )}
        {hasResumableGame && (
          <View style={styles.buttons}>
            <Button
              style={styles.button}
              label="Resume"
              onPress={this.handleResumePress}
            />
            <Button
              style={styles.button}
              label="New game"
              onPress={this.handleNewGamePress}
            />
          </View>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  logo: {
    height: "50%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  buttons: {
    height: "50%",
    width: "70%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
  },
  button: {
    marginBottom: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
