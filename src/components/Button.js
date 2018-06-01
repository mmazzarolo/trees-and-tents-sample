/* @flow */
import React from "react";
import {
  LayoutAnimation,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { LinearGradient } from "expo";
import Text from "../components/Text";
import getDifferentLuminance from "../utils/getDifferentLuminance";
import colors from "../config/colors";

import type { ReactNativeViewStyle } from "../types/ReactNativeViewStyle";
import type { ReactNativeTextStyle } from "../types/ReactNativeTextStyle";

const SHADOW_HEIGHT = 6;
const BUTTON_HEIGHT = 40;
const LAYOUT_ANIM_DURATION = 40;
const CUSTOM_LAYOUT_ANIMATION = {
  duration: LAYOUT_ANIM_DURATION,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  },
  delete: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  }
};

type Props = {
  onPress: any => mixed,
  label: string,
  backgroundColors: string[],
  style?: ReactNativeViewStyle,
  textStyle?: ReactNativeTextStyle
};

type State = {
  isTouched: boolean
};

export default class extends React.PureComponent<Props, State> {
  static defaultProps = {
    backgroundColors: [colors.PUERTO_RICO, colors.DULL_CYAN]
  };

  state = {
    isTouched: false
  };

  get darkerBackgroundColors() {
    return this.props.backgroundColors.map(x => getDifferentLuminance(x, -0.2));
  }

  handlePressIn = () => {
    LayoutAnimation.configureNext(CUSTOM_LAYOUT_ANIMATION);
    this.setState({ isTouched: true });
  };

  handlePressOut = () => {
    LayoutAnimation.configureNext(CUSTOM_LAYOUT_ANIMATION);
    this.setState({ isTouched: false });
    this.props.onPress();
  };

  render() {
    const { label, backgroundColors, style, textStyle } = this.props;

    const surfaceMarginTop = this.state.isTouched ? SHADOW_HEIGHT : 2;
    const borderColor = getDifferentLuminance(backgroundColors[0], -0.3);

    return (
      <TouchableWithoutFeedback
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
        delayPressIn={0}
      >
        <View style={[styles.container, style]}>
          <LinearGradient
            style={[
              styles.surface,
              { marginTop: surfaceMarginTop, borderColor }
            ]}
            colors={backgroundColors}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={[styles.text, textStyle]}>{label}</Text>
          </LinearGradient>
          <LinearGradient
            style={[styles.shadow, { borderColor }]}
            colors={this.darkerBackgroundColors}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={[styles.text, textStyle]}>{label}</Text>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 4,
    height: BUTTON_HEIGHT + SHADOW_HEIGHT
  },
  surface: {
    width: "100%",
    borderRadius: 4,
    height: BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 2
  },
  shadow: {
    height: BUTTON_HEIGHT,
    marginTop: SHADOW_HEIGHT,
    width: "100%",
    position: "absolute",
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 1
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    color: "white"
  }
});
