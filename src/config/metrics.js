/* @flow */
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width
};
