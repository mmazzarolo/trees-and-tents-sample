/* @flow */
import * as React from "react";
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View
} from "react-native";
import colors from "../config/colors";
import device from "../config/device";
import tentImage from "../assets/images/tent.png";
import treeImage from "../assets/images/tree.png";

import type { BoardTileStatus } from "../types/BoardTileStatus";

const Touchable = device.IS_ANDROID
  ? TouchableWithoutFeedback
  : TouchableOpacity;

const SPAWN_ANIM_DURATION = 200;
const SPAWN_ANIM_DELAY = 200;
const BACKGROUND_ANIM_DURATION = 200;
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
  tileRef: any = null;
  spawnAnimValue: Animated.Value = new Animated.Value(0);
  backgroundAnimValue: Animated.Value = new Animated.Value(0);
  tentImageAnimValue: Animated.Value = new Animated.Value(0);
  solvedAnimValue: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.sequence([
      Animated.delay(SPAWN_ANIM_DELAY + this.props.id * 20),
      Animated.timing(this.spawnAnimValue, {
        toValue: 1,
        duration: SPAWN_ANIM_DURATION,
        useNativeDriver: true
      })
    ]).start();
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
    if (prevProps.status !== this.props.status) {
      if (this.props.status === "UNSIGNED") {
        Animated.timing(this.backgroundAnimValue, {
          toValue: 0,
          duration: BACKGROUND_ANIM_DURATION,
          useNativeDriver: true
        }).start();
        Animated.timing(this.tentImageAnimValue, {
          toValue: 0,
          duration: TENT_IMAGE_ANIM_DURATION,
          useNativeDriver: true
        }).start();
      } else if (this.props.status === "SIGNED_AS_EMPTY") {
        Animated.timing(this.backgroundAnimValue, {
          toValue: 1,
          duration: BACKGROUND_ANIM_DURATION,
          useNativeDriver: true
        }).start();
      } else if (this.props.status === "SIGNED_AS_TENT") {
        Animated.timing(this.tentImageAnimValue, {
          toValue: 1,
          duration: TENT_IMAGE_ANIM_DURATION,
          useNativeDriver: true
        }).start();
      }
    }
    if (!prevProps.isBoardSolved && this.props.isBoardSolved) {
      Animated.timing(this.solvedAnimValue, {
        toValue: 1,
        duration: SOLVED_ANIM_DURATION,
        useNativeDriver: true
      }).start();
    }
  }

  render() {
    const { status, onPress, width, height, isBoardSolved } = this.props;
    console.log("isBoardSolved", isBoardSolved);
    const {
      spawnAnimValue,
      backgroundAnimValue,
      tentImageAnimValue,
      solvedAnimValue
    } = this;
    const imageInTransform = [
      {
        scale: isBoardSolved
          ? solvedAnimValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 1.5, 1],
              extrapolate: "clamp"
            })
          : tentImageAnimValue.interpolate({
              inputRange: [0, 0.75, 1],
              outputRange: [0.01, 1.2, 1],
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
    const imageOutTransform = [
      {
        scale: tentImageAnimValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.01, 0, 1],
          extrapolate: "clamp"
        })
      }
    ];

    let tileContent;
    let backgroundColor;
    let borderColor;
    let backgroundTransform;
    // ************************************
    // PRISTINE
    // ************************************
    if (status === "PRISTINE") {
      borderColor = colors.MERCURY;
      backgroundColor = "white";
      backgroundTransform = [{ scale: 1 }];
      // ************************************
      // TREE
      // ************************************
    } else if (status === "TREE") {
      backgroundTransform = [{ scale: spawnAnimValue }];
      backgroundColor = colors.FRINGY_FLOWER;
      borderColor = colors.SILVER_TREE;
      backgroundTransform = [{ scale: 1 }];
      tileContent = (
        <Animated.Image
          source={treeImage}
          style={[styles.tentImage, { transform: backgroundTransform }]}
        />
      );
      // ************************************
      // SIGNED_AS_EMPTY
      // ************************************
    } else if (status === "SIGNED_AS_EMPTY") {
      backgroundColor = colors.FRINGY_FLOWER_2;
      borderColor = colors.MANTIS;
      backgroundTransform = [{ scale: backgroundAnimValue }];
      // ************************************
      // SIGNED_AS_TENT
      // ************************************
    } else if (status === "SIGNED_AS_TENT") {
      backgroundTransform = [{ scale: backgroundAnimValue }];
      backgroundColor = colors.FRINGY_FLOWER_2;
      borderColor = colors.MANTIS;
      tileContent = (
        <Animated.Image
          source={tentImage}
          style={[styles.tentImage, { transform: imageInTransform }]}
        />
      );
      // ************************************
      // UNSIGNED
      // ************************************
    } else {
      tileContent = (
        <Animated.Image
          source={tentImage}
          style={[styles.tentImage, { transform: imageOutTransform }]}
        />
      );
      backgroundColor = colors.FRINGY_FLOWER_2;
      borderColor = colors.MERCURY;
      backgroundTransform = [{ scale: backgroundAnimValue }];
    }
    return (
      <Touchable onPressIn={onPress}>
        <Animated.View
          style={[styles.container, { opacity: spawnAnimValue, width, height }]}
        >
          <View style={styles.content}>
            <View style={[styles.backgroundContainer, { borderColor }]}>
              <Animated.View
                style={[
                  styles.background,
                  {
                    backgroundColor,
                    transform: backgroundTransform
                  }
                ]}
              />
            </View>
            {tileContent ? tileContent : null}
          </View>
        </Animated.View>
      </Touchable>
    );
  }
}

export default Tile;

const styles = StyleSheet.create({
  container: {
    opacity: 0,
    backgroundColor: "white"
  },
  content: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4
  },
  background: {
    width: "100%",
    height: "100%",
    borderRadius: 3
  },
  treeImage: {
    width: "70%",
    height: "70%"
  },
  tentImage: {
    width: "70%",
    height: "70%"
  }
});
