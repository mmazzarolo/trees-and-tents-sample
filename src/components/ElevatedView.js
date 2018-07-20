/* @flow */
import * as React from "react";
import {
  LayoutAnimation,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import GradientView from "../components/GradientView";
import getDifferentLuminance from "../utils/getDifferentLuminance";
import delay from "../utils/delay";

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
  children: React.Node,
  onPress: any => mixed,
  backgroundColor: string | string[],
  height: number,
  width: number | string,
  elevation: number,
  borderRadius: number,
  borderWidth: number,
  isElevated?: boolean,
  disabled?: boolean
};

type State = {
  isTouched: boolean
};

class ElevatedView extends React.PureComponent<Props, State> {
  static defaultProps = {
    width: "100%",
    isElevated: true,
    disabled: false
  };

  state = {
    isTouched: false
  };

  get elevationBackgroundColor() {
    const { backgroundColor, isElevated } = this.props;
    if (!isElevated) {
      return backgroundColor;
    }

    const luminance = -0.2;

    return Array.isArray(backgroundColor)
      ? backgroundColor.map(x => getDifferentLuminance(x, luminance))
      : getDifferentLuminance(backgroundColor, luminance);
  }

  get borderColor() {
    const { backgroundColor } = this.props;
    const luminance = -0.3;
    return Array.isArray(backgroundColor)
      ? getDifferentLuminance(backgroundColor[0], luminance)
      : getDifferentLuminance(backgroundColor, luminance);
  }

  handlePressIn = () => {
    LayoutAnimation.configureNext(CUSTOM_LAYOUT_ANIMATION);
    this.setState({ isTouched: true });
  };

  handlePressOut = () => {
    LayoutAnimation.configureNext(CUSTOM_LAYOUT_ANIMATION);
    this.setState({ isTouched: false });
  };

  simulatePress = async () => {
    this.setState({ isTouched: true });
    await delay(10); // TODO: Why does this work?
    LayoutAnimation.configureNext(CUSTOM_LAYOUT_ANIMATION);
    this.setState({ isTouched: false });
  };

  render() {
    const {
      children,
      backgroundColor,
      height,
      width,
      elevation,
      onPress,
      borderWidth,
      borderRadius,
      disabled
    } = this.props;

    return (
      <TouchableWithoutFeedback
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
        onPress={onPress}
        delayPressIn={0}
        disabled={disabled}
      >
        <View
          style={[
            styles.container,
            { height: height + elevation, borderRadius, width }
          ]}
        >
          <GradientView
            backgroundColor={backgroundColor}
            style={[
              styles.surface,
              {
                marginTop: this.state.isTouched ? elevation : 0,
                borderColor: this.borderColor,
                borderWidth,
                borderRadius,
                height
              }
            ]}
          >
            {children}
          </GradientView>
          <GradientView
            backgroundColor={this.elevationBackgroundColor}
            style={[
              styles.elevation,
              {
                marginTop: elevation,
                borderColor: this.borderColor,
                height,
                borderRadius,
                borderWidth
              }
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  surface: {
    width: "100%",
    overflow: "hidden",
    zIndex: 2
  },
  elevation: {
    width: "100%",
    position: "absolute",
    overflow: "hidden",
    zIndex: 1
  }
});

export default ElevatedView;
