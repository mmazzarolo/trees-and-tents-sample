/* @flow */
import React from "react";
import { StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

import type { Node } from "react";
import type { ReactNativeTextStyle } from "../types/ReactNativeTextStyle";

type Props = {
  children?: string | Node,
  style?: ReactNativeTextStyle
};

export default class Text extends React.PureComponent<Props> {
  textRef: ?any = null;

  getTextRef = () => this.textRef;

  render() {
    const { style, children, ...otherProps } = this.props;
    const fontFamily = "baloochettan-regular";
    return (
      <Animatable.Text
        ref={ref => {
          this.textRef = ref;
        }}
        style={[styles.text, style, { fontFamily }]}
        {...otherProps}
      >
        {children}
      </Animatable.Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {}
});
