/* @flow */
import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo";
import Touchable from "react-native-platform-touchable";
import Text from "../components/Text";

import type { ReactNativeViewStyle } from "../types/ReactNativeViewStyle";
import type { ReactNativeTextStyle } from "../types/ReactNativeTextStyle";

type Props = {
  onPress: any => mixed,
  label: string,
  style?: ReactNativeViewStyle,
  textStyle?: ReactNativeTextStyle
};

export default class extends React.PureComponent<Props> {
  render() {
    const { onPress, label, style, textStyle, ...otherProps } = this.props;

    return (
      <Touchable onPress={onPress} style={styles.container}>
        <LinearGradient colors={["#30c9ad", "#30b9c9"]} style={styles.gradient}>
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
  gradient: {},
  text: {
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
    color: "white"
  }
});
