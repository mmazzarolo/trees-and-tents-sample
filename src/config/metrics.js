/* @flow */
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  SCREEN_WIDTH: width < height ? width : height,
  SCREEN_HEIGHT: width < height ? height : width,
  DIGIT_SIZE: 40,
  TILE_BORDER_RADIUS: 4
};
