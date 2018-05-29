/* @flow */
import { Platform } from "react-native";

export default {
  IS_IOS: Platform.OS === "ios",
  IS_ANDROID: Platform.OS === "android"
};
