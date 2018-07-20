/* @flow */
import * as React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../components/Text";
import colors from "../config/colors";
import ElevatedView from "./ElevatedView";

import type { ReactNativeViewStyle } from "../types/ReactNativeViewStyle";
import type { ReactNativeTextStyle } from "../types/ReactNativeTextStyle";

type Props = {
  label: string,
  leftElement?: React.Node,
  rightElement?: React.Node,
  onPress: any => mixed,
  style?: ReactNativeViewStyle,
  textStyle?: ReactNativeTextStyle,
  backgroundColor: string | string[],
  height: number,
  elevation: number,
  borderRadius: number,
  borderWidth: number
};

export default class extends React.PureComponent<Props> {
  static defaultProps = {
    backgroundColor: [colors.SHAMROCK, colors.SCOOTER],
    height: 40,
    elevation: 6,
    borderRadius: 4,
    borderWidth: 0
  };

  render() {
    const {
      label,
      leftElement,
      rightElement,
      style,
      textStyle,
      ...otherProps
    } = this.props;

    const hasElement = leftElement !== undefined || rightElement !== undefined;

    return (
      <View style={[styles.container, style]}>
        <ElevatedView {...otherProps}>
          <View
            style={[
              styles.content,
              { justifyContent: hasElement ? "space-between" : "center" }
            ]}
          >
            {leftElement}
            <Text style={[styles.text, textStyle]}>{label}</Text>
            {rightElement}
          </View>
        </ElevatedView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  content: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    color: "white"
  }
});
