/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as routerActions from "../actions/routerActions";
import Logo from "../components/Logo";
import Button from "../components/Button";

type Props = {
  goToStageSelectionScreen: typeof routerActions.goToStageSelectionScreen
};

const SCREEN_FADE_IN_ANIM_DURATION = 600;
const SCREEN_FADE_OUT_ANIM_DURATION = 200;

const mapDispatchToProps = {
  goToStageSelectionScreen: routerActions.goToStageSelectionScreen
};

class Menu extends React.Component<Props> {
  screenFadeAnimValue: Animated.Value = new Animated.Value(0.01);

  componentDidMount() {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 1,
      duration: SCREEN_FADE_IN_ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  handleStartClick = async () => {
    Animated.timing(this.screenFadeAnimValue, {
      toValue: 0,
      duration: SCREEN_FADE_OUT_ANIM_DURATION,
      useNativeDriver: true
    }).start(this.props.goToStageSelectionScreen);
  };

  render() {
    return (
      <Animated.View
        style={[styles.container, { opacity: this.screenFadeAnimValue }]}
      >
        <View style={styles.logo}>
          <Logo />
        </View>
        <View style={styles.buttons}>
          <Button label="Play" onPress={this.handleStartClick} />
        </View>
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
  }
});

export default connect(null, mapDispatchToProps)(Menu);
