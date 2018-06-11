/* @flow */
import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import colors from "../config/colors";
import tentImage from "../assets/images/tent.png";
import treeImage from "../assets/images/tree.png";
import ElevatedView from "./ElevatedView";
import metrics from "../config/metrics";

import type { BoardTileStatus } from "../types/BoardTileStatus";

const TENT_IMAGE_ANIM_DURATION = 200;
const SOLVED_ANIM_DURATION = 1500;

type Props = {
  id: number,
  width: number,
  height: number,
  status: BoardTileStatus,
  isValid: boolean,
  onPress: () => mixed,
  isBoardSolved: boolean
};

class Tile extends React.Component<Props> {
  tentImageAnimValue: Animated.Value = new Animated.Value(0);
  solvedAnimValue: Animated.Value = new Animated.Value(0);
  elevatedViewRef: ?ElevatedView = null;

  componentDidMount() {
    if (this.props.status === "SIGNED_AS_TENT") {
      Animated.timing(this.tentImageAnimValue, {
        toValue: 1,
        duration: TENT_IMAGE_ANIM_DURATION,
        useNativeDriver: true
      }).start();
    }
  }

  shouldComponentUpdate(prevProps: Props) {
    const didStatusChange = prevProps.status !== this.props.status;
    const didValidChange = prevProps.isValid !== this.props.isValid;
    const didSolvedChange =
      prevProps.isBoardSolved !== this.props.isBoardSolved;
    if (didStatusChange || didValidChange || didSolvedChange) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.status !== "SIGNED_AS_TENT" &&
      this.props.status === "SIGNED_AS_TENT"
    ) {
      Animated.timing(this.tentImageAnimValue, {
        toValue: 1,
        duration: TENT_IMAGE_ANIM_DURATION,
        useNativeDriver: true
      }).start();
    }

    if (!prevProps.isBoardSolved && this.props.isBoardSolved) {
      Animated.timing(this.solvedAnimValue, {
        toValue: 1,
        duration: SOLVED_ANIM_DURATION,
        useNativeDriver: true
      }).start();
    }
  }

  simulatePress = async () => {
    this.props.onPress();
    if (this.elevatedViewRef) {
      this.elevatedViewRef.simulatePress();
    }
  };

  render() {
    const { status, onPress, width, height, isBoardSolved } = this.props;
    const { tentImageAnimValue, solvedAnimValue } = this;
    const imageTransform = [
      {
        scale: isBoardSolved
          ? solvedAnimValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 1.4, 1],
              extrapolate: "clamp"
            })
          : tentImageAnimValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.01, 1.4, 1],
              extrapolate: "clamp"
            })
      },
      {
        rotate: solvedAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"]
        })
      }
    ];

    let tileContent;
    let backgroundColor = "#fff";
    if (status === "TREE") {
      backgroundColor = colors.FRINGY_FLOWER;
      tileContent = (
        <Animated.Image source={treeImage} style={[styles.treeImage]} />
      );
    } else if (status === "SIGNED_AS_EMPTY") {
      backgroundColor = colors.FRINGY_FLOWER_2;
    } else if (status === "SIGNED_AS_TENT") {
      backgroundColor = colors.FRINGY_FLOWER_2;
      tileContent = (
        <Animated.Image
          source={tentImage}
          style={[styles.tentImage, { transform: imageTransform }]}
        />
      );
    } else {
    }

    const isFlat = status === "PRISTINE" || status === "UNSIGNED";
    return (
      <View
        style={[
          styles.container,
          { borderColor: isFlat ? colors.MERCURY : "transparent" }
        ]}
      >
        <ElevatedView
          ref={ref => {
            this.elevatedViewRef = ref;
          }}
          onPress={onPress}
          backgroundColor={backgroundColor}
          borderRadius={4}
          height={height - 4}
          width={width}
          borderWidth={isFlat ? 0 : 0}
          elevation={4}
          isElevated={!isFlat}
        >
          <View style={[styles.content]}>
            {tileContent ? tileContent : null}
          </View>
        </ElevatedView>
      </View>
    );
  }
}

export default Tile;

const styles = StyleSheet.create({
  container: {
    borderWidth: metrics.TILE_BORDER_WIDTH,
    backgroundColor: "white",
    borderRadius: metrics.TILE_BORDER_RADIUS,
    marginTop: metrics.TILE_MARGIN,
    marginLeft: metrics.TILE_MARGIN
  },
  content: {
    width: "100%",
    height: "100%",
    borderRadius: metrics.TILE_BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 2
  },
  treeImage: {
    resizeMode: "contain",
    width: "80%",
    height: "80%"
  },
  tentImage: {
    resizeMode: "contain",
    width: "80%",
    height: "80%"
  }
});
