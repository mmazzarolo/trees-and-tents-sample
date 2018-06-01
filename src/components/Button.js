/* @flow */
import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo";
import Touchable from "react-native-platform-touchable";
import Text from "../components/Text";
import colors from "../config/colors";

import type { ReactNativeViewStyle } from "../types/ReactNativeViewStyle";
import type { ReactNativeTextStyle } from "../types/ReactNativeTextStyle";

type Props = {
  onPress: any => mixed,
  label: string,
  colors?: string[],
  style?: ReactNativeViewStyle,
  gradientStyle?: ReactNativeViewStyle,
  textStyle?: ReactNativeTextStyle
};

export default class extends React.PureComponent<Props> {
  static defaultProps = {
    colors: [colors.PUERTO_RICO, colors.DULL_CYAN]
  };

  render() {
    const {
      onPress,
      label,
      colors,
      style,
      gradientStyle,
      textStyle
    } = this.props;

    return (
      <Touchable onPress={onPress} style={[styles.container, style]}>
        <LinearGradient
          style={[styles.gradient, gradientStyle]}
          colors={colors}
          start={[0, 0]}
          end={[1, 0]}
        >
          <Text style={[styles.text, textStyle]}>{label}</Text>
        </LinearGradient>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 4,
    overflow: "hidden"
  },
  gradient: {
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    paddingVertical: 2,
    borderColor: "rgba(0,0,0,0.1)"
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    color: "white"
  }
});
