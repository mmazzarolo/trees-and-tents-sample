/* @flow */
import * as React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo";

import type { ReactNativeViewStyle } from "../types/ReactNativeViewStyle";

type Props = {
  backgroundColor: string | string[],
  style: ?ReactNativeViewStyle
};

class GradientView extends React.PureComponent<Props> {
  render() {
    const { backgroundColor, style, ...otherProps } = this.props;

    const showGradient =
      Array.isArray(backgroundColor) && backgroundColor.length > 1;

    return showGradient ? (
      <LinearGradient
        colors={backgroundColor}
        start={[0, 0]}
        end={[1, 0]}
        style={style}
        {...otherProps}
      />
    ) : (
      <View style={[{ backgroundColor }, style]} {...otherProps} />
    );
  }
}

export default GradientView;
