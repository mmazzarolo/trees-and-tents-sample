/* @flow */
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  SCREEN_WIDTH: width < height ? width : height,
  SCREEN_HEIGHT: width < height ? height : width,
  STATUS_BAR_HEIGHT: 24,
  DIGIT_SIZE: 28,
  TILE_BORDER_RADIUS: 4,
  TILE_MARGIN: 2,
  TILE_BORDER_WIDTH: 1,
  LOGO_SIZE: height * 0.4
};
